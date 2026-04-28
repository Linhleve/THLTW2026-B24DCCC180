import React, { useState } from 'react';
import { Layout, Menu, Typography, Space, Badge, Avatar } from 'antd';
import {
  DashboardOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  TrophyOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FireOutlined,
} from '@ant-design/icons';
import TrangChuDashboard from './components/Dashboard';
import NhatKyTapLuyen from './components/WorkoutLog';
import NhatKySucKhoe from './components/HealthMetrics';
import QuanLyMucTieu from './components/GoalManagement';
import ThuVienBaiTap from './components/ExerciseLibrary';

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;

type KhoaTab = 'dashboard' | 'tapLuyen' | 'sucKhoe' | 'mucTieu' | 'thuVien';

interface MucMenu {
  khoa: KhoaTab;
  icon: React.ReactNode;
  nhanHien: string;
}

const danhSachMenu: MucMenu[] = [
  { khoa: 'dashboard', icon: <DashboardOutlined />, nhanHien: 'Dashboard' },
  { khoa: 'tapLuyen', icon: <PlayCircleOutlined />, nhanHien: 'Nhật ký tập luyện' },
  { khoa: 'sucKhoe', icon: <HeartOutlined />, nhanHien: 'Nhật ký sức khỏe' },
  { khoa: 'mucTieu', icon: <TrophyOutlined />, nhanHien: 'Quản lý mục tiêu' },
  { khoa: 'thuVien', icon: <BookOutlined />, nhanHien: 'Thư viện bài tập' },
];

const thongTinTrang: Record<KhoaTab, { tieuDe: string; moTa: string; mau: string }> = {
  dashboard: { tieuDe: 'Dashboard', moTa: 'Tổng quan sức khỏe & tập luyện', mau: '#6366f1' },
  tapLuyen: { tieuDe: 'Nhật ký tập luyện', moTa: 'Theo dõi và quản lý các buổi tập', mau: '#f97316' },
  sucKhoe: { tieuDe: 'Nhật ký sức khỏe', moTa: 'Theo dõi chỉ số cơ thể theo thời gian', mau: '#ef4444' },
  mucTieu: { tieuDe: 'Quản lý mục tiêu', moTa: 'Đặt và theo dõi mục tiêu sức khỏe', mau: '#eab308' },
  thuVien: { tieuDe: 'Thư viện bài tập', moTa: 'Khám phá các bài tập phù hợp', mau: '#10b981' },
};

const TheoDoiSucKhoe: React.FC = () => {
  const [tabDangChon, setTabDangChon] = useState<KhoaTab>('dashboard');
  const [thuGon, setThuGon] = useState(false);

  const thongTinTrangHienTai = thongTinTrang[tabDangChon];

  const renderNoiDung = () => {
    switch (tabDangChon) {
      case 'dashboard': return <TrangChuDashboard />;
      case 'tapLuyen': return <NhatKyTapLuyen />;
      case 'sucKhoe': return <NhatKySucKhoe />;
      case 'mucTieu': return <QuanLyMucTieu />;
      case 'thuVien': return <ThuVienBaiTap />;
      default: return <TrangChuDashboard />;
    }
  };

  return (
    <Layout
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: '#f8fafc',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <Sider
        collapsible
        collapsed={thuGon}
        onCollapse={setThuGon}
        trigger={null}
        width={220}
        collapsedWidth={64}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
          {thuGon ? (
            <div style={{ textAlign: 'center' }}>
              <FireOutlined style={{ fontSize: 24, color: '#818cf8' }} />
            </div>
          ) : (
            <Space direction="vertical" size={0}>
              <Space size={8} align="center">
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FireOutlined style={{ color: '#fff', fontSize: 16 }} />
                </div>
                <Text strong style={{ color: '#e0e7ff', fontSize: 15 }}>FitTracker</Text>
              </Space>
              <Text style={{ color: '#6366f1', fontSize: 11, marginLeft: 40 }}>Sức khỏe & Thể dục</Text>
            </Space>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[tabDangChon]}
          onClick={({ key }) => setTabDangChon(key as KhoaTab)}
          style={{ background: 'transparent', border: 'none', padding: '8px 0' }}
          items={danhSachMenu.map((muc) => ({
            key: muc.khoa,
            icon: <span style={{ fontSize: 16, color: tabDangChon === muc.khoa ? '#818cf8' : 'rgba(255,255,255,0.55)' }}>{muc.icon}</span>,
            label: (
              <Text style={{ color: tabDangChon === muc.khoa ? '#c7d2fe' : 'rgba(255,255,255,0.6)', fontWeight: tabDangChon === muc.khoa ? 600 : 400, fontSize: 13 }}>
                {muc.nhanHien}
              </Text>
            ),
            style: {
              margin: '2px 8px', borderRadius: 10,
              background: tabDangChon === muc.khoa ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))' : 'transparent',
              border: tabDangChon === muc.khoa ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
            },
          }))}
        />

        <div style={{ position: 'absolute', bottom: 56, width: '100%', padding: '0 8px' }}>
          <div
            style={{
              margin: '0 8px', borderRadius: 10,
              padding: thuGon ? '10px' : '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: thuGon ? 'center' : 'left',
            }}
          >
            {thuGon ? (
              <Avatar size={32} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>U</Avatar>
            ) : (
              <Space>
                <Avatar size={32} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>U</Avatar>
                <Space direction="vertical" size={0}>
                  <Text style={{ color: '#e0e7ff', fontSize: 12, fontWeight: 600 }}>Người dùng</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Thành viên Pro</Text>
                </Space>
              </Space>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'absolute', bottom: 0, width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: thuGon ? 'center' : 'flex-start',
            gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 14,
          }}
          onClick={() => setThuGon(!thuGon)}
        >
          {thuGon ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!thuGon && <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Thu gọn</Text>}
        </div>
      </Sider>

      <Layout style={{ background: '#f8fafc' }}>
        <Header
          style={{
            background: '#fff', padding: '0 24px', height: 64, lineHeight: 'normal',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Space direction="vertical" size={2}>
            <Title level={5} style={{ margin: 0, color: thongTinTrangHienTai.mau, fontWeight: 700, lineHeight: 1.2 }}>
              {thongTinTrangHienTai.tieuDe}
            </Title>
            <Text style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.4, display: 'block' }}>{thongTinTrangHienTai.moTa}</Text>
          </Space>
          <Space size={8}>
            <Badge count={5} size="small">
              <Avatar style={{ background: 'linear-gradient(135deg, #f0f0f0, #e5e7eb)', color: '#6b7280', cursor: 'pointer' }}>
                🔔
              </Avatar>
            </Badge>
            <Avatar style={{ background: `linear-gradient(135deg, ${thongTinTrangHienTai.mau}cc, ${thongTinTrangHienTai.mau})`, fontWeight: 700, cursor: 'pointer' }}>
              U
            </Avatar>
          </Space>
        </Header>

        <Content style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 56px - 64px)' }}>
          {renderNoiDung()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TheoDoiSucKhoe;
