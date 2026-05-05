import React from 'react';
import { Card, Col, Row, Statistic, Typography, Progress } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { CongViec, ThongKeNhiemVu } from './kieuDuLieu';

const { Title, Text } = Typography;

interface DashboardProps {
  danhSachCongViec: CongViec[];
}

const tinhThongKe = (danhSach: CongViec[]): ThongKeNhiemVu => {
  const ngayHomNay = new Date();
  ngayHomNay.setHours(0, 0, 0, 0);
  const tongSo = danhSach.length;
  const daHoanThanh = danhSach.filter((cv) => cv.trangThai === 'hoanThanh').length;
  const quaHan = danhSach.filter((cv) => {
    if (!cv.hanChot || cv.trangThai === 'hoanThanh') return false;
    const ngayHanChot = new Date(cv.hanChot);
    ngayHanChot.setHours(0, 0, 0, 0);
    return ngayHanChot < ngayHomNay;
  }).length;
  return { tongSo, daHoanThanh, quaHan };
};

const danhSachPhanBo = (danhSach: CongViec[]) => [
  {
    nhan: 'Cần Làm',
    soLuong: danhSach.filter((cv) => cv.trangThai === 'canLam').length,
    mau: '#1890ff',
  },
  {
    nhan: 'Đang Làm',
    soLuong: danhSach.filter((cv) => cv.trangThai === 'dangLam').length,
    mau: '#faad14',
  },
  {
    nhan: 'Hoàn Thành',
    soLuong: danhSach.filter((cv) => cv.trangThai === 'hoanThanh').length,
    mau: '#52c41a',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ danhSachCongViec }) => {
  const { tongSo, daHoanThanh, quaHan } = tinhThongKe(danhSachCongViec);
  const tyLePhanTram = tongSo > 0 ? Math.round((daHoanThanh / tongSo) * 100) : 0;

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Title level={3}>📊 Bảng Điều Khiển</Title>
      </Col>

      <Col xs={24} sm={8}>
        <Card bordered>
          <Statistic
            title="Tổng Số Công Việc"
            value={tongSo}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card bordered>
          <Statistic
            title="Đã Hoàn Thành"
            value={daHoanThanh}
            suffix={<Text type="secondary">/ {tongSo}</Text>}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card bordered>
          <Statistic
            title="Quá Hạn"
            value={quaHan}
            prefix={<WarningOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card title="📈 Tiến Độ Tổng Quan" bordered>
          <Row align="middle" gutter={[0, 8]}>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <Text>Tỷ lệ hoàn thành</Text>
                </Col>
                <Col>
                  <Text strong>{tyLePhanTram}%</Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Progress percent={tyLePhanTram} strokeColor="#52c41a" showInfo={false} />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card title="🗂️ Phân Bổ Theo Trạng Thái" bordered>
          <Row gutter={[0, 8]}>
            {danhSachPhanBo(danhSachCongViec).map((mucThongKe) => (
              <Col span={24} key={mucThongKe.nhan}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text>{mucThongKe.nhan}</Text>
                  </Col>
                  <Col>
                    <Text strong style={{ color: mucThongKe.mau }}>
                      {mucThongKe.soLuong}
                    </Text>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
