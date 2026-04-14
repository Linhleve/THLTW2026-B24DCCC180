import React from 'react';
import { Table, Tag, Button, Popconfirm, Space, Tooltip, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { KhoaHoc } from './duLieuMau';
import { MAU_TRANG_THAI } from './duLieuMau';

interface BangDanhSachKhoaHocProps {
  duLieuDaLoc: KhoaHoc[];
  dangTai: boolean;
  khiNhanSua: (khoaHoc: KhoaHoc) => void;
  khiXacNhanXoa: (idKhoaHoc: string) => void;
}

const BangDanhSachKhoaHoc: React.FC<BangDanhSachKhoaHocProps> = ({
  duLieuDaLoc,
  dangTai,
  khiNhanSua,
  khiXacNhanXoa,
}) => {
  const cauHinhCot: ColumnsType<KhoaHoc> = [
    {
      title: (
        <Space>
          <BookOutlined />
          <span>ID</span>
        </Space>
      ),
      dataIndex: 'idKhoaHoc',
      key: 'idKhoaHoc',
      render: (idKhoaHoc: string) => (
        <Tag color="geekblue">
          {idKhoaHoc}
        </Tag>
      ),
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
      render: (ten: string) => (
        <span>{ten}</span>
      ),
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
      render: (giangVien: string) => (
        <Space>
          <UserOutlined />
          <span>{giangVien}</span>
        </Space>
      ),
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      sorter: (khoaHocA: KhoaHoc, khoaHocB: KhoaHoc) =>
        khoaHocA.soLuongHocVien - khoaHocB.soLuongHocVien,
      render: (soLuong: number) => (
        <Tag color={soLuong > 0 ? 'blue' : 'default'} >
          👨‍🎓 {soLuong}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: KhoaHoc['trangThai']) => (
        <Tag color={MAU_TRANG_THAI[trangThai]} >
          {trangThai === 'Đang mở' && '🟢 '}
          {trangThai === 'Đã kết thúc' && '🔴 '}
          {trangThai === 'Tạm dừng' && '🟠 '}
          {trangThai}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'hanhDong',
      render: (_: unknown, banGhi: KhoaHoc) => (
        <Space>
          <Tooltip title="Chỉnh sửa khóa học">
            <Button
              icon={<EditOutlined />}
              onClick={() => khiNhanSua(banGhi)}
            >
              Sửa
            </Button>
          </Tooltip>

          {banGhi.soLuongHocVien > 0 && banGhi.trangThai === 'Đang mở' ? (
            <Tooltip title="Khóa học đang mở và có học viên thì không thể xóa">
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled
                onClick={() =>
                  message.error('Khóa học đang mở và có học viên thì không thể xóa!')
                }
              >
                Xóa
              </Button>
            </Tooltip>
          ) : (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa khóa học này không?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => khiXacNhanXoa(banGhi.idKhoaHoc)}
            >
              <Tooltip title="Xóa khóa học">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                >
                  Xóa
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table<KhoaHoc>
        columns={cauHinhCot}
        dataSource={duLieuDaLoc}
        rowKey="idKhoaHoc"
        loading={dangTai}
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
};

export default BangDanhSachKhoaHoc;
