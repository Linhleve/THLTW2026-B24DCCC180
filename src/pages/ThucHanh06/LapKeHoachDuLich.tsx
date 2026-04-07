import { useState, useMemo } from 'react';
import {
  Layout, Tabs, Card, Row, Col, Typography, Rate, Select,
  Button, Input, Table, Modal, Form, InputNumber, message,
  Space, Progress, Alert, Statistic, Divider, Tag, List, Popconfirm
} from 'antd';
import {
  DeleteOutlined, PlusOutlined, EditOutlined,
  CompassOutlined, ScheduleOutlined, WalletOutlined, SettingOutlined,
  ArrowUpOutlined, ArrowDownOutlined, EnvironmentOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

type LoaiDiemDen = 'Biển' | 'Núi' | 'Thành phố';

interface DiemDen {
  id: string;
  name: string;
  type: LoaiDiemDen;
  rating: number;
  image: string;
  description: string;
  thoiGianThamQuan: number;
  chiPhiAnUong: number;
  chiPhiLuuTru: number;
  chiPhiDiChuyen: number;
}

interface MucLichTrinh {
  id: string;
  idDiemDen: string;
  day: number;
}

interface LichTrinhDaLuu {
  id: string;
  name: string;
  items: MucLichTrinh[];
  tongChiPhi: number;
  tongThoiGian: number;
  date: string;
}

const danhSachDiemDenBanDau: DiemDen[] = [
  { id: '1', name: 'Vịnh Hạ Long', type: 'Biển', rating: 5, image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRq_0uPvU9jnEI0ia3gq_ZaXwXyHrvt_tOjxTtgDqbQ48M6yPoOxoZmqLryvamEUHD3hzgmBVONGv8-htMri_Evbgxv&s=19', description: 'Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi kỳ vĩ.', thoiGianThamQuan: 4, chiPhiAnUong: 500, chiPhiLuuTru: 1000, chiPhiDiChuyen: 300 },
  { id: '2', name: 'Sapa', type: 'Núi', rating: 4.5, image: 'https://booking.muongthanh.com/upload_images/images/H%60/sa-pa-thi-tran-trong-suong.jpg', description: 'Thành phố trong sương, nổi tiếng với ruộng bậc thang và văn hóa bản địa.', thoiGianThamQuan: 6, chiPhiAnUong: 400, chiPhiLuuTru: 800, chiPhiDiChuyen: 500 },
  { id: '3', name: 'Đà Nẵng', type: 'Thành phố', rating: 5, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=400', description: 'Thành phố đáng sống nhất Việt Nam, sở hữu bãi biển tuyệt đẹp và những cây cầu độc đáo.', thoiGianThamQuan: 5, chiPhiAnUong: 600, chiPhiLuuTru: 1200, chiPhiDiChuyen: 200 },
  { id: '4', name: 'Nha Trang', type: 'Biển', rating: 4, image: 'https://nhatrang-tourist.com/wp-content/uploads/2025/12/du-lich-nha-trang-mua-nao-dep-nhat-1.jpg', description: 'Thành phố biển sôi động với các điểm lặn ngắm san hô.', thoiGianThamQuan: 4, chiPhiAnUong: 450, chiPhiLuuTru: 900, chiPhiDiChuyen: 250 },
  { id: '5', name: 'Đà Lạt', type: 'Núi', rating: 4.8, image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=400', description: 'Thành phố mùa xuân vĩnh cửu với ngàn hoa khoe sắc.', thoiGianThamQuan: 5, chiPhiAnUong: 350, chiPhiLuuTru: 700, chiPhiDiChuyen: 400 },
  { id: '6', name: 'Phú Quốc', type: 'Biển', rating: 4.9, image: 'https://images.unsplash.com/photo-1693282814784-649be45a459b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGh1JTIwcXVvYyUyMHZpZXRuYW18ZW58MHx8MHx8fDA%3D', description: 'Đảo ngọc hoang sơ với những bãi cát trắng mịn trải dài tuyệt đẹp.', thoiGianThamQuan: 6, chiPhiAnUong: 600, chiPhiLuuTru: 1500, chiPhiDiChuyen: 500 },
  { id: '7', name: 'Hội An', type: 'Thành phố', rating: 4.7, image: 'https://images.unsplash.com/photo-1660562925534-3f6948ac654f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9pJTIwYW58ZW58MHx8MHx8fDA%3D', description: 'Phố cổ cổ kính bên dòng sông Hoài, lung linh rực rỡ khi đêm về với ánh đèn lồng.', thoiGianThamQuan: 4, chiPhiAnUong: 300, chiPhiLuuTru: 600, chiPhiDiChuyen: 150 },
  { id: '8', name: 'Hà Giang', type: 'Núi', rating: 4.6, image: 'https://images.unsplash.com/photo-1462688681110-15bc88b1497c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhJTIwZ2lhbmd8ZW58MHx8MHx8fDA%3D', description: 'Cảnh quan núi đồi hùng vĩ với con đèo Mã Pí Lèng mạo hiểm và hoa tam giác mạch.', thoiGianThamQuan: 8, chiPhiAnUong: 350, chiPhiLuuTru: 500, chiPhiDiChuyen: 600 },
  { id: '9', name: 'Huế', type: 'Thành phố', rating: 4.5, image: 'https://images.unsplash.com/photo-1664333039578-28ad613ee536?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Kinh thành xưa với các lăng tẩm hùng vĩ, mang đậm dấu ấn lịch sử văn hóa.', thoiGianThamQuan: 5, chiPhiAnUong: 400, chiPhiLuuTru: 700, chiPhiDiChuyen: 300 },
  { id: '10', name: 'Ninh Bình', type: 'Núi', rating: 4.8, image: 'https://plus.unsplash.com/premium_photo-1661950064135-5be0fa2d3595?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bmluaCUyMGJpbmh8ZW58MHx8MHx8fDA%3D', description: 'Phong cảnh non nước hữu tình được mệnh danh là Vịnh Hạ Long trên cạn.', thoiGianThamQuan: 5, chiPhiAnUong: 350, chiPhiLuuTru: 600, chiPhiDiChuyen: 250 },
];

export default function LapKeHoachDuLich() {
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>(danhSachDiemDenBanDau);
  const [lichTrinh, setLichTrinh] = useState<MucLichTrinh[]>([]);
  const [gioiHanNganSach, setGioiHanNganSach] = useState<number>(5000); // in thousands (VND)
  const [danhSachLichTrinhDaLuu, setDanhSachLichTrinhDaLuu] = useState<LichTrinhDaLuu[]>([]);
  const [lichTrinhDangXem, setLichTrinhDangXem] = useState<LichTrinhDaLuu | null>(null);

  // -- DISCOVER TAB STATE --
  const [loaiLoc, setLoaiLoc] = useState<string>('All');
  const [tuyChonSapXep, setTuyChonSapXep] = useState<string>('none');

  // -- ADMIN TAB STATE --
  const [hienThiModal, setHienThiModal] = useState(false);
  const [diemDenDangSua, setDiemDenDangSua] = useState<DiemDen | null>(null);
  const [form] = Form.useForm();

  // -- HELPERS --
  const layDiemDenTheoId = (id: string) => danhSachDiemDen.find(d => d.id === id);

  // -- 1. DISCOVER RENDER --
  const danhSachDiemDenDaLocVaSapXep = useMemo(() => {
    let result = [...danhSachDiemDen];
    if (loaiLoc !== 'All') {
      result = result.filter(d => d.type === loaiLoc);
    }
    if (tuyChonSapXep === 'priceAsc') {
      result.sort((a, b) => (a.chiPhiAnUong + a.chiPhiLuuTru + a.chiPhiDiChuyen) - (b.chiPhiAnUong + b.chiPhiLuuTru + b.chiPhiDiChuyen));
    } else if (tuyChonSapXep === 'priceDesc') {
      result.sort((a, b) => (b.chiPhiAnUong + b.chiPhiLuuTru + b.chiPhiDiChuyen) - (a.chiPhiAnUong + a.chiPhiLuuTru + a.chiPhiDiChuyen));
    } else if (tuyChonSapXep === 'ratingDesc') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [danhSachDiemDen, loaiLoc, tuyChonSapXep]);

  const themVaoLichTrinh = (destId: string) => {
    const defaultDay = 1;
    const newItem: MucLichTrinh = {
      id: Date.now().toString(),
      idDiemDen: destId,
      day: defaultDay,
    };
    setLichTrinh([...lichTrinh, newItem]);
    message.success('Đã thêm vào lịch trình!');
  };

  const renderKhamPha = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Select 
              value={loaiLoc} 
              style={{ width: '100%' }} 
              onChange={setLoaiLoc}
              placeholder="Lọc theo loại hình"
            >
              <Option value="All">Tất cả loại hình</Option>
              <Option value="Biển">Biển</Option>
              <Option value="Núi">Núi</Option>
              <Option value="Thành phố">Thành phố</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select 
              value={tuyChonSapXep} 
              style={{ width: '100%' }} 
              onChange={setTuyChonSapXep}
              placeholder="Sắp xếp"
            >
              <Option value="none">Không sắp xếp</Option>
              <Option value="priceAsc">Giá (Thấp đến cao)</Option>
              <Option value="priceDesc">Giá (Cao đến thấp)</Option>
              <Option value="ratingDesc">Đánh giá (Cao đến thấp)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {danhSachDiemDenDaLocVaSapXep.map((dest) => {
          const tongChiPhi = dest.chiPhiAnUong + dest.chiPhiLuuTru + dest.chiPhiDiChuyen;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
              <Card
                hoverable
                className="tourist-card"
                cover={<img alt={dest.name} src={dest.image} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => themVaoLichTrinh(dest.id)}>
                    Thêm vào lịch trình
                  </Button>
                ]}
              >
                <Card.Meta 
                  title={dest.name} 
                  description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Tag color={dest.type === 'Biển' ? 'blue' : dest.type === 'Núi' ? 'green' : 'magenta'}>
                        {dest.type}
                      </Tag>
                      <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, height: 44 }}>{dest.description}</Paragraph>
                      <Rate disabled defaultValue={dest.rating} style={{ fontSize: 14 }} />
                      <Text strong>Chi phí ước tính: {tongChiPhi.toLocaleString()}k ₫</Text>
                    </Space>
                  } 
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </Space>
  );

  // -- 2. ITINERARY RENDER --
  // Group lichTrinh by day
  const lichTrinhTheoNgay = useMemo(() => {
    const grouped: Record<number, MucLichTrinh[]> = {};
    lichTrinh.forEach(item => {
      if (!grouped[item.day]) grouped[item.day] = [];
      grouped[item.day].push(item);
    });
    return grouped;
  }, [lichTrinh]);

  const ngayLonNhat = useMemo(() => {
    if (lichTrinh.length === 0) return 1;
    return Math.max(...lichTrinh.map(i => i.day));
  }, [lichTrinh]);

  const diChuyenNgay = (id: string, delta: number) => {
    setLichTrinh(lichTrinh.map(item => {
      if (item.id === id) {
        return { ...item, day: Math.max(1, item.day + delta) };
      }
      return item;
    }));
  };

  const xoaMucLichTrinh = (id: string) => {
    setLichTrinh(lichTrinh.filter(i => i.id !== id));
  };

  const tongCong = useMemo(() => {
    let food = 0, stay = 0, travel = 0, time = 0;
    lichTrinh.forEach(i => {
      const d = layDiemDenTheoId(i.idDiemDen);
      if (d) {
        food += d.chiPhiAnUong;
        stay += d.chiPhiLuuTru;
        travel += d.chiPhiDiChuyen;
        time += d.thoiGianThamQuan;
      }
    });
    return { food, stay, travel, time, tongChiPhi: food + stay + travel };
  }, [lichTrinh, danhSachDiemDen]);

  const xuLyLuuLichTrinh = () => {
    if (lichTrinh.length === 0) {
      message.warning('Lịch trình đang trống, vui lòng thêm điểm đến!');
      return;
    }
    const newSaved: LichTrinhDaLuu = {
      id: Date.now().toString(),
      name: `Lịch trình ${danhSachLichTrinhDaLuu.length + 1}`,
      items: [...lichTrinh],
      tongChiPhi: tongCong.tongChiPhi,
      tongThoiGian: tongCong.time,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setDanhSachLichTrinhDaLuu([...danhSachLichTrinhDaLuu, newSaved]);
    setLichTrinh([]);
    message.success('Lưu lịch trình thành công!');
  };

  const renderLichTrinh = () => (
    <div style={{ width: '100%' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
        <Title level={4}>Lịch trình chi tiết</Title>
        {lichTrinh.length === 0 ? (
          <Alert message="Lịch trình đang trống. Hãy thêm các điểm đến từ phần Khám phá!" type="info" showIcon />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {Array.from({ length: ngayLonNhat + 1 }).map((_, idx) => {
              const dayNum = idx + 1;
              const cacMucTrongNgay = lichTrinhTheoNgay[dayNum] || [];
              if (cacMucTrongNgay.length === 0 && dayNum > ngayLonNhat) return null;
              
              return (
                <Card key={dayNum} title={`Ngày ${dayNum}`} size="small">
                  <List
                    dataSource={cacMucTrongNgay}
                    renderItem={(item) => {
                      const dest = layDiemDenTheoId(item.idDiemDen);
                      if (!dest) return <List.Item />;
                      return (
                        <List.Item
                          actions={[
                            <Button size="small" icon={<ArrowUpOutlined />} onClick={() => diChuyenNgay(item.id, -1)} disabled={dayNum === 1} title="Chuyển lên ngày trước" />,
                            <Button size="small" icon={<ArrowDownOutlined />} onClick={() => diChuyenNgay(item.id, 1)} title="Chuyển xuống ngày sau" />,
                            <Button danger size="small" icon={<DeleteOutlined />} onClick={() => xoaMucLichTrinh(item.id)} />
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<img src={dest.image} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} alt={dest.name}/>}
                            title={dest.name}
                            description={
                              <Space split={<Divider type="vertical" />}>
                                <Text type="secondary"><EnvironmentOutlined /> {dest.type}</Text>
                                <Text type="secondary">Thời gian: {dest.thoiGianThamQuan}h</Text>
                              </Space>
                            }
                          />
                          <div style={{ textAlign: 'right' }}>
                            <Text strong>{(dest.chiPhiAnUong + dest.chiPhiLuuTru + dest.chiPhiDiChuyen).toLocaleString()}k ₫</Text>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                  {cacMucTrongNgay.length === 0 && <Text type="secondary" italic>Chưa có điểm đến cho ngày này.</Text>}
                </Card>
              );
            })}
          </Space>
        )}
      </Col>
      <Col xs={24} md={8}>
        <Card title="Tổng quan chuyến đi">
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Statistic title="Tổng ngân sách dự kiến" value={tongCong.tongChiPhi} suffix="k ₫" />
            </Col>
            <Col span={24}>
              <Statistic title="Tổng thời gian tham quan" value={tongCong.time} suffix=" giờ" />
            </Col>
            <Col span={24}>
              <Statistic title="Số lượng điểm đến" value={lichTrinh.length} />
            </Col>
            <Col span={24}>
              <Button type="primary" block onClick={xuLyLuuLichTrinh}>Lưu lịch trình</Button>
            </Col>
          </Row>
        </Card>
      </Col>
      </Row>
      <Divider />
      <Title level={4}>Danh sách lịch trình đã lưu</Title>
      {danhSachLichTrinhDaLuu.length === 0 ? (
        <Text type="secondary">Chưa có lịch trình nào được lưu.</Text>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
          dataSource={danhSachLichTrinhDaLuu}
          renderItem={(item) => (
            <List.Item>
              <Card 
                className="saved-itinerary-card"
                title={<Space><ScheduleOutlined style={{color: '#1890ff'}}/> {item.name}</Space>}
                size="small" 
                extra={
                  <Space>
                    <Button type="primary" ghost size="small" onClick={() => setLichTrinhDangXem(item)}>Chi tiết</Button>
                    <Button size="small" danger onClick={() => setDanhSachLichTrinhDaLuu(danhSachLichTrinhDaLuu.filter(s => s.id !== item.id))}>Xóa</Button>
                  </Space>
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Số điểm đến</Text>
                    <Text strong style={{ fontSize: 16 }}>{item.items.length} địa danh</Text>
                  </Space>
                  <Space direction="vertical" size={0} style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Tổng chi phí</Text>
                    <Text strong style={{ fontSize: 16, color: '#f5222d' }}>{item.tongChiPhi.toLocaleString()}k ₫</Text>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={lichTrinhDangXem?.name}
        visible={!!lichTrinhDangXem}
        onCancel={() => setLichTrinhDangXem(null)}
        footer={[
          <Button key="close" onClick={() => setLichTrinhDangXem(null)}>Đóng</Button>
        ]}
      >
        {lichTrinhDangXem && (
          <List
            dataSource={lichTrinhDangXem.items}
            renderItem={item => {
              const dest = layDiemDenTheoId(item.idDiemDen);
              if(!dest) return <List.Item />;
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<img src={dest.image} style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 4}} alt={dest.name} />}
                    title={`${dest.name} (Ngày ${item.day})`}
                    description={`Chi phí: ${(dest.chiPhiAnUong + dest.chiPhiLuuTru + dest.chiPhiDiChuyen).toLocaleString()}k ₫ - Thời gian: ${dest.thoiGianThamQuan}h`}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Modal>
    </div>
  );

  // -- 3. BUDGET RENDER --
  const phanTramSuDung = tongCong.tongChiPhi > 0 ? Math.round((tongCong.tongChiPhi / gioiHanNganSach) * 100) : 0;
  
  const renderNganSach = () => {
    const duLieuBieuDo = [
      { name: 'Ăn uống', value: tongCong.food, color: '#f5222d', percent: tongCong.tongChiPhi ? Math.round((tongCong.food / tongCong.tongChiPhi)*100) : 0 },
      { name: 'Lưu trú', value: tongCong.stay, color: '#fa8c16', percent: tongCong.tongChiPhi ? Math.round((tongCong.stay / tongCong.tongChiPhi)*100) : 0 },
      { name: 'Di chuyển', value: tongCong.travel, color: '#1890ff', percent: tongCong.tongChiPhi ? Math.round((tongCong.travel / tongCong.tongChiPhi)*100) : 0 },
    ];

    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Phân bổ ngân sách" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
              <Text strong>Thiết lập giới hạn ngân sách (k ₫):</Text>
              <InputNumber value={gioiHanNganSach} onChange={(val) => setGioiHanNganSach(val || 0)} style={{ width: '100%' }} />
            </Space>

            {tongCong.tongChiPhi > gioiHanNganSach && (
              <Alert 
                message="Cảnh báo vượt ngân sách!" 
                description={`Bạn đã vượt quá ngân sách ${(tongCong.tongChiPhi - gioiHanNganSach).toLocaleString()}k ₫. Hãy điều chỉnh lịch trình hoặc tăng ngân sách.`}
                type="error" 
                showIcon 
                style={{ marginBottom: 24 }}
              />
            )}

            <Title level={5}>Tình trạng sử dụng</Title>
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <Progress 
                type="dashboard" 
                percent={phanTramSuDung} 
                strokeColor={phanTramSuDung > 100 ? '#ff4d4f' : '#52c41a'} 
                format={(p) => `${tongCong.tongChiPhi}k / ${gioiHanNganSach}k`}
                width={180}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Chi tiết các hạng mục" style={{ height: '100%' }}>
            {tongCong.tongChiPhi === 0 ? (
              <Alert message="Chưa có chi phí" type="info" />
            ) : (
              <Space direction="vertical" style={{ width: '100%', padding: '16px 0' }} size="large">
                {duLieuBieuDo.map(item => (
                  <div key={item.name}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                      <Text strong>{item.name}</Text>
                      <Text>{item.value.toLocaleString()}k ₫ ({item.percent}%)</Text>
                    </Row>
                    <Progress percent={item.percent} strokeColor={item.color} showInfo={false} />
                  </div>
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  // -- 4. ADMIN RENDER --
  const xuLyLuuQuanTri = async () => {
    try {
      const values = await form.validateFields();
      if (diemDenDangSua) {
        setDanhSachDiemDen(danhSachDiemDen.map(d => d.id === diemDenDangSua.id ? { ...d, ...values } as DiemDen : d));
        message.success('Cập nhật điểm đến thành công!');
      } else {
        const newDest: DiemDen = {
          ...values,
          id: Date.now().toString(),
        };
        setDanhSachDiemDen([...danhSachDiemDen, newDest]);
        message.success('Thêm điểm đến mới thành công!');
      }
      setHienThiModal(false);
    } catch (e) {
      // Validate failed
    }
  };

  const xuLyXoaQuanTri = (id: string) => {
    setDanhSachDiemDen(danhSachDiemDen.filter(d => d.id !== id));
    // also remove from lichTrinh if needed
    setLichTrinh(lichTrinh.filter(i => i.idDiemDen !== id));
    message.success('Đã xóa điểm đến!');
  };

  const hienThiModalQuanTri = (dest?: DiemDen) => {
    if (dest) {
      setDiemDenDangSua(dest);
      form.setFieldsValue(dest);
    } else {
      setDiemDenDangSua(null);
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (url: string) => <img src={url} alt="img" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
    },
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color={type === 'Biển' ? 'blue' : type === 'Núi' ? 'green' : 'magenta'}>{type}</Tag>
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (r: number) => <Space><Rate disabled defaultValue={r} style={{ fontSize: 12 }} /> ({r})</Space>
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: DiemDen) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => hienThiModalQuanTri(record)} />
          <Popconfirm title="Xóa điểm đến này?" onConfirm={() => xuLyXoaQuanTri(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderQuanTri = () => (
<Space direction="vertical" style={{ width: '100%' }} size="large">

      <Card 
        title="Quản lý điểm đến" 
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => hienThiModalQuanTri()}>Thêm mới</Button>}
      >
        <Table 
          columns={columns} 
          dataSource={danhSachDiemDen} 
          rowKey="id" 
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={diemDenDangSua ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        visible={hienThiModal}
        onOk={xuLyLuuQuanTri}
        onCancel={() => setHienThiModal(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select>
                  <Option value="Biển">Biển</Option>
                  <Option value="Núi">Núi</Option>
                  <Option value="Thành phố">Thành phố</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="image" label="URL Hình ảnh" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="thoiGianThamQuan" label="TG tham quan (giờ)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Chi phí dự kiến (Đơn vị: k ₫)</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="chiPhiAnUong" label="Ăn uống" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="chiPhiLuuTru" label="Lưu trú" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="chiPhiDiChuyen" label="Di chuyển" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Space>
  );

  const customStyles = `
    .premium-card {
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      border: none;
      overflow: hidden;
      background: white;
    }
    .saved-itinerary-card {
      border-radius: 10px;
      background: linear-gradient(to right bottom, #ffffff, #fafafa);
      border-left: 5px solid #1890ff;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    }
    .saved-itinerary-card:hover {
      box-shadow: 0 8px 25px rgba(24, 144, 255, 0.15);
      transform: translateY(-4px);
    }
    .tourist-card {
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      border: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .tourist-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    .header-title {
      background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800 !important;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .main-layout {
      background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    }
  `;

  return (
    <Layout className="main-layout" style={{ minHeight: '100vh' }}>
      <style>{customStyles}</style>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Title level={2} className="header-title" style={{ textAlign: 'center', marginBottom: 40 }}>
          Ứng dụng Lập Kế Hoạch Du Lịch
        </Title>
        <Card className="premium-card" bodyStyle={{ padding: 0 }}>
          <Tabs 
            defaultActiveKey="1" 
            size="large"
            tabBarStyle={{ padding: '0 24px', marginBottom: 24 }}
          >
            <TabPane tab={<span><CompassOutlined />Khám phá</span>} key="1">
              <div style={{ padding: '0 24px 24px' }}>
                {renderKhamPha()}
              </div>
            </TabPane>
            <TabPane tab={<span><ScheduleOutlined />Lịch trình <Tag color="blue">{lichTrinh.length}</Tag></span>} key="2">
              <div style={{ padding: '0 24px 24px' }}>
                {renderLichTrinh()}
              </div>
            </TabPane>
            <TabPane tab={<span><WalletOutlined />Ngân sách</span>} key="3">
              <div style={{ padding: '0 24px 24px' }}>
                {renderNganSach()}
              </div>
            </TabPane>
            <TabPane tab={<span><SettingOutlined />Quản trị</span>} key="4">
              <div style={{ padding: '0 24px 24px' }}>
                {renderQuanTri()}
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}
