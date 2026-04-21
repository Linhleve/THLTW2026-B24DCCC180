import React, { useState, useCallback } from 'react';
import { Layout, Menu, Typography, Space, Badge, Breadcrumb } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  TagsOutlined,
  ReadOutlined,
} from '@ant-design/icons';

import type { IThamSoDieuHuong, TenTrang } from './kieu';
import { duLieuCacBaiViet, duLieuCacThe, duLieuTacGia } from './dulieu';
import type { IBaiViet, IThe } from './kieu';

import TrangChuBlog from './trang/TrangChuBlog';
import ChiTietBaiViet from './trang/ChiTietBaiViet';
import TrangGioiThieu from './trang/TrangGioiThieu';
import QuanLyBaiViet from './trang/QuanLyBaiViet';
import QuanLyThe from './trang/QuanLyThe';

const { Header, Content } = Layout;
const { Text } = Typography;

interface ICauHinhMenu {
  key: TenTrang;
  nhan: string;
  icon: React.ReactNode;
}

const danhSachCauHinhMenu: ICauHinhMenu[] = [
  { key: 'trang-chu', nhan: 'Trang Chủ', icon: <HomeOutlined /> },
  { key: 'gioi-thieu', nhan: 'Giới Thiệu', icon: <UserOutlined /> },
  { key: 'quan-ly-bai-viet', nhan: 'Quản Lý Bài Viết', icon: <FileTextOutlined /> },
  { key: 'quan-ly-the', nhan: 'Quản Lý Thẻ', icon: <TagsOutlined /> },
];

const mapTenTrangBreadcrumb: Record<TenTrang, string> = {
  'trang-chu': 'Trang Chủ',
  'chi-tiet-bai-viet': 'Chi Tiết Bài Viết',
  'gioi-thieu': 'Giới Thiệu',
  'quan-ly-bai-viet': 'Quản Lý Bài Viết',
  'quan-ly-the': 'Quản Lý Thẻ',
};

const BlogCaNhan: React.FC = () => {
  const [trangHienTai, setTrangHienTai] = useState<IThamSoDieuHuong>({ trang: 'trang-chu' });
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<IBaiViet[]>(duLieuCacBaiViet);
  const [danhSachThe, setDanhSachThe] = useState<IThe[]>(duLieuCacThe);

  const xuLyDiChuyen = useCallback((thamSo: IThamSoDieuHuong) => {
    setTrangHienTai(thamSo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderNoiDungTrang = (): React.ReactNode => {
    switch (trangHienTai.trang) {
      case 'trang-chu':
        return (
          <TrangChuBlog
            danhSachBaiViet={danhSachBaiViet}
            danhSachThe={danhSachThe}
            onDiChuyen={xuLyDiChuyen}
          />
        );
      case 'chi-tiet-bai-viet':
        return (
          <ChiTietBaiViet
            duongDan={trangHienTai.duongDan ?? ''}
            danhSachBaiViet={danhSachBaiViet}
            onDiChuyen={xuLyDiChuyen}
          />
        );
      case 'gioi-thieu':
        return (
          <TrangGioiThieu
            thongTinNguoiDung={duLieuTacGia}
            danhSachBaiViet={danhSachBaiViet}
            onDiChuyen={xuLyDiChuyen}
          />
        );
      case 'quan-ly-bai-viet':
        return (
          <QuanLyBaiViet
            danhSachBaiViet={danhSachBaiViet}
            danhSachThe={danhSachThe}
            onCapNhatDanhSach={setDanhSachBaiViet}
          />
        );
      case 'quan-ly-the':
        return (
          <QuanLyThe
            danhSachThe={danhSachThe}
            danhSachBaiViet={danhSachBaiViet}
            onCapNhatDanhSachThe={setDanhSachThe}
          />
        );
      default:
        return null;
    }
  };

  const soNhap = danhSachBaiViet.filter((bv) => bv.trangThai === 'nhap').length;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[trangHienTai.trang === 'chi-tiet-bai-viet' ? 'trang-chu' : trangHienTai.trang]}
          style={{ background: 'transparent', border: 'none', flex: 1, justifyContent: 'center' }}
          items={danhSachCauHinhMenu.map((mucMenu) => ({
            key: mucMenu.key,
            icon: mucMenu.icon,
            label: (
              <span>
                {mucMenu.nhan}
                {mucMenu.key === 'quan-ly-bai-viet' && soNhap > 0 && (
                  <Badge count={soNhap} size="small" style={{ marginLeft: 6 }} />
                )}
              </span>
            ),
            onClick: () => xuLyDiChuyen({ trang: mucMenu.key }),
          }))}
        />

        <Space size={8}>
          <img
            src={duLieuTacGia.anhDaiDien}
            alt={duLieuTacGia.tenHienThi}
            style={{ width: 30, height: 30, borderRadius: '50%' }}
          />
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
            {duLieuTacGia.tenHienThi}
          </Text>
        </Space>
      </Header>

      <Content style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <span style={{ cursor: 'pointer' }} onClick={() => xuLyDiChuyen({ trang: 'trang-chu' })}>
              <HomeOutlined /> Blog
            </span>
          </Breadcrumb.Item>
          {trangHienTai.trang !== 'trang-chu' && (
            <Breadcrumb.Item>{mapTenTrangBreadcrumb[trangHienTai.trang]}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        <div style={{ paddingBottom: 32 }}>{renderNoiDungTrang()}</div>
      </Content>
    </Layout>
  );
};

export default BlogCaNhan;
