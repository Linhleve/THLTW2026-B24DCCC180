import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Tag,
  Space,
  Popconfirm,
  Row,
  Col,
  Card,
  Typography,
  message,
  Divider,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { danhSachChiSo } from '../mockData';
import { ChiSoSucKhoe } from '../types';

const { Text } = Typography;

const tinhBMI = (canNang: number, chieuCao: number): number => {
  if (!canNang || !chieuCao) return 0;
  const chieuCaoMet = chieuCao / 100;
  return Math.round((canNang / (chieuCaoMet * chieuCaoMet)) * 100) / 100;
};

const TagPhanLoaiBMI = ({ bmi }: { bmi: number }) => {
  if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
  if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
  if (bmi < 30) return <Tag color="gold">Thừa cân</Tag>;
  return <Tag color="red">Béo phì</Tag>;
};

const NhatKySucKhoe: React.FC = () => {
  const [danhSach, setDanhSach] = useState<ChiSoSucKhoe[]>(danhSachChiSo);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [dangSua, setDangSua] = useState<ChiSoSucKhoe | null>(null);
  const [canNangNhapLive, setCanNangNhapLive] = useState<number>(70);
  const [chieuCaoNhapLive, setChieuCaoNhapLive] = useState<number>(175);
  const [form] = Form.useForm();

  const bmiTinhToan = tinhBMI(canNangNhapLive, chieuCaoNhapLive);

  const moModalThem = () => {
    setDangSua(null);
    setCanNangNhapLive(70);
    setChieuCaoNhapLive(175);
    form.resetFields();
    setHienThiModal(true);
  };

  const moModalSua = (chiSo: ChiSoSucKhoe) => {
    setDangSua(chiSo);
    setCanNangNhapLive(chiSo.canNang);
    setChieuCaoNhapLive(chiSo.chieuCao);
    form.setFieldsValue({ ...chiSo, date: moment(chiSo.ngay) });
    setHienThiModal(true);
  };

  const xuLyXoa = (id: string) => {
    setDanhSach((ds) => ds.filter((c) => c.id !== id));
    message.success('Đã xóa chỉ số sức khỏe');
  };

  const xuLyGuiForm = () => {
    form.validateFields().then((giaTriForm) => {
      const bmiTinh = tinhBMI(giaTriForm.canNang, giaTriForm.chieuCao);
      const chiSoMoi: ChiSoSucKhoe = {
        id: dangSua ? dangSua.id : String(Date.now()),
        ngay: giaTriForm.date ? giaTriForm.date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        canNang: giaTriForm.canNang,
        chieuCao: giaTriForm.chieuCao,
        bmi: bmiTinh,
        nhipTim: giaTriForm.nhipTim,
        gioNgu: giaTriForm.gioNgu,
      };
      if (dangSua) {
        setDanhSach((ds) => ds.map((c) => (c.id === dangSua.id ? chiSoMoi : c)));
        message.success('Đã cập nhật chỉ số');
      } else {
        setDanhSach((ds) => [chiSoMoi, ...ds]);
        message.success('Đã thêm chỉ số mới');
      }
      setHienThiModal(false);
    });
  };

  const cauHinhCot: ColumnsType<ChiSoSucKhoe> = [
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      key: 'ngay',
      sorter: (a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime(),
      defaultSortOrder: 'ascend',
      render: (giaTri: string) => <Text strong>{giaTri}</Text>,
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'canNang',
      key: 'canNang',
      render: (giaTri: number) => `${giaTri} kg`,
      sorter: (a, b) => a.canNang - b.canNang,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'chieuCao',
      key: 'chieuCao',
      render: (giaTri: number) => `${giaTri} cm`,
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      key: 'bmi',
      render: (giaTri: number) => (
        <Space>
          <Text strong>{giaTri}</Text>
          <TagPhanLoaiBMI bmi={giaTri} />
        </Space>
      ),
      sorter: (a, b) => a.bmi - b.bmi,
    },
    {
      title: 'Nhịp tim (bpm)',
      dataIndex: 'nhipTim',
      key: 'nhipTim',
      render: (giaTri: number) => (
        <Space>
          <HeartOutlined style={{ color: '#ef4444' }} />
          {giaTri} bpm
        </Space>
      ),
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'gioNgu',
      key: 'gioNgu',
      render: (giaTri: number) => `${giaTri} giờ`,
      sorter: (a, b) => a.gioNgu - b.gioNgu,
    },
    {
      title: 'Hành động',
      key: 'hanhDong',
      fixed: 'right',
      width: 120,
      render: (_, chiSo) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => moModalSua(chiSo)} style={{ color: '#6366f1' }} />
          <Popconfirm
            title="Bạn có chắc muốn xóa chỉ số này?"
            onConfirm={() => xuLyXoa(chiSo.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Text strong style={{ fontSize: 15 }}>
              <HeartOutlined style={{ color: '#ef4444', marginRight: 8 }} />
              Nhật ký chỉ số sức khỏe
            </Text>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>
              Thêm chỉ số
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={cauHinhCot}
          dataSource={danhSach}
          rowKey="id"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={<Text strong style={{ fontSize: 16 }}>{dangSua ? '✏️ Chỉnh sửa chỉ số sức khỏe' : '➕ Thêm chỉ số sức khỏe'}</Text>}
        visible={hienThiModal}
        onCancel={() => setHienThiModal(false)}
        onOk={xuLyGuiForm}
        okText={dangSua ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="date" label="Ngày đo" rules={[{ required: true, message: 'Chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="canNang" label="Cân nặng (kg)" rules={[{ required: true, message: 'Nhập cân nặng' }]}>
                <InputNumber
                  min={20}
                  max={300}
                  step={0.1}
                  style={{ width: '100%' }}
                  onChange={(val) => setCanNangNhapLive(Number(val) || 0)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="chieuCao" label="Chiều cao (cm)" rules={[{ required: true, message: 'Nhập chiều cao' }]}>
                <InputNumber
                  min={100}
                  max={250}
                  style={{ width: '100%' }}
                  onChange={(val) => setChieuCaoNhapLive(Number(val) || 0)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Card bodyStyle={{ padding: '12px 16px' }} style={{ marginBottom: 16 }}>
            <Space>
              <Text style={{ color: '#6b7280' }}>BMI tính toán:</Text>
              <Text strong style={{ fontSize: 20 }}>{bmiTinhToan || '—'}</Text>
              {bmiTinhToan > 0 && <TagPhanLoaiBMI bmi={bmiTinhToan} />}
            </Space>
          </Card>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="nhipTim" label="Nhịp tim (bpm)" rules={[{ required: true, message: 'Nhập nhịp tim' }]}>
                <InputNumber min={40} max={220} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gioNgu" label="Giờ ngủ" rules={[{ required: true, message: 'Nhập giờ ngủ' }]}>
                <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Space>
  );
};

export default NhatKySucKhoe;
