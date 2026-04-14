import React from 'react';
import { Input, Select, Button, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { LoaiTrangThai } from './duLieuMau';
import { DANH_SACH_TRANG_THAI } from './duLieuMau';

const { Option } = Select;

interface BoLocTimKiemProps {
  danhSachGiangVienUnique: string[];
  khiTimKiem: (giaTri: string) => void;
  khiLocGiangVien: (giaTri: string | undefined) => void;
  khiLocTrangThai: (giaTri: LoaiTrangThai | undefined) => void;
  khiNhanThemMoi: () => void;
}

const BoLocTimKiem: React.FC<BoLocTimKiemProps> = ({
  danhSachGiangVienUnique,
  khiTimKiem,
  khiLocGiangVien,
  khiLocTrangThai,
  khiNhanThemMoi,
}) => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Input
            placeholder="🔍 Tìm kiếm theo tên khóa học..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => khiTimKiem(e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={6}>
          <Select
            placeholder="📚 Lọc theo giảng viên"
            allowClear
            onChange={(giaTri: string) => khiLocGiangVien(giaTri || undefined)}
            suffixIcon={<FilterOutlined />}
          >
            {danhSachGiangVienUnique.map((giangVien) => (
              <Option key={giangVien} value={giangVien}>
                {giangVien}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={5} lg={5}>
          <Select
            placeholder="📋 Lọc trạng thái"
            allowClear
            onChange={(giaTri: LoaiTrangThai) => khiLocTrangThai(giaTri || undefined)}
            suffixIcon={<FilterOutlined />}
          >
            {DANH_SACH_TRANG_THAI.map((trangThai) => (
              <Option key={trangThai} value={trangThai}>
                {trangThai}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={24} md={5} lg={5}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={khiNhanThemMoi}
          >
            Thêm khóa học
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BoLocTimKiem;
