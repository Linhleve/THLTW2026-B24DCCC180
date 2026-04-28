import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Timeline,
  Tag,
  Space,
  Divider,
} from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  CalendarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { buoiTapTheoTuan, lichSuCanNang, danhSachBuoiTap } from '../mockData';

const { Text } = Typography;

const mauTheoLoai: Record<string, string> = {
  HIIT: 'red',
  Strength: 'blue',
  Cardio: 'green',
  Yoga: 'purple',
  Other: 'default',
};

const TrangChuDashboard: React.FC = () => {
  const tongBuoiHoanThanh = danhSachBuoiTap.filter((b) => b.trangThai === 'Hoàn thành').length;
  const tongCalo = danhSachBuoiTap
    .filter((b) => b.trangThai === 'Hoàn thành')
    .reduce((tong, b) => tong + b.calo, 0);
  const chuoiNgay = 5;
  const phanTramMucTieu = 60;

  const namBuoiGanNhat = [...danhSachBuoiTap]
    .sort((a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime())
    .slice(0, 5);

  const tuyChinh4TheInfo = [
    {
      tieuDe: 'Tổng buổi tập / tháng',
      giaTri: tongBuoiHoanThanh,
      donVi: 'buổi',
      icon: <CalendarOutlined />,
      mau: '#6366f1',
    },
    {
      tieuDe: 'Tổng calo đốt',
      giaTri: tongCalo,
      donVi: 'kcal',
      icon: <FireOutlined />,
      mau: '#f97316',
    },
    {
      tieuDe: 'Chuỗi ngày tập',
      giaTri: chuoiNgay,
      donVi: 'ngày',
      icon: <ThunderboltOutlined />,
      mau: '#eab308',
    },
    {
      tieuDe: 'Mục tiêu hoàn thành',
      giaTri: phanTramMucTieu,
      donVi: '%',
      icon: <TrophyOutlined />,
      mau: '#10b981',
    },
  ];

  const tuyChinhBieuDoCot: ApexCharts.ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: buoiTapTheoTuan.map((b) => b.tuan),
      labels: { style: { colors: '#8c8c8c' } },
    },
    yaxis: { labels: { style: { colors: '#8c8c8c' } } },
    colors: ['#6366f1'],
    grid: { borderColor: '#f0f0f0' },
    fill: {
      type: 'gradient',
      gradient: { shade: 'light', type: 'vertical', opacityFrom: 1, opacityTo: 0.7 },
    },
    tooltip: { theme: 'light' },
  };

  const duLieuBieuDoCot = [
    { name: 'Buổi tập', data: buoiTapTheoTuan.map((b) => b.soLuong) },
  ];

  const tuyChinhBieuDoDuong: ApexCharts.ApexOptions = {
    chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5, colors: ['#10b981'], strokeColors: '#fff', strokeWidth: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: lichSuCanNang.map((l) => l.ngay),
      labels: { style: { colors: '#8c8c8c' } },
    },
    yaxis: {
      min: 68,
      max: 76,
      labels: {
        style: { colors: '#8c8c8c' },
        formatter: (giaTri: number) => `${giaTri}kg`,
      },
    },
    colors: ['#10b981'],
    grid: { borderColor: '#f0f0f0' },
    tooltip: { theme: 'light' },
  };

  const duLieuBieuDoDuong = [
    { name: 'Cân nặng (kg)', data: lichSuCanNang.map((l) => l.canNang) },
  ];

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {tuyChinh4TheInfo.map((the) => (
          <Col xs={24} sm={12} lg={6} key={the.tieuDe}>
            <Card bodyStyle={{ padding: '20px 24px' }}>
              <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Statistic
                  title={<Text style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{the.tieuDe}</Text>}
                  value={the.giaTri}
                  suffix={<Text style={{ fontSize: 14, color: '#9ca3af', marginLeft: 4 }}>{the.donVi}</Text>}
                  valueStyle={{ color: the.mau, fontWeight: 700, fontSize: 28 }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${the.mau}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: the.mau,
                  }}
                >
                  {the.icon}
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#6366f1' }} />
                <span>Buổi tập theo tuần</span>
              </Space>
            }
          >
            <ReactApexChart options={tuyChinhBieuDoCot} series={duLieuBieuDoCot} type="bar" height={240} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#10b981' }} />
                <span>Biến động cân nặng</span>
              </Space>
            }
          >
            <ReactApexChart options={tuyChinhBieuDoDuong} series={duLieuBieuDoDuong} type="line" height={240} />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <CalendarOutlined style={{ color: '#6366f1' }} />
            <span>5 buổi tập gần nhất</span>
          </Space>
        }
      >
        <Timeline>
          {namBuoiGanNhat.map((buoi) => (
            <Timeline.Item
              key={buoi.id}
              color={buoi.trangThai === 'Hoàn thành' ? 'green' : 'red'}
              dot={
                buoi.trangThai === 'Hoàn thành' ? (
                  <TrophyOutlined style={{ fontSize: 16, color: '#10b981' }} />
                ) : undefined
              }
            >
              <Space size={8} wrap>
                <Text strong>{buoi.ngay}</Text>
                <Tag color={mauTheoLoai[buoi.loai]}>{buoi.loai}</Tag>
                <Text>{buoi.thoiLuong} phút</Text>
                <Text type="secondary">
                  <FireOutlined /> {buoi.calo} kcal
                </Text>
                <Tag color={buoi.trangThai === 'Hoàn thành' ? 'success' : 'error'}>{buoi.trangThai}</Tag>
              </Space>
              {buoi.ghiChu && (
                <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                  {buoi.ghiChu}
                </Text>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </Space>
  );
};

export default TrangChuDashboard;
