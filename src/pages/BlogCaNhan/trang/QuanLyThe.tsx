import React, { useState, useMemo, useCallback } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input,
  Popconfirm, message, Typography, Card, Row, Col, Badge,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { IBaiViet, IThe, IGiaTriFormThe } from '../kieu';

const { Title, Text } = Typography;

interface PropsQuanLyThe {
  danhSachThe: IThe[];
  danhSachBaiViet: IBaiViet[];
  onCapNhatDanhSachThe: (danhSachMoi: IThe[]) => void;
}

const MANG_MAU_SAC = [
  'magenta', 'red', 'volcano', 'orange', 'gold',
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
];

const QuanLyThe: React.FC<PropsQuanLyThe> = ({ danhSachThe, danhSachBaiViet, onCapNhatDanhSachThe }) => {
  const [hieuThiModal, setHieuThiModal] = useState<boolean>(false);
  const [theDangSua, setTheDangSua] = useState<IThe | null>(null);
  const [dangTai, setDangTai] = useState<boolean>(false);

  const [form] = Form.useForm<IGiaTriFormThe>();

  const demSoBaiVietTheoThe = useCallback(
    (tenThe: string): number =>
      danhSachBaiViet.filter((bv) => bv.cacThe.some((the) => the.tenThe === tenThe)).length,
    [danhSachBaiViet],
  );

  const danhSachTheVoiSoBaiViet = useMemo(
    () => danhSachThe.map((the) => ({ ...the, soBaiViet: demSoBaiVietTheoThe(the.tenThe) })),
    [danhSachThe, demSoBaiVietTheoThe],
  );

  const xuLyMoModal = useCallback((the?: IThe) => {
    if (the) {
      setTheDangSua(the);
      form.setFieldsValue({ tenThe: the.tenThe });
    } else {
      setTheDangSua(null);
      form.resetFields();
    }
    setHieuThiModal(true);
  }, [form]);

  const xuLyDongModal = useCallback(() => {
    setHieuThiModal(false);
    setTheDangSua(null);
    form.resetFields();
  }, [form]);

  const xuLyLuuThe = useCallback(async () => {
    try {
      const giaTriForm = await form.validateFields();
      setDangTai(true);

      const trungTen = danhSachThe.some(
        (the) => the.tenThe.toLowerCase() === giaTriForm.tenThe.toLowerCase() && the.id !== theDangSua?.id,
      );
      if (trungTen) {
        message.error('Tên thẻ đã tồn tại!');
        setDangTai(false);
        return;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 400));

      if (theDangSua) {
        onCapNhatDanhSachThe(danhSachThe.map((the) =>
          the.id === theDangSua.id ? { ...the, tenThe: giaTriForm.tenThe } : the,
        ));
        message.success('Cập nhật thẻ thành công!');
      } else {
        const mauNgauNhien = MANG_MAU_SAC[Math.floor(Math.random() * MANG_MAU_SAC.length)];
        onCapNhatDanhSachThe([...danhSachThe, { id: `the-${Date.now()}`, tenThe: giaTriForm.tenThe, mauSac: mauNgauNhien }]);
        message.success('Thêm thẻ mới thành công!');
      }

      setDangTai(false);
      xuLyDongModal();
    } catch {
      setDangTai(false);
    }
  }, [form, theDangSua, danhSachThe, onCapNhatDanhSachThe, xuLyDongModal]);

  const xuLyXoaThe = useCallback((id: string) => {
    const the = danhSachThe.find((t) => t.id === id);
    const soBaiViet = the ? demSoBaiVietTheoThe(the.tenThe) : 0;
    if (soBaiViet > 0) {
      message.warning(`Không thể xóa thẻ đang dùng trong ${soBaiViet} bài viết!`);
      return;
    }
    onCapNhatDanhSachThe(danhSachThe.filter((t) => t.id !== id));
    message.success('Đã xóa thẻ!');
  }, [danhSachThe, onCapNhatDanhSachThe, demSoBaiVietTheoThe]);

  const cauHinhCot: ColumnsType<IThe & { soBaiViet: number }> = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center' as const,
      width: 60,
      render: (_: unknown, __: unknown, chiSo: number) => <Text type="secondary">{chiSo + 1}</Text>,
    },
    {
      title: 'Tên thẻ',
      dataIndex: 'tenThe',
      key: 'tenThe',
      align: 'center' as const,
      render: (tenThe: string, ban: IThe & { soBaiViet: number }) => (
        <Tag color={ban.mauSac} style={{ fontSize: 13, padding: '3px 12px' }}>{tenThe}</Tag>
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'mauSac',
      key: 'mauSac',
      align: 'center' as const,
      width: 120,
      render: (mauSac: string) => <Text type="secondary">{mauSac}</Text>,
    },
    {
      title: 'Số bài viết',
      dataIndex: 'soBaiViet',
      key: 'soBaiViet',
      align: 'center' as const,
      width: 120,
      sorter: (a, b) => a.soBaiViet - b.soBaiViet,
      render: (soBaiViet: number) => <Badge count={soBaiViet} showZero style={{ background: soBaiViet > 0 ? '#1890ff' : '#d9d9d9' }} />,
    },
    {
      title: 'Hành động',
      key: 'hanhDong',
      align: 'center' as const,
      width: 130,
      render: (_: unknown, the: IThe & { soBaiViet: number }) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => xuLyMoModal(the)}>Sửa</Button>
          <Popconfirm
            title={
              <span>
                <strong>Xóa thẻ</strong>
                <br />
                <span style={{ fontWeight: 400 }}>
                  {the.soBaiViet > 0
                    ? `Thẻ đang dùng trong ${the.soBaiViet} bài viết, không thể xóa!`
                    : 'Bạn có chắc muốn xóa thẻ này không?'}
                </span>
              </span>
            }
            onConfirm={() => xuLyXoaThe(the.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, disabled: the.soBaiViet > 0 }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} disabled={the.soBaiViet > 0}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>🏷️ Quản Lý Thẻ</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { nhan: 'Tổng số thẻ', giaTri: danhSachThe.length },
          { nhan: 'Thẻ đang dùng', giaTri: danhSachTheVoiSoBaiViet.filter((t) => t.soBaiViet > 0).length },
          { nhan: 'Thẻ chưa dùng', giaTri: danhSachTheVoiSoBaiViet.filter((t) => t.soBaiViet === 0).length },
          { nhan: 'Max bài/thẻ', giaTri: Math.max(...danhSachTheVoiSoBaiViet.map((t) => t.soBaiViet), 0) },
        ].map((item) => (
          <Col key={item.nhan} xs={12} sm={6}>
            <Card bordered={false} style={{ background: '#fafafa', textAlign: 'center' }} bodyStyle={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{item.giaTri}</div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.nhan}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        bordered={false}
        title={<Space><TagsOutlined /> Tất cả thẻ</Space>}
        style={{ marginBottom: 12 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => xuLyMoModal()}>
            Thêm thẻ
          </Button>
        }
      >
        <Space wrap>
          {danhSachTheVoiSoBaiViet.map((the) => (
            <Tag key={the.id} color={the.mauSac} style={{ fontSize: 13, padding: '3px 12px' }}>
              {the.tenThe} ({the.soBaiViet})
            </Tag>
          ))}
        </Space>
      </Card>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table<IThe & { soBaiViet: number }>
          columns={cauHinhCot}
          dataSource={danhSachTheVoiSoBaiViet}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (tong) => `Tổng ${tong} thẻ`, showSizeChanger: false }}
          locale={{ emptyText: 'Chưa có thẻ nào' }}
        />
      </Card>

      <Modal
        title={theDangSua ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
        visible={hieuThiModal}
        onCancel={xuLyDongModal}
        onOk={xuLyLuuThe}
        okText={theDangSua ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy bỏ"
        confirmLoading={dangTai}
        width={400}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item
            name="tenThe"
            label="Tên thẻ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thẻ!' },
              { min: 2, message: 'Tên thẻ phải ít nhất 2 ký tự!' },
              { max: 30, message: 'Tên thẻ không quá 30 ký tự!' },
            ]}
          >
            <Input
              placeholder="Ví dụ: Việt Nam, Phượt, Ẩm thực, Châu Âu..."
              prefix={<TagsOutlined />}
            />
          </Form.Item>
          {theDangSua && (
            <Card bordered={false} style={{ background: '#fafafa' }} bodyStyle={{ padding: '8px 12px' }}>
              Màu hiện tại: <Tag color={theDangSua.mauSac}>{theDangSua.tenThe}</Tag>
            </Card>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThe;
