import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Space,
  Popconfirm,
  Typography,
  List,
  message,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  FireOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { danhSachBaiTap } from '../mockData';
import { BaiTap, NhomCo, MucDo } from '../types';

const { Text, Paragraph } = Typography;
const { Option } = Select;

const mauTheoMucDo: Record<MucDo, string> = {
  Dễ: 'green',
  'Trung bình': 'gold',
  Khó: 'red',
};

const mauTheoNhomCo: Record<NhomCo, string> = {
  Chest: 'blue',
  Back: 'purple',
  Legs: 'cyan',
  Shoulders: 'orange',
  Arms: 'geekblue',
  Core: 'volcano',
  'Full Body': 'magenta',
};

const danhSachNhomCo: NhomCo[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

const ThuVienBaiTap: React.FC = () => {
  const [danhSach, setDanhSach] = useState<BaiTap[]>(danhSachBaiTap);
  const [tuKhoa, setTuKhoa] = useState('');
  const [locNhomCo, setLocNhomCo] = useState<NhomCo | 'all'>('all');
  const [locMucDo, setLocMucDo] = useState<MucDo | 'all'>('all');
  const [baiTapDangXem, setBaiTapDangXem] = useState<BaiTap | null>(null);
  const [hienThiChiTiet, setHienThiChiTiet] = useState(false);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [dangSua, setDangSua] = useState<BaiTap | null>(null);
  const [form] = Form.useForm();

  const danhSachLoc = danhSach.filter((baiTap) => {
    const khopTuKhoa = !tuKhoa || baiTap.ten.toLowerCase().includes(tuKhoa.toLowerCase());
    const khopNhomCo = locNhomCo === 'all' || baiTap.nhomCo === locNhomCo;
    const khopMucDo = locMucDo === 'all' || baiTap.mucDo === locMucDo;
    return khopTuKhoa && khopNhomCo && khopMucDo;
  });

  const xuLyXemChiTiet = (baiTap: BaiTap) => {
    setBaiTapDangXem(baiTap);
    setHienThiChiTiet(true);
  };

  const xuLyXoa = (id: string, su: React.MouseEvent) => {
    su.stopPropagation();
    setDanhSach((ds) => ds.filter((baiTap) => baiTap.id !== id));
    message.success('Đã xóa bài tập');
  };

  const moFormSua = (baiTap: BaiTap, su: React.MouseEvent) => {
    su.stopPropagation();
    setDangSua(baiTap);
    form.setFieldsValue({ ...baiTap, huongDan: baiTap.huongDan.join('\n') });
    setHienThiForm(true);
  };

  const moFormThem = () => {
    setDangSua(null);
    form.resetFields();
    setHienThiForm(true);
  };

  const xuLyGuiForm = () => {
    form.validateFields().then((giaTriForm) => {
      const chuoiHuongDan = (giaTriForm.huongDan as string)
        .split('\n')
        .map((dong: string) => dong.trim())
        .filter(Boolean);
      const baiTapMoi: BaiTap = {
        id: dangSua ? dangSua.id : String(Date.now()),
        ten: giaTriForm.ten,
        nhomCo: giaTriForm.nhomCo,
        mucDo: giaTriForm.mucDo,
        moTa: giaTriForm.moTa,
        caloMoiGio: giaTriForm.caloMoiGio,
        huongDan: chuoiHuongDan,
      };
      if (dangSua) {
        setDanhSach((ds) => ds.map((baiTap) => (baiTap.id === dangSua.id ? baiTapMoi : baiTap)));
        if (baiTapDangXem?.id === dangSua.id) setBaiTapDangXem(baiTapMoi);
        message.success('Đã cập nhật bài tập');
      } else {
        setDanhSach((ds) => [baiTapMoi, ...ds]);
        message.success('Đã thêm bài tập mới');
      }
      setHienThiForm(false);
    }).catch(() => {
      message.error('Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc');
    });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm kiếm bài tập..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(su) => setTuKhoa(su.target.value)}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Nhóm cơ"
              style={{ width: '100%' }}
              onChange={(val) => setLocNhomCo(val as NhomCo | 'all')}
              defaultValue="all"
            >
              <Option value="all">Tất cả nhóm cơ</Option>
              {danhSachNhomCo.map((nhomCo) => (
                <Option key={nhomCo} value={nhomCo}>{nhomCo}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={5}>
            <Select
              placeholder="Mức độ khó"
              style={{ width: '100%' }}
              onChange={(val) => setLocMucDo(val as MucDo | 'all')}
              defaultValue="all"
            >
              <Option value="all">Tất cả mức độ</Option>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={moFormThem}>
              Thêm bài tập
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {danhSachLoc.length === 0 && (
          <Col span={24}>
            <Card style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">Không tìm thấy bài tập nào</Text>
            </Card>
          </Col>
        )}
        {danhSachLoc.map((baiTap) => (
          <Col xs={24} sm={12} lg={8} key={baiTap.id}>
            <Card hoverable onClick={() => xuLyXemChiTiet(baiTap)} bodyStyle={{ padding: '20px' }}>
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <Row justify="space-between" align="top">
                  <Col flex="1">
                    <Text strong style={{ fontSize: 15 }}>{baiTap.ten}</Text>
                  </Col>
                  <Col>
                    <Space size={4} onClick={(su) => su.stopPropagation()}>
                      <Button type="text" size="small" icon={<EditOutlined />} onClick={(su) => moFormSua(baiTap, su)} style={{ color: '#6366f1' }} />
                      <Popconfirm
                        title="Xóa bài tập này?"
                        onConfirm={(su) => xuLyXoa(baiTap.id, su as any)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Space>
                  </Col>
                </Row>

                <Space size={6} wrap>
                  <Tag color={mauTheoNhomCo[baiTap.nhomCo]}>{baiTap.nhomCo}</Tag>
                  <Tag color={mauTheoMucDo[baiTap.mucDo]}>{baiTap.mucDo}</Tag>
                </Space>

                <Text type="secondary" style={{ fontSize: 13 }}>{baiTap.moTa}</Text>

                <Divider style={{ margin: '8px 0' }} />

                <Space>
                  <FireOutlined style={{ color: '#f97316' }} />
                  <Text style={{ fontSize: 13, color: '#6b7280' }}>{baiTap.caloMoiGio} kcal/giờ</Text>
                  <InfoCircleOutlined style={{ color: '#6366f1', marginLeft: 8 }} />
                  <Text style={{ fontSize: 12, color: '#6366f1' }}>Xem chi tiết</Text>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        visible={hienThiChiTiet}
        onCancel={() => setHienThiChiTiet(false)}
        footer={<Button type="primary" onClick={() => setHienThiChiTiet(false)}>Đóng</Button>}
        width={560}
        title={
          baiTapDangXem && (
            <Space>
              <ThunderboltOutlined style={{ color: '#6366f1' }} />
              <Text strong style={{ fontSize: 17 }}>{baiTapDangXem.ten}</Text>
            </Space>
          )
        }
      >
        {baiTapDangXem && (
          <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 8 }}>
            <Space size={8} wrap>
              <Tag color={mauTheoNhomCo[baiTapDangXem.nhomCo]}>{baiTapDangXem.nhomCo}</Tag>
              <Tag color={mauTheoMucDo[baiTapDangXem.mucDo]}>{baiTapDangXem.mucDo}</Tag>
              <Tag icon={<FireOutlined />} color="orange">{baiTapDangXem.caloMoiGio} kcal/giờ</Tag>
            </Space>
            <Paragraph style={{ marginBottom: 0 }}>{baiTapDangXem.moTa}</Paragraph>
            <Divider style={{ margin: 0 }} />
            <div>
              <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>
                📋 Hướng dẫn thực hiện:
              </Text>
              <List
                dataSource={baiTapDangXem.huongDan}
                renderItem={(buoc, viTri) => (
                  <List.Item style={{ padding: '6px 0', borderBottom: 'none' }}>
                    <Space align="start">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {viTri + 1}
                      </div>
                      <Text>{buoc}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </Space>
        )}
      </Modal>

      <Drawer
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#6366f1' }} />
            <Text strong>{dangSua ? 'Chỉnh sửa bài tập' : 'Thêm bài tập mới'}</Text>
          </Space>
        }
        width={480}
        visible={hienThiForm}
        onClose={() => setHienThiForm(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setHienThiForm(false)}>Hủy</Button>
              <Button type="primary" onClick={xuLyGuiForm}>
                {dangSua ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </div>
        }
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="VD: Push-ups" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="nhomCo" label="Nhóm cơ" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
                <Select>
                  {danhSachNhomCo.map((nhomCo) => (
                    <Option key={nhomCo} value={nhomCo}>{nhomCo}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mucDo" label="Mức độ khó" rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}>
                <Select>
                  <Option value="Dễ">Dễ</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Khó">Khó</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="moTa" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="caloMoiGio" label="Calo/giờ" rules={[{ required: true, message: 'Vui lòng nhập lượng calo' }]}>
            <InputNumber min={50} max={1000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="huongDan" label="Hướng dẫn (mỗi bước trên một dòng)" rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}>
            <Input.TextArea rows={5} placeholder="Bước 1...&#10;Bước 2...&#10;Bước 3..." />
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
};

export default ThuVienBaiTap;
