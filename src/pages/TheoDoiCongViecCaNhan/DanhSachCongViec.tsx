import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  Input,
  Select,
  Typography,
  Tooltip,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { CongViec, TrangThaiCongViec, MucDoUuTien } from './kieuDuLieu';
import FormCongViec from './FormCongViec';

const { Title } = Typography;

interface DanhSachCongViecProps {
  danhSachCongViec: CongViec[];
  onThem: (duLieu: Omit<CongViec, 'maId' | 'ngayTao'>) => void;
  onSua: (maId: string, duLieu: Partial<Omit<CongViec, 'maId' | 'ngayTao'>>) => void;
  onXoa: (maId: string) => void;
}

const MAU_TRANG_THAI: Record<TrangThaiCongViec, string> = {
  canLam: 'blue',
  dangLam: 'orange',
  hoanThanh: 'green',
};

const NHAN_TRANG_THAI: Record<TrangThaiCongViec, string> = {
  canLam: 'Cần Làm',
  dangLam: 'Đang Làm',
  hoanThanh: 'Hoàn Thành',
};

const MAU_UU_TIEN: Record<MucDoUuTien, string> = {
  cao: 'red',
  trungBinh: 'gold',
  thap: 'green',
};

const NHAN_UU_TIEN: Record<MucDoUuTien, string> = {
  cao: 'Cao',
  trungBinh: 'Trung Bình',
  thap: 'Thấp',
};

const kiemTraQuaHan = (hanChot?: string, trangThai?: TrangThaiCongViec): boolean => {
  if (!hanChot || trangThai === 'hoanThanh') return false;
  const ngayHomNay = new Date();
  ngayHomNay.setHours(0, 0, 0, 0);
  const ngayHanChot = new Date(hanChot);
  ngayHanChot.setHours(0, 0, 0, 0);
  return ngayHanChot < ngayHomNay;
};

const DanhSachCongViec: React.FC<DanhSachCongViecProps> = ({
  danhSachCongViec,
  onThem,
  onSua,
  onXoa,
}) => {
  const [hienThiForm, datHienThiForm] = useState(false);
  const [congViecDangSua, datCongViecDangSua] = useState<CongViec | undefined>(undefined);
  const [tuKhoaTimKiem, datTuKhoaTimKiem] = useState('');
  const [boLocTrangThai, datBoLocTrangThai] = useState<TrangThaiCongViec | 'tatCa'>('tatCa');

  const xuLyMoForm = (congViec?: CongViec) => {
    datCongViecDangSua(congViec);
    datHienThiForm(true);
  };

  const xuLyDongForm = () => {
    datHienThiForm(false);
    datCongViecDangSua(undefined);
  };

  const xuLyLuuCongViec = (duLieu: Omit<CongViec, 'maId' | 'ngayTao'>) => {
    if (congViecDangSua) {
      onSua(congViecDangSua.maId, duLieu);
    } else {
      onThem(duLieu);
    }
    xuLyDongForm();
  };

  const danhSachDaLoc = danhSachCongViec.filter((cv) => {
    const phuHopTimKiem = cv.tenCongViec.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    const phuHopTrangThai = boLocTrangThai === 'tatCa' || cv.trangThai === boLocTrangThai;
    return phuHopTimKiem && phuHopTrangThai;
  });

  const cauHinhCot: ColumnsType<CongViec> = [
    {
      title: 'Tên Công Việc',
      dataIndex: 'tenCongViec',
      key: 'tenCongViec',
      render: (ten: string, bangGhi: CongViec) => (
        <Space direction="vertical" size={2}>
          <Space>
            <Typography.Text strong type={kiemTraQuaHan(bangGhi.hanChot, bangGhi.trangThai) ? 'danger' : undefined}>
              {ten}
            </Typography.Text>
            {kiemTraQuaHan(bangGhi.hanChot, bangGhi.trangThai) && (
              <Tag color="red">Quá Hạn</Tag>
            )}
          </Space>
          {bangGhi.nhanTag && bangGhi.nhanTag.length > 0 && (
            <Space size={2} wrap>
              {bangGhi.nhanTag.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      filters: [
        { text: 'Cần Làm', value: 'canLam' },
        { text: 'Đang Làm', value: 'dangLam' },
        { text: 'Hoàn Thành', value: 'hoanThanh' },
      ],
      onFilter: (giaTriLoc, bangGhi) => bangGhi.trangThai === giaTriLoc,
      render: (trangThai: TrangThaiCongViec) => (
        <Tag color={MAU_TRANG_THAI[trangThai]}>{NHAN_TRANG_THAI[trangThai]}</Tag>
      ),
    },
    {
      title: 'Ưu Tiên',
      dataIndex: 'mucDoUuTien',
      key: 'mucDoUuTien',
      width: 120,
      render: (mucDo: MucDoUuTien) => (
        <Tag color={MAU_UU_TIEN[mucDo]}>{NHAN_UU_TIEN[mucDo]}</Tag>
      ),
    },
    {
      title: 'Hạn Chót',
      dataIndex: 'hanChot',
      key: 'hanChot',
      width: 130,
      sorter: (a, b) => {
        if (!a.hanChot && !b.hanChot) return 0;
        if (!a.hanChot) return 1;
        if (!b.hanChot) return -1;
        return new Date(a.hanChot).getTime() - new Date(b.hanChot).getTime();
      },
      render: (hanChot?: string) =>
        hanChot ? (
          <Typography.Text type={kiemTraQuaHan(hanChot) ? 'danger' : 'secondary'}>
            {moment(hanChot).format('DD/MM/YYYY')}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'moTa',
      key: 'moTa',
      ellipsis: true,
      render: (moTa?: string) =>
        moTa ? (
          <Tooltip title={moTa}>
            <Typography.Text type="secondary">{moTa}</Typography.Text>
          </Tooltip>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: 'Thao Tác',
      key: 'thaoTac',
      width: 100,
      render: (_text: unknown, bangGhi: CongViec) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => xuLyMoForm(bangGhi)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa công việc này?"
              onConfirm={() => onXoa(bangGhi.maId)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>📋 Danh Sách Công Việc</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => xuLyMoForm()} size="large">
              Thêm Công Việc
            </Button>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên..."
            prefix={<SearchOutlined />}
            value={tuKhoaTimKiem}
            onChange={(e) => datTuKhoaTimKiem(e.target.value)}
            allowClear
          />
          <Select
            value={boLocTrangThai}
            onChange={datBoLocTrangThai}
            style={{ width: 180 }}
          >
            <Select.Option value="tatCa">Tất Cả Trạng Thái</Select.Option>
            <Select.Option value="canLam">Cần Làm</Select.Option>
            <Select.Option value="dangLam">Đang Làm</Select.Option>
            <Select.Option value="hoanThanh">Hoàn Thành</Select.Option>
          </Select>
        </Space>
      </Col>

      <Col span={24}>
        <Table
          columns={cauHinhCot}
          dataSource={danhSachDaLoc}
          rowKey="maId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (tongSo) => `Tổng ${tongSo} công việc`,
          }}
          locale={{ emptyText: 'Chưa có công việc nào' }}
        />
      </Col>

      <FormCongViec
        hienThi={hienThiForm}
        congViecDangSua={congViecDangSua}
        onDong={xuLyDongForm}
        onLuu={xuLyLuuCongViec}
      />
    </Row>
  );
};

export default DanhSachCongViec;
