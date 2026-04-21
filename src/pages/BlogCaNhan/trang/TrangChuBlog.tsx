import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Card, Input, Tag, Pagination, Typography, Space, Empty } from 'antd';
import { SearchOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { IBaiViet, IThe, IThamSoDieuHuong } from '../kieu';

const { Title, Paragraph, Text } = Typography;

interface PropsTrangChu {
  danhSachBaiViet: IBaiViet[];
  danhSachThe: IThe[];
  onDiChuyen: (thamSo: IThamSoDieuHuong) => void;
}

const SO_BAI_VIET_MOT_TRANG = 9;

const TrangChuBlog: React.FC<PropsTrangChu> = ({ danhSachBaiViet, danhSachThe, onDiChuyen }) => {
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [tuKhoaDebounce, setTuKhoaDebounce] = useState<string>('');
  const [theHienTai, setTheHienTai] = useState<string | null>(null);
  const [trangHienTai, setTrangHienTai] = useState<number>(1);

  useEffect(() => {
    const boHen = setTimeout(() => {
      setTuKhoaDebounce(tuKhoaTimKiem);
      setTrangHienTai(1);
    }, 300);
    return () => clearTimeout(boHen);
  }, [tuKhoaTimKiem]);

  const xuLyChonThe = useCallback((tenThe: string) => {
    setTheHienTai((hienTai) => (hienTai === tenThe ? null : tenThe));
    setTrangHienTai(1);
  }, []);

  const danhSachDaLoc = useMemo<IBaiViet[]>(() => {
    const tuKhoaViet = tuKhoaDebounce.toLowerCase();
    return danhSachBaiViet
      .filter((bv) => bv.trangThai === 'da_dang')
      .filter((bv) =>
        bv.tieuDe.toLowerCase().includes(tuKhoaViet) ||
        bv.tomTat.toLowerCase().includes(tuKhoaViet),
      )
      .filter((bv) => !theHienTai || bv.cacThe.some((t) => t.tenThe === theHienTai));
  }, [danhSachBaiViet, tuKhoaDebounce, theHienTai]);

  const tongSoBaiViet = danhSachDaLoc.length;

  const danhSachTrangHienTai = useMemo<IBaiViet[]>(() => {
    const batDau = (trangHienTai - 1) * SO_BAI_VIET_MOT_TRANG;
    return danhSachDaLoc.slice(batDau, batDau + SO_BAI_VIET_MOT_TRANG);
  }, [danhSachDaLoc, trangHienTai]);

  const dinhDangNgay = (chuoiNgay: string): string =>
    new Date(chuoiNgay).toLocaleDateString('vi-VN');

  return (
    <div>
      <Card
        bordered={false}
        style={{ marginBottom: 24, background: '#001529', textAlign: 'center' }}
        bodyStyle={{ padding: '36px 24px' }}
      >
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          🌍 Nhật Ký Hành Trình
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>
          Khám phá thế giới · Trải nghiệm thực tế · Cẩm nang du lịch
        </Text>
      </Card>

      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={10}>
            <Input
              size="large"
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              value={tuKhoaTimKiem}
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={14}>
            <Space wrap>
              <Text type="secondary">Lọc theo thẻ:</Text>
              {danhSachThe.map((the) => (
                <Tag
                  key={the.id}
                  color={theHienTai === the.tenThe ? the.mauSac : 'default'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => xuLyChonThe(the.tenThe)}
                >
                  {the.tenThe}
                </Tag>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">
          Tìm thấy <Text strong>{tongSoBaiViet}</Text> bài viết
          {theHienTai && <> trong thẻ <Tag color="blue">{theHienTai}</Tag></>}
        </Text>
      </div>

      {danhSachTrangHienTai.length === 0 ? (
        <Card>
          <Empty description="Không tìm thấy bài viết nào" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {danhSachTrangHienTai.map((baiViet) => (
            <Col key={baiViet.id} xs={24} sm={12} xl={8}>
              <Card
                hoverable
                bordered={false}
                style={{ height: '100%' }}
                cover={
                  <img
                    alt={baiViet.tieuDe}
                    src={baiViet.anhDaiDien}
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                }
                onClick={() => onDiChuyen({ trang: 'chi-tiet-bai-viet', duongDan: baiViet.duongDan })}
                bodyStyle={{ padding: '12px 16px 16px' }}
              >
                <Space wrap style={{ marginBottom: 8 }}>
                  {baiViet.cacThe.map((the) => (
                    <Tag key={the.id} color={the.mauSac}>{the.tenThe}</Tag>
                  ))}
                </Space>

                <Title
                  level={5}
                  style={{ marginBottom: 6, cursor: 'pointer' }}
                  ellipsis={{ rows: 2, tooltip: baiViet.tieuDe }}
                >
                  {baiViet.tieuDe}
                </Title>

                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ fontSize: 13, marginBottom: 12 }}
                >
                  {baiViet.tomTat}
                </Paragraph>

                <Row justify="space-between">
                  <Col>
                    <Space size={4}>
                      <CalendarOutlined style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dinhDangNgay(baiViet.ngayTao)}
                      </Text>
                    </Space>
                  </Col>
                  <Col>
                    <Space size={4}>
                      <EyeOutlined style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {baiViet.luotXem.toLocaleString('vi-VN')}
                      </Text>
                    </Space>
                  </Col>
                </Row>
                <div style={{ marginTop: 6 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ✍️ {baiViet.tacGia.tenHienThi}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {tongSoBaiViet > SO_BAI_VIET_MOT_TRANG && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination
            current={trangHienTai}
            total={tongSoBaiViet}
            pageSize={SO_BAI_VIET_MOT_TRANG}
            onChange={(trang) => {
              setTrangHienTai(trang);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showSizeChanger={false}
            showTotal={(tong) => `Tổng ${tong} bài viết`}
          />
        </div>
      )}
    </div>
  );
};

export default TrangChuBlog;
