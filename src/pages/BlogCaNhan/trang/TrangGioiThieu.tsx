import React from 'react';
import { Row, Col, Card, Avatar, Tag, Typography, Space, Divider, Button, Tooltip } from 'antd';
import {
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GlobalOutlined,
  FacebookOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import type { IThongTinNguoiDung, IBaiViet, IThamSoDieuHuong } from '../kieu';

const { Title, Paragraph, Text } = Typography;

interface PropsTrangGioiThieu {
  thongTinNguoiDung: IThongTinNguoiDung;
  danhSachBaiViet: IBaiViet[];
  onDiChuyen: (thamSo: IThamSoDieuHuong) => void;
}

const TrangGioiThieu: React.FC<PropsTrangGioiThieu> = ({ thongTinNguoiDung, danhSachBaiViet, onDiChuyen }) => {
  const tongSoBaiViet = danhSachBaiViet.filter((bv) => bv.trangThai === 'da_dang').length;
  const tongLuotXem = danhSachBaiViet.reduce((tong, bv) => tong + bv.luotXem, 0);

  const danhSachLienKet = [
    { ten: 'GitHub', icon: <GithubOutlined />, url: thongTinNguoiDung.lienKetMangXaHoi.github },
    { ten: 'LinkedIn', icon: <LinkedinOutlined />, url: thongTinNguoiDung.lienKetMangXaHoi.linkedin },
    { ten: 'Twitter', icon: <TwitterOutlined />, url: thongTinNguoiDung.lienKetMangXaHoi.twitter },
    { ten: 'Website', icon: <GlobalOutlined />, url: thongTinNguoiDung.lienKetMangXaHoi.website },
    { ten: 'Facebook', icon: <FacebookOutlined />, url: thongTinNguoiDung.lienKetMangXaHoi.facebook },
  ].filter((lk) => !!lk.url);

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={8}>
        <Card bordered={false} style={{ textAlign: 'center', marginBottom: 16 }}>
          <Avatar
            size={96}
            src={thongTinNguoiDung.anhDaiDien}
            style={{ marginBottom: 12 }}
          />
          <Title level={4} style={{ margin: 0 }}>{thongTinNguoiDung.tenHienThi}</Title>
          <Text type="secondary">@{thongTinNguoiDung.tenDangNhap}</Text>

          <div style={{ marginTop: 12 }}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space size={6}>
                <EnvironmentOutlined />
                <Text type="secondary" style={{ fontSize: 13 }}>{thongTinNguoiDung.viTri}</Text>
              </Space>
              <Space size={6}>
                <MailOutlined />
                <Text type="secondary" style={{ fontSize: 13 }}>{thongTinNguoiDung.email}</Text>
              </Space>
            </Space>
          </div>

          <Divider />

          <Space size={8} wrap>
            {danhSachLienKet.map((lienKet) => (
              <Tooltip key={lienKet.ten} title={lienKet.ten}>
                <Button
                  shape="circle"
                  icon={lienKet.icon}
                  href={lienKet.url}
                  target="_blank"
                />
              </Tooltip>
            ))}
          </Space>
        </Card>

        <Card bordered={false} title="Thống Kê" style={{ marginBottom: 16 }}>
          <Row gutter={[8, 8]}>
            {[
              { nhan: 'Bài viết', giaTri: tongSoBaiViet },
              { nhan: 'Lượt xem', giaTri: tongLuotXem.toLocaleString('vi-VN') },
              { nhan: 'Chủ đề', giaTri: 8 },
              { nhan: 'Năm KN', giaTri: 5 },
            ].map((item) => (
              <Col span={12} key={item.nhan}>
                <Card
                  bordered={false}
                  style={{ background: '#fafafa', textAlign: 'center' }}
                  bodyStyle={{ padding: '12px 8px' }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{item.giaTri}</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.nhan}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        <Card bordered={false} title="Kỹ Năng">
          <Space wrap>
            {thongTinNguoiDung.kyNang.map((kyNang) => (
              <Tag key={kyNang} color="blue">{kyNang}</Tag>
            ))}
          </Space>
        </Card>
      </Col>

      <Col xs={24} lg={16}>
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Title level={4}>👋 Xin chào! Tôi là {thongTinNguoiDung.tenHienThi}</Title>
          <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>
            {thongTinNguoiDung.tieuSu}
          </Paragraph>

          <Divider />

          <Title level={5}>Tôi tập trung vào</Title>
          <Row gutter={[12, 12]}>
            {[
              { icon: '🚵‍♂️', tieuDe: 'Phượt bụi & Khám phá', moTa: 'Chinh phục những cung đường đèo, khám phá vùng sâu vùng xa' },
              { icon: '🍜', tieuDe: 'Văn hóa Ẩm thực', moTa: 'Trải nghiệm hương vị bản địa, đặc sản đường phố độc đáo' },
              { icon: '🏯', tieuDe: 'Di tích & Lịch sử', moTa: 'Tìm hiểu sâu về văn hóa, con người và lịch sử các vùng đất' },
              { icon: '📸', tieuDe: 'Nhiếp ảnh Du lịch', moTa: 'Ghi lại những khoảnh khắc tuyệt đẹp bằng ống kính chuyên nghiệp' },
            ].map((item) => (
              <Col key={item.tieuDe} xs={24} sm={12}>
                <Card
                  bordered={false}
                  size="small"
                  style={{ background: '#fafafa' }}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                  <Text strong style={{ fontSize: 13 }}>{item.tieuDe}</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.moTa}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default TrangGioiThieu;
