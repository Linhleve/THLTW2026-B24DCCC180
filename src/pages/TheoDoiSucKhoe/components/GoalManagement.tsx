import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Tag,
  Progress,
  Space,
  Popconfirm,
  Typography,
  Segmented,
  message,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined, TrophyOutlined, CalendarOutlined, AimOutlined } from '@ant-design/icons';
import moment from 'moment';
import { danhSachMucTieu } from '../mockData';
import { MucTieu, LoaiMucTieu, TrangThaiMucTieu } from '../types';

const { Text } = Typography;
const { Option } = Select;

const mauTheoLoai: Record<LoaiMucTieu, string> = {
  'Cân nặng': 'blue',
  'Thể lực': 'green',
  'Dinh dưỡng': 'orange',
  'Khác': 'purple',
};

const mauTheoTrangThai: Record<TrangThaiMucTieu, string> = {
  'Đang thực hiện': 'processing',
  'Đã đạt': 'success',
  'Đã hủy': 'error',
};

const tinhPhanTram = (mucTieu: MucTieu) =>
  Math.min(100, Math.round((mucTieu.giaTriHienTai / mucTieu.giaTriMucTieu) * 100));

const mauThanhTien = (phanTram: number) => {
  if (phanTram >= 100) return '#10b981';
  if (phanTram >= 60) return '#6366f1';
  if (phanTram >= 30) return '#f59e0b';
  return '#ef4444';
};

