import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Typography, Tag, Space, Button, Divider, Avatar } from 'antd';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { IBaiViet, IThamSoDieuHuong } from '../kieu';

const { Title, Paragraph, Text } = Typography;

interface PropsChiTietBaiViet {
  duongDan: string;
  danhSachBaiViet: IBaiViet[];
  onDiChuyen: (thamSo: IThamSoDieuHuong) => void;
}

const ChiTietBaiViet: React.FC<PropsChiTietBaiViet> = ({ duongDan, danhSachBaiViet, onDiChuyen }) => {
  const [soLuotXemGiamLap, setSoLuotXemGiamLap] = useState<number>(0);

  const baiVietHienTai = useMemo<IBaiViet | undefined>(
    () => danhSachBaiViet.find((bv) => bv.duongDan === duongDan),
    [danhSachBaiViet, duongDan],
  );

  useEffect(() => {
    if (baiVietHienTai) {
      setSoLuotXemGiamLap(baiVietHienTai.luotXem + 1);
    }
  }, [baiVietHienTai]);

  const danhSachBaiVietLienQuan = useMemo<IBaiViet[]>(() => {
    if (!baiVietHienTai) return [];
    const cacTenThe = baiVietHienTai.cacThe.map((the) => the.tenThe);
    return danhSachBaiViet
      .filter(
        (bv) =>
          bv.id !== baiVietHienTai.id &&
          bv.trangThai === 'da_dang' &&
          bv.cacThe.some((the) => cacTenThe.includes(the.tenThe)),
      )
      .slice(0, 3);
  }, [danhSachBaiViet, baiVietHienTai]);

  const dinhDangNgay = (chuoiNgay: string): string =>
    new Date(chuoiNgay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const tinhThoiGianDoc = (noiDung: string): number =>
    Math.ceil(noiDung.replace(/<[^>]*>/g, '').split(' ').length / 200);

  if (!baiVietHienTai) {
    return (
      <Card style={{ textAlign: 'center', padding: 40 }}>
        <Title level={4} type="secondary">Không tìm thấy bài viết</Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => onDiChuyen({ trang: 'trang-chu' })} style={{ marginTop: 16 }}>
          Quay về trang chủ
        </Button>
      </Card>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={17}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => onDiChuyen({ trang: 'trang-chu' })}
          style={{ marginBottom: 16 }}
        >
          Quay lại danh sách
        </Button>

        <Card bordered={false}>
          <img
            src={baiVietHienTai.anhDaiDien}
            alt={baiVietHienTai.tieuDe}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: 24 }}
          />

          <Space wrap style={{ marginBottom: 12 }}>
            {baiVietHienTai.cacThe.map((the) => (
              <Tag key={the.id} color={the.mauSac}>{the.tenThe}</Tag>
            ))}
          </Space>

          <Title level={2} style={{ marginBottom: 16 }}>
            {baiVietHienTai.tieuDe}
          </Title>

          <Card
            bordered={false}
            style={{ background: '#fafafa', marginBottom: 24 }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Space split={<Divider type="vertical" />} wrap>
              <Space size={6}>
                <Avatar size={28} src={baiVietHienTai.tacGia.anhDaiDien} icon={<UserOutlined />} />
                <Text strong>{baiVietHienTai.tacGia.tenHienThi}</Text>
              </Space>
              <Space size={4}>
                <CalendarOutlined />
                <Text type="secondary">{dinhDangNgay(baiVietHienTai.ngayTao)}</Text>
              </Space>
              <Space size={4}>
                <EyeOutlined />
                <Text type="secondary">{soLuotXemGiamLap.toLocaleString('vi-VN')} lượt xem</Text>
              </Space>
              <Space size={4}>
                <ClockCircleOutlined />
                <Text type="secondary">~{tinhThoiGianDoc(baiVietHienTai.noiDung)} phút đọc</Text>
              </Space>
            </Space>
          </Card>

          <Divider />

          <div
            style={{ lineHeight: 1.8, fontSize: 15 }}
            dangerouslySetInnerHTML={{ __html: baiVietHienTai.noiDung }}
          />

          <Divider />

          <Space wrap>
            <Text strong>Chủ đề:</Text>
            {baiVietHienTai.cacThe.map((the) => (
              <Tag key={the.id} color={the.mauSac}>#{the.tenThe}</Tag>
            ))}
          </Space>
        </Card>

        {danhSachBaiVietLienQuan.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4} style={{ marginBottom: 16 }}>📚 Bài Viết Liên Quan</Title>
            <Row gutter={[16, 16]}>
              {danhSachBaiVietLienQuan.map((bv) => (
                <Col key={bv.id} xs={24} sm={8}>
                  <Card
                    hoverable
                    bordered={false}
                    cover={
                      <img alt={bv.tieuDe} src={bv.anhDaiDien} style={{ height: 130, objectFit: 'cover' }} />
                    }
                    onClick={() => onDiChuyen({ trang: 'chi-tiet-bai-viet', duongDan: bv.duongDan })}
                    bodyStyle={{ padding: '10px 14px' }}
                  >
                    <Space wrap style={{ marginBottom: 6 }}>
                      {bv.cacThe.slice(0, 2).map((the) => (
                        <Tag key={the.id} color={the.mauSac} style={{ fontSize: 11 }}>{the.tenThe}</Tag>
                      ))}
                    </Space>
                    <Text strong ellipsis style={{ display: 'block', fontSize: 13 }}>
                      {bv.tieuDe}
                    </Text>
                    <Space size={4} style={{ marginTop: 6 }}>
                      <EyeOutlined style={{ fontSize: 11 }} />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {bv.luotXem.toLocaleString('vi-VN')}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Col>

      <Col xs={24} lg={7}>
        <Card bordered={false} style={{ marginBottom: 16, textAlign: 'center' }}>
          <Avatar
            size={72}
            src={baiVietHienTai.tacGia.anhDaiDien}
            icon={<UserOutlined />}
            style={{ marginBottom: 12 }}
          />
          <Title level={5} style={{ margin: 0 }}>{baiVietHienTai.tacGia.tenHienThi}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{baiVietHienTai.tacGia.viTri}</Text>
          <Paragraph
            type="secondary"
            ellipsis={{ rows: 3, expandable: true, symbol: 'xem thêm' }}
            style={{ fontSize: 13, marginTop: 10, textAlign: 'left' }}
          >
            {baiVietHienTai.tacGia.tieuSu}
          </Paragraph>
          <Button block onClick={() => onDiChuyen({ trang: 'gioi-thieu' })}>
            Xem hồ sơ đầy đủ
          </Button>
        </Card>

        <Card bordered={false} title="Kỹ năng & Sở thích">
          <Space wrap>
            {baiVietHienTai.tacGia.kyNang.map((kyNang) => (
              <Tag key={kyNang}>{kyNang}</Tag>
            ))}
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default ChiTietBaiViet;
