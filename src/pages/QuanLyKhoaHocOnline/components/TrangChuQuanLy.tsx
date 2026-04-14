import React, { useState, useMemo, useEffect } from 'react';
import { Card, Typography, ConfigProvider, message, notification } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import BoLocTimKiem from './BoLocTimKiem';
import BangDanhSachKhoaHoc from './BangDanhSachKhoaHoc';
import ModalThemSuaKhoaHoc from './ModalThemSuaKhoaHoc';
import type { KhoaHoc, LoaiTrangThai } from './duLieuMau';
import { duLieuKhoaHocBanDau } from './duLieuMau';

const { Title } = Typography;

const TrangChuQuanLy: React.FC = () => {
  const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>(duLieuKhoaHocBanDau);

  const [giaTriTimKiem, setGiaTriTimKiem] = useState<string>('');
  const [giangVienDuocLoc, setGiangVienDuocLoc] = useState<string | undefined>();
  const [trangThaiDuocLoc, setTrangThaiDuocLoc] = useState<LoaiTrangThai | undefined>();

  const [hienThiModal, setHienThiModal] = useState<boolean>(false);
  const [khoaHocDangSua, setKhoaHocDangSua] = useState<KhoaHoc | undefined>();

  const [dangTai, setDangTai] = useState<boolean>(false);

  const danhSachGiangVienUnique = useMemo(() => {
    const dsGiangVien = danhSachKhoaHoc.map((kh) => kh.giangVien);
    return Array.from(new Set(dsGiangVien)).sort();
  }, [danhSachKhoaHoc]);

  const danhSachDaLoc = useMemo(() => {
    return danhSachKhoaHoc.filter((kh) => {
      const khopTen = kh.tenKhoaHoc.toLowerCase().includes(giaTriTimKiem.toLowerCase());

      const khopGiangVien = giangVienDuocLoc ? kh.giangVien === giangVienDuocLoc : true;

      const khopTrangThai = trangThaiDuocLoc ? kh.trangThai === trangThaiDuocLoc : true;

      return khopTen && khopGiangVien && khopTrangThai;
    });
  }, [danhSachKhoaHoc, giaTriTimKiem, giangVienDuocLoc, trangThaiDuocLoc]);

  useEffect(() => {
    setDangTai(true);
    const timeOut = setTimeout(() => {
      setDangTai(false);
    }, 400); 
    return () => clearTimeout(timeOut);
  }, [giaTriTimKiem, giangVienDuocLoc, trangThaiDuocLoc]);

  const xuLyNhanThemMoi = () => {
    setKhoaHocDangSua(undefined);
    setHienThiModal(true);
  };

  const xuLyNhanSua = (khoaHoc: KhoaHoc) => {
    setKhoaHocDangSua(khoaHoc);
    setHienThiModal(true);
  };

  const xuLyXacNhanXoa = (idKhoaHocXoa: string) => {
    setDangTai(true);
    setTimeout(() => {
      setDanhSachKhoaHoc((danhSachCu) => 
        danhSachCu.filter((kh) => kh.idKhoaHoc !== idKhoaHocXoa)
      );
      setDangTai(false);
      message.success({ content: 'Đã xóa khóa học thành công!', key: 'xoaKhoaHoc' });
    }, 500);
  };

  const xuLyLuuKhoaHoc = (duLieuMoi: KhoaHoc) => {
    setDangTai(true);
    setTimeout(() => {
      if (khoaHocDangSua) {
        setDanhSachKhoaHoc((danhSachCu) =>
          danhSachCu.map((kh) =>
            kh.idKhoaHoc === duLieuMoi.idKhoaHoc ? duLieuMoi : kh
          )
        );
        notification.success({
          message: 'Cập nhật thành công',
          description: `Đã cập nhật thông tin khóa học "${duLieuMoi.tenKhoaHoc}".`,
          placement: 'bottomRight',
        });
      } else {
        setDanhSachKhoaHoc((danhSachCu) => [duLieuMoi, ...danhSachCu]);
        notification.success({
          message: 'Thêm mới thành công',
          description: `Đã thêm khóa học "${duLieuMoi.tenKhoaHoc}" vào hệ thống.`,
          placement: 'bottomRight',
        });
      }
      setDangTai(false);
    }, 600);
  };

  return (
    <ConfigProvider locale={viVN}>
      <Card>
        <Title level={2}>
          🚀 Quản Lý Khóa Học Trực Tuyến
        </Title>

        <BoLocTimKiem
          danhSachGiangVienUnique={danhSachGiangVienUnique}
          khiTimKiem={setGiaTriTimKiem}
          khiLocGiangVien={setGiangVienDuocLoc}
          khiLocTrangThai={setTrangThaiDuocLoc}
          khiNhanThemMoi={xuLyNhanThemMoi}
        />

        <BangDanhSachKhoaHoc
          duLieuDaLoc={danhSachDaLoc}
          dangTai={dangTai}
          khiNhanSua={xuLyNhanSua}
          khiXacNhanXoa={xuLyXacNhanXoa}
        />

        <ModalThemSuaKhoaHoc
          hienThi={hienThiModal}
          khiDongModal={() => setHienThiModal(false)}
          khoaHocDangSua={khoaHocDangSua}
          khiLuuKhoaHoc={xuLyLuuKhoaHoc}
          danhSachKhoaHocHienTai={danhSachKhoaHoc}
        />
      </Card>
    </ConfigProvider>
  );
};

export default TrangChuQuanLy;