const QuanLyMucTieu: React.FC = () => {
  const [danhSach, setDanhSach] = useState<MucTieu[]>(danhSachMucTieu);
  const [hienThiNganKeo, setHienThiNganKeo] = useState(false);
  const [locTrangThai, setLocTrangThai] = useState<TrangThaiMucTieu | 'Tất cả'>('Tất cả');
  const [form] = Form.useForm();

  const danhSachLoc =
    locTrangThai === 'Tất cả' ? danhSach : danhSach.filter((mt) => mt.trangThai === locTrangThai);

  const xuLyXoa = (id: string) => {
    setDanhSach((ds) => ds.filter((mt) => mt.id !== id));
    message.success('Đã xóa mục tiêu');
  };

  const xuLyCapNhatGiaTri = (id: string, giaTriMoi: number | null) => {
    if (giaTriMoi === null) return;
    setDanhSach((ds) =>
      ds.map((mt) => {
        if (mt.id !== id) return mt;
        const capNhat: MucTieu = { ...mt, giaTriHienTai: giaTriMoi };
        if (giaTriMoi >= mt.giaTriMucTieu && mt.trangThai === 'Đang thực hiện') {
          capNhat.trangThai = 'Đã đạt';
          message.success(`🎉 Chúc mừng! Bạn đã đạt mục tiêu "${mt.ten}"!`);
        }
        return capNhat;
      }),
    );
  };

  const xuLyThemMucTieu = () => {
    form.validateFields().then((giaTriForm) => {
      const mucTieuMoi: MucTieu = {
        id: String(Date.now()),
        ten: giaTriForm.ten,
        loai: giaTriForm.loai,
        giaTriMucTieu: giaTriForm.giaTriMucTieu,
        giaTriHienTai: giaTriForm.giaTriHienTai || 0,
        donVi: giaTriForm.donVi,
        hanChot: giaTriForm.hanChot ? giaTriForm.hanChot.format('YYYY-MM-DD') : '',
        trangThai: 'Đang thực hiện',
      };
      setDanhSach((ds) => [mucTieuMoi, ...ds]);
      message.success('Đã thêm mục tiêu mới');
      setHienThiNganKeo(false);
      form.resetFields();
    }).catch(() => {
      message.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
    });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Row justify="space-between" align="middle" wrap gutter={[0, 12]}>
          <Col>
            <Segmented
              options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']}
              value={locTrangThai}
              onChange={(val) => setLocTrangThai(val as TrangThaiMucTieu | 'Tất cả')}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiNganKeo(true)}>
              Thêm mục tiêu
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {danhSachLoc.length === 0 && (
          <Col span={24}>
            <Card style={{ textAlign: 'center' }}>
              <Space direction="vertical" align="center" style={{ padding: '32px 0' }}>
                <AimOutlined style={{ fontSize: 40, color: '#d1d5db' }} />
                <Text type="secondary">Không có mục tiêu nào</Text>
              </Space>
            </Card>
          </Col>
        )}
        {danhSachLoc.map((mucTieu) => {
          const phanTram = tinhPhanTram(mucTieu);
          const mauTien = mauThanhTien(phanTram);
          return (
            <Col xs={24} sm={12} lg={8} key={mucTieu.id}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <Row justify="space-between" align="top">
                    <Col flex="1">
                      <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
                        {mucTieu.ten}
                      </Text>
                      <Space size={6}>
                        <Tag color={mauTheoLoai[mucTieu.loai]}>{mucTieu.loai}</Tag>
                        <Tag color={mauTheoTrangThai[mucTieu.trangThai]}>{mucTieu.trangThai}</Tag>
                      </Space>
                    </Col>
                    <Col>
                      <Popconfirm
                        title="Xóa mục tiêu này?"
                        onConfirm={() => xuLyXoa(mucTieu.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Col>
                  </Row>

                  <div>
                    <Row justify="space-between" style={{ marginBottom: 6 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Tiến trình</Text>
                      <Text strong style={{ color: mauTien, fontSize: 13 }}>{phanTram}%</Text>
                    </Row>
                    <Progress
                      percent={phanTram}
                      showInfo={false}
                      strokeColor={mauTien}
                      trailColor="#f3f4f6"
                      strokeWidth={8}
                    />
                  </div>

                  <Row align="middle" justify="space-between">
                    <Text type="secondary" style={{ fontSize: 12 }}>Giá trị hiện tại</Text>
                    <Space size={4} align="center">
                      <InputNumber
                        size="small"
                        min={0}
                        max={mucTieu.giaTriMucTieu * 2}
                        step={0.5}
                        value={mucTieu.giaTriHienTai}
                        onChange={(val) => xuLyCapNhatGiaTri(mucTieu.id, val)}
                        style={{ width: 80 }}
                        disabled={mucTieu.trangThai !== 'Đang thực hiện'}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        / {mucTieu.giaTriMucTieu} {mucTieu.donVi}
                      </Text>
                    </Space>
                  </Row>

                  <Divider style={{ margin: '4px 0' }} />

                  <Space size={6}>
                    <CalendarOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Deadline: {mucTieu.hanChot || '—'}
                    </Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Drawer
        title={
          <Space>
            <TrophyOutlined style={{ color: '#6366f1' }} />
            <Text strong>Thêm mục tiêu mới</Text>
          </Space>
        }
        width={440}
        visible={hienThiNganKeo}
        onClose={() => setHienThiNganKeo(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setHienThiNganKeo(false)}>Hủy</Button>
              <Button type="primary" onClick={xuLyThemMucTieu}>
                Thêm mục tiêu
              </Button>
            </Space>
          </div>
        }
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên mục tiêu" rules={[{ required: true, message: 'Nhập tên mục tiêu' }]}>
            <Input placeholder="VD: Giảm 5kg trong 3 tháng" />
          </Form.Item>
          <Form.Item name="loai" label="Loại mục tiêu" rules={[{ required: true, message: 'Chọn loại' }]}>
            <Select placeholder="Chọn loại">
              <Option value="Cân nặng">Cân nặng</Option>
              <Option value="Thể lực">Thể lực</Option>
              <Option value="Dinh dưỡng">Dinh dưỡng</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item name="giaTriMucTieu" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Nhập giá trị' }]}>
                <InputNumber min={0.1} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="donVi" label="Đơn vị" rules={[{ required: true, message: 'Nhập đơn vị' }]}>
                <Input placeholder="kg / phút..." />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="giaTriHienTai" label="Giá trị hiện tại (nếu có)">
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="hanChot" label="Deadline">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
};

export default QuanLyMucTieu;
