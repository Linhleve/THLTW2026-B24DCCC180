import React, { useState } from 'react';
import { Tabs, Spin, Typography, Row, Col } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import suDungDuLieuCongViec from './hocCongViec';
import Dashboard from './Dashboard';
import BangKanban from './BangKanban';
import DanhSachCongViec from './DanhSachCongViec';
import type { CongViec } from './kieuDuLieu';

const TheoDoiCongViecCaNhan: React.FC = () => {
  const {
    danhSachCongViec,
    dangTai,
    themCongViec,
    suaCongViec,
    xoaCongViec,
    sapXepLaiDanhSach,
  } = suDungDuLieuCongViec();

  const [tabHienTai, datTabHienTai] = useState<string>('dashboard');

  const xuLyThemCongViec = (duLieu: Omit<CongViec, 'maId' | 'ngayTao'>) => {
    themCongViec(duLieu);
  };

  const xuLySuaCongViec = (
    maId: string,
    duLieu: Partial<Omit<CongViec, 'maId' | 'ngayTao'>>,
  ) => {
    suaCongViec(maId, duLieu);
  };

  const xuLyXoaCongViec = (maId: string) => {
    xoaCongViec(maId);
  };

  const xuLySapXepLai = (danhSachMoi: CongViec[]) => {
    sapXepLaiDanhSach(danhSachMoi);
  };

  if (dangTai) {
    return (
      <Row justify="center" align="middle" style={{ height: '60vh' }}>
        <Col>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Typography.Title level={2}>✅ Theo Dõi Công Việc Cá Nhân</Typography.Title>
        <Typography.Text type="secondary">
          Quản lý và theo dõi tiến độ công việc của bạn một cách hiệu quả
        </Typography.Text>
      </Col>

      <Col span={24}>
        <Tabs
          activeKey={tabHienTai}
          onChange={datTabHienTai}
          size="large"
        >
          <Tabs.TabPane
            tab={
              <span>
                <DashboardOutlined />
                Bảng Điều Khiển
              </span>
            }
            key="dashboard"
          >
            <Dashboard danhSachCongViec={danhSachCongViec} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <AppstoreOutlined />
                Bảng Kanban
              </span>
            }
            key="kanban"
          >
            <BangKanban
              danhSachCongViec={danhSachCongViec}
              onThem={xuLyThemCongViec}
              onSua={xuLySuaCongViec}
              onXoa={xuLyXoaCongViec}
              onSapXepLai={xuLySapXepLai}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <UnorderedListOutlined />
                Danh Sách
              </span>
            }
            key="danhSach"
          >
            <DanhSachCongViec
              danhSachCongViec={danhSachCongViec}
              onThem={xuLyThemCongViec}
              onSua={xuLySuaCongViec}
              onXoa={xuLyXoaCongViec}
            />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default TheoDoiCongViecCaNhan;
