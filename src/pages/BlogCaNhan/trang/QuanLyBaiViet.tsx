import React, { useState, useMemo, useCallback } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select,
  Popconfirm, message, Typography, Row, Col, Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { IBaiViet, IThe, IGiaTriFormBaiViet, TrangThaiBaiViet } from '../kieu';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PropsQuanLyBaiViet {
  danhSachBaiViet: IBaiViet[];
  danhSachThe: IThe[];
  onCapNhatDanhSach: (danhSachMoi: IBaiViet[]) => void;
}

const QuanLyBaiViet: React.FC<PropsQuanLyBaiViet> = ({ danhSachBaiViet, danhSachThe, onCapNhatDanhSach }) => {
  const [hieuThiModal, setHieuThiModal] = useState<boolean>(false);
  const [baiVietDangSua, setBaiVietDangSua] = useState<IBaiViet | null>(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [boLocTrangThai, setBoLocTrangThai] = useState<TrangThaiBaiViet | 'tat_ca'>('tat_ca');
  const [dangTai, setDangTai] = useState<boolean>(false);

  const [form] = Form.useForm<IGiaTriFormBaiViet>();

  const danhSachDaLoc = useMemo<IBaiViet[]>(() =>
    danhSachBaiViet
      .filter((bv) => bv.tieuDe.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()))
      .filter((bv) => boLocTrangThai === 'tat_ca' || bv.trangThai === boLocTrangThai),
    [danhSachBaiViet, tuKhoaTimKiem, boLocTrangThai],
  );

  const xuLyMoModal = useCallback((baiViet?: IBaiViet) => {
    if (baiViet) {
      setBaiVietDangSua(baiViet);
      form.setFieldsValue({
        tieuDe: baiViet.tieuDe,
        duongDan: baiViet.duongDan,
        anhDaiDien: baiViet.anhDaiDien,
        tomTat: baiViet.tomTat,
        noiDung: baiViet.noiDung.replace(/<[^>]*>/g, ''),
        cacThe: baiViet.cacThe.map((the) => the.tenThe),
        trangThai: baiViet.trangThai,
      });
    } else {
      setBaiVietDangSua(null);
      form.resetFields();
    }
    setHieuThiModal(true);
  }, [form]);

  const xuLyDongModal = useCallback(() => {
    setHieuThiModal(false);
    setBaiVietDangSua(null);
    form.resetFields();
  }, [form]);

  const xuLyLuuBaiViet = useCallback(async () => {
    try {
      const giaTriForm = await form.validateFields();
      setDangTai(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      const cacTheChon: IThe[] = giaTriForm.cacThe.map((tenThe) => {
        const timThay = danhSachThe.find((t) => t.tenThe === tenThe);
        return timThay ?? { id: `the-${Date.now()}-${tenThe}`, tenThe, mauSac: 'default' };
      });

      if (baiVietDangSua) {
        const danhSachMoi = danhSachBaiViet.map((bv) =>
          bv.id === baiVietDangSua.id
            ? { ...bv, ...giaTriForm, cacThe: cacTheChon, noiDung: `<p>${giaTriForm.noiDung}</p>`, ngayCapNhat: new Date().toISOString() }
            : bv,
        );
        onCapNhatDanhSach(danhSachMoi);
        message.success('Cập nhật bài viết thành công!');
      } else {
        const baiVietMoi: IBaiViet = {
          id: `bv-${Date.now()}`,
          ...giaTriForm,
          tomTat: giaTriForm.tomTat ?? '',
          noiDung: `<p>${giaTriForm.noiDung}</p>`,
          cacThe: cacTheChon,
          tacGia: danhSachBaiViet[0]?.tacGia,
          luotXem: 0,
          ngayTao: new Date().toISOString(),
          ngayCapNhat: new Date().toISOString(),
        };
        onCapNhatDanhSach([...danhSachBaiViet, baiVietMoi]);
        message.success('Thêm bài viết thành công!');
      }
      setDangTai(false);
      xuLyDongModal();
    } catch {
      setDangTai(false);
    }
  }, [form, baiVietDangSua, danhSachBaiViet, danhSachThe, onCapNhatDanhSach, xuLyDongModal]);

  const xuLyXoaBaiViet = useCallback((id: string) => {
    onCapNhatDanhSach(danhSachBaiViet.filter((bv) => bv.id !== id));
    message.success('Đã xóa bài viết!');
  }, [danhSachBaiViet, onCapNhatDanhSach]);

  const cauHinhCot: ColumnsType<IBaiViet> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      align: 'center' as const,
      ellipsis: true,
      render: (tieuDe: string) => <Text strong>{tieuDe}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      align: 'center' as const,
      width: 120,
      render: (trangThai: TrangThaiBaiViet) => (
        <Tag color={trangThai === 'da_dang' ? 'success' : 'default'}>
          {trangThai === 'da_dang' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'cacThe',
      key: 'cacThe',
      align: 'center' as const,
      width: 200,
      render: (cacThe: IThe[]) => (
        <Space wrap>
          {cacThe.slice(0, 2).map((the) => (
            <Tag key={the.id} color={the.mauSac}>{the.tenThe}</Tag>
          ))}
          {cacThe.length > 2 && <Tag>+{cacThe.length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'luotXem',
      key: 'luotXem',
      align: 'center' as const,
      width: 100,
      sorter: (a, b) => a.luotXem - b.luotXem,
      render: (luotXem: number) => luotXem.toLocaleString('vi-VN'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      align: 'center' as const,
      width: 110,
      sorter: (a, b) => new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime(),
      render: (ngay: string) => new Date(ngay).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'hanhDong',
      align: 'center' as const,
      width: 130,
      render: (_: unknown, baiViet: IBaiViet) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => xuLyMoModal(baiViet)}
          >
            Sửa
          </Button>
          <Popconfirm
            title={
              <span>
                <strong>Xóa bài viết</strong>
                <br />
                <span style={{ fontWeight: 400 }}>Bạn có chắc chắn muốn xóa không?</span>
              </span>
            }
            onConfirm={() => xuLyXoaBaiViet(baiViet.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>✈️ Quản Lý Bài Viết</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { nhan: 'Tổng bài viết', giaTri: danhSachBaiViet.length },
          { nhan: 'Đã đăng', giaTri: danhSachBaiViet.filter((bv) => bv.trangThai === 'da_dang').length },
          { nhan: 'Nháp', giaTri: danhSachBaiViet.filter((bv) => bv.trangThai === 'nhap').length },
          { nhan: 'Tổng lượt xem', giaTri: danhSachBaiViet.reduce((t, bv) => t + bv.luotXem, 0).toLocaleString('vi-VN') },
        ].map((item) => (
          <Col key={item.nhan} xs={12} sm={6}>
            <Card bordered={false} style={{ background: '#fafafa', textAlign: 'center' }} bodyStyle={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{item.giaTri}</div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.nhan}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} style={{ marginBottom: 12 }} bodyStyle={{ padding: '12px 16px' }}>
        <Row justify="space-between" align="middle" gutter={[12, 12]}>
          <Col>
            <Space wrap>
              <Input
                placeholder="Tìm tiêu đề bài viết..."
                prefix={<SearchOutlined />}
                value={tuKhoaTimKiem}
                onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                allowClear
                style={{ width: 240 }}
              />
              <Select
                value={boLocTrangThai}
                onChange={setBoLocTrangThai}
                style={{ width: 160 }}
              >
                <Select.Option value="tat_ca">Tất cả trạng thái</Select.Option>
                <Select.Option value="da_dang">Đã đăng</Select.Option>
                <Select.Option value="nhap">Nháp</Select.Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => xuLyMoModal()}>
              Thêm bài viết
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table<IBaiViet>
          columns={cauHinhCot}
          dataSource={danhSachDaLoc}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 8,
            showTotal: (tong) => `Tổng ${tong} bài viết`,
            showSizeChanger: false,
          }}
          locale={{ emptyText: 'Không tìm thấy bài viết nào' }}
        />
      </Card>

      <Modal
        title={baiVietDangSua ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
        visible={hieuThiModal}
        onCancel={xuLyDongModal}
        onOk={xuLyLuuBaiViet}
        okText={baiVietDangSua ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy bỏ"
        confirmLoading={dangTai}
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 12 }}
          initialValues={{ trangThai: 'nhap', cacThe: [] }}
        >
          <Form.Item
            name="tieuDe"
            label="Tiêu đề bài viết"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { min: 10, message: 'Tiêu đề phải ít nhất 10 ký tự!' },
            ]}
          >
            <Input placeholder="Nhập tiêu đề bài viết..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="duongDan"
                label="Đường dẫn (slug)"
                rules={[
                  { required: true, message: 'Vui lòng nhập đường dẫn!' },
                  { pattern: /^[a-z0-9-]+$/, message: 'Chỉ dùng chữ thường, số và dấu gạch ngang!' },
                ]}
              >
                <Input placeholder="ten-bai-viet-cua-ban" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="nhap">Nháp</Select.Option>
                  <Select.Option value="da_dang">Đã đăng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="anhDaiDien" label="URL ảnh đại diện">
            <Input placeholder="https://example.com/anh.jpg" />
          </Form.Item>

          <Form.Item name="cacThe" label="Thẻ bài viết">
            <Select mode="tags" placeholder="Chọn hoặc thêm thẻ mới..." tokenSeparators={[',']}>
              {danhSachThe.map((the) => (
                <Select.Option key={the.id} value={the.tenThe}>{the.tenThe}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tomTat" label="Tóm tắt">
            <TextArea rows={2} placeholder="Mô tả ngắn về bài viết..." showCount maxLength={300} />
          </Form.Item>

          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <TextArea rows={6} placeholder="Nhập nội dung bài viết..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyBaiViet;
