import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Tag,
  Space,
  Popconfirm,
  Row,
  Col,
  Card,
  Typography,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { danhSachBuoiTap } from '../mockData';
import { BuoiTap, LoaiBaiTap, TrangThaiBuoiTap } from '../types';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const mauTheoLoai: Record<LoaiBaiTap, string> = {
  Cardio: 'green',
  Strength: 'blue',
  Yoga: 'purple',
  HIIT: 'red',
  Other: 'default',
};

const NhatKyTapLuyen: React.FC = () => {
  const [danhSach, setDanhSach] = useState<BuoiTap[]>(danhSachBuoiTap);
  const [danhSachLoc, setDanhSachLoc] = useState<BuoiTap[]>(danhSachBuoiTap);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [dangSua, setDangSua] = useState<BuoiTap | null>(null);
  const [tuKhoa, setTuKhoa] = useState('');
  const [locLoai, setLocLoai] = useState<LoaiBaiTap | 'all'>('all');
  const [form] = Form.useForm();

  const apDungLoc = (
    danhSachGoc: BuoiTap[],
    tuKhoaTimKiem: string,
    loaiLoc: LoaiBaiTap | 'all',
  ) => {
    let ketQua = danhSachGoc;
    if (tuKhoaTimKiem) {
      ketQua = ketQua.filter(
        (b) =>
          b.loai.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
          b.ghiChu.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()),
      );
    }
    if (loaiLoc !== 'all') {
      ketQua = ketQua.filter((b) => b.loai === loaiLoc);
    }
    setDanhSachLoc(ketQua);
  };

  const xuLyTimKiem = (giaTri: string) => {
    setTuKhoa(giaTri);
    apDungLoc(danhSach, giaTri, locLoai);
  };

  const xuLyLocLoai = (giaTri: LoaiBaiTap | 'all') => {
    setLocLoai(giaTri);
    apDungLoc(danhSach, tuKhoa, giaTri);
  };

  const xuLyLocNgay = (khoangNgay: any) => {
    if (!khoangNgay || khoangNgay.length === 0) {
      apDungLoc(danhSach, tuKhoa, locLoai);
      return;
    }
    const [batDau, ketThuc] = khoangNgay;
    const ketQua = danhSach.filter((b) => {
      const ngay = moment(b.ngay);
      return ngay.isSameOrAfter(batDau, 'day') && ngay.isSameOrBefore(ketThuc, 'day');
    });
    setDanhSachLoc(ketQua);
  };

  const moModalThem = () => {
    setDangSua(null);
    form.resetFields();
    setHienThiModal(true);
  };

  const moModalSua = (buoi: BuoiTap) => {
    setDangSua(buoi);
    form.setFieldsValue({ ...buoi, date: moment(buoi.ngay) });
    setHienThiModal(true);
  };

  const xuLyXoa = (id: string) => {
    const dsMoi = danhSach.filter((b) => b.id !== id);
    setDanhSach(dsMoi);
    apDungLoc(dsMoi, tuKhoa, locLoai);
    message.success('Đã xóa buổi tập');
  };

  const xuLyGuiForm = () => {
    form.validateFields().then((giaTriForm) => {
      const buoiMoi: BuoiTap = {
        id: dangSua ? dangSua.id : String(Date.now()),
        ngay: giaTriForm.date ? giaTriForm.date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        loai: giaTriForm.loai,
        thoiLuong: giaTriForm.thoiLuong,
        calo: giaTriForm.calo,
        ghiChu: giaTriForm.ghiChu || '',
        trangThai: giaTriForm.trangThai,
      };
      let dsMoi: BuoiTap[];
      if (dangSua) {
        dsMoi = danhSach.map((b) => (b.id === dangSua.id ? buoiMoi : b));
        message.success('Đã cập nhật buổi tập');
      } else {
        dsMoi = [buoiMoi, ...danhSach];
        message.success('Đã thêm buổi tập mới');
      }
      setDanhSach(dsMoi);
      apDungLoc(dsMoi, tuKhoa, locLoai);
      setHienThiModal(false);
    });
  };

  const cauHinhCot: ColumnsType<BuoiTap> = [
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      key: 'ngay',
      sorter: (a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime(),
      defaultSortOrder: 'ascend',
      render: (giaTri: string) => <Text strong>{giaTri}</Text>,
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'loai',
      key: 'loai',
      render: (giaTri: LoaiBaiTap) => <Tag color={mauTheoLoai[giaTri]}>{giaTri}</Tag>,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'thoiLuong',
      key: 'thoiLuong',
      render: (giaTri: number) => `${giaTri} phút`,
      sorter: (a, b) => a.thoiLuong - b.thoiLuong,
    },
    {
      title: 'Calo',
      dataIndex: 'calo',
      key: 'calo',
      render: (giaTri: number) => `${giaTri} kcal`,
      sorter: (a, b) => a.calo - b.calo,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      ellipsis: true,
      render: (giaTri: string) => giaTri || <Text type="secondary">—</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (giaTri: TrangThaiBuoiTap) => (
        <Tag color={giaTri === 'Hoàn thành' ? 'success' : 'error'}>{giaTri}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'hanhDong',
      fixed: 'right',
      width: 120,
      render: (_, buoi) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => moModalSua(buoi)} style={{ color: '#6366f1' }} />
          <Popconfirm
            title="Bạn có chắc muốn xóa buổi tập này?"
            onConfirm={() => xuLyXoa(buoi.id)}
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
        <Row justify="space-between" align="middle" gutter={[12, 12]}>
          <Col>
            <Text strong style={{ fontSize: 15 }}>
              <FilterOutlined style={{ color: '#6366f1', marginRight: 8 }} />
              Bộ lọc
            </Text>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>
              Thêm buổi tập
            </Button>
          </Col>
        </Row>
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col xs={24} sm={8}>
            <Input.Search
              placeholder="Tìm theo tên, ghi chú..."
              allowClear
              prefix={<SearchOutlined />}
              onSearch={xuLyTimKiem}
              onChange={(e) => !e.target.value && xuLyTimKiem('')}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Lọc loại bài tập"
              style={{ width: '100%' }}
              onChange={xuLyLocLoai}
              defaultValue="all"
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="Cardio">Cardio</Option>
              <Option value="Strength">Strength</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="HIIT">HIIT</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={xuLyLocNgay}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={cauHinhCot}
          dataSource={danhSachLoc}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={<Text strong style={{ fontSize: 16 }}>{dangSua ? '✏️ Chỉnh sửa buổi tập' : '➕ Thêm buổi tập mới'}</Text>}
        visible={hienThiModal}
        onCancel={() => setHienThiModal(false)}
        onOk={xuLyGuiForm}
        okText={dangSua ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Chọn ngày' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="loai" label="Loại bài tập" rules={[{ required: true, message: 'Chọn loại' }]}>
                <Select placeholder="Chọn loại">
                  <Option value="Cardio">Cardio</Option>
                  <Option value="Strength">Strength</Option>
                  <Option value="Yoga">Yoga</Option>
                  <Option value="HIIT">HIIT</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="thoiLuong" label="Thời lượng (phút)" rules={[{ required: true, message: 'Nhập thời lượng' }]}>
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="calo" label="Calo (kcal)" rules={[{ required: true, message: 'Nhập calo' }]}>
                <InputNumber min={0} max={5000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
            <Select placeholder="Chọn trạng thái">
              <Option value="Hoàn thành">✅ Hoàn thành</Option>
              <Option value="Bỏ lỡ">❌ Bỏ lỡ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm..." />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default NhatKyTapLuyen;
