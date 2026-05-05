import { useState, useEffect, useCallback } from 'react';
import type { CongViec, TrangThaiCongViec } from './kieuDuLieu';

const KHOA_LUU_TRU = 'theo_doi_cong_viec_ca_nhan';

const taoMaId = (): string => {
  return `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const docDuLieuTuLuuTru = (): CongViec[] => {
  try {
    const duLieuChuoi = localStorage.getItem(KHOA_LUU_TRU);
    if (duLieuChuoi) {
      return JSON.parse(duLieuChuoi) as CongViec[];
    }
  } catch {
    return [];
  }
  return [];
};

const ghiDuLieuVaoLuuTru = (danhSach: CongViec[]): void => {
  try {
    localStorage.setItem(KHOA_LUU_TRU, JSON.stringify(danhSach));
  } catch {
    console.error('Không thể lưu dữ liệu vào localStorage');
  }
};

const suDungDuLieuCongViec = () => {
  const [danhSachCongViec, datDanhSachCongViec] = useState<CongViec[]>([]);
  const [dangTai, datDangTai] = useState<boolean>(true);

  useEffect(() => {
    const duLieu = docDuLieuTuLuuTru();
    datDanhSachCongViec(duLieu);
    datDangTai(false);
  }, []);

  const capNhatVaLuu = useCallback((danhSachMoi: CongViec[]) => {
    datDanhSachCongViec(danhSachMoi);
    ghiDuLieuVaoLuuTru(danhSachMoi);
  }, []);

  const themCongViec = useCallback(
    (congViecMoi: Omit<CongViec, 'maId' | 'ngayTao'>) => {
      const congViecDayDu: CongViec = {
        ...congViecMoi,
        maId: taoMaId(),
        ngayTao: new Date().toISOString(),
      };
      const danhSachMoi = [...danhSachCongViec, congViecDayDu];
      capNhatVaLuu(danhSachMoi);
    },
    [danhSachCongViec, capNhatVaLuu],
  );

  const suaCongViec = useCallback(
    (maId: string, duLieuCapNhat: Partial<Omit<CongViec, 'maId' | 'ngayTao'>>) => {
      const danhSachMoi = danhSachCongViec.map((cv) =>
        cv.maId === maId ? { ...cv, ...duLieuCapNhat } : cv,
      );
      capNhatVaLuu(danhSachMoi);
    },
    [danhSachCongViec, capNhatVaLuu],
  );

  const xoaCongViec = useCallback(
    (maId: string) => {
      const danhSachMoi = danhSachCongViec.filter((cv) => cv.maId !== maId);
      capNhatVaLuu(danhSachMoi);
    },
    [danhSachCongViec, capNhatVaLuu],
  );

  const capNhatTrangThai = useCallback(
    (maId: string, trangThaiMoi: TrangThaiCongViec) => {
      const danhSachMoi = danhSachCongViec.map((cv) =>
        cv.maId === maId ? { ...cv, trangThai: trangThaiMoi } : cv,
      );
      capNhatVaLuu(danhSachMoi);
    },
    [danhSachCongViec, capNhatVaLuu],
  );

  const sapXepLaiDanhSach = useCallback(
    (danhSachMoi: CongViec[]) => {
      capNhatVaLuu(danhSachMoi);
    },
    [capNhatVaLuu],
  );

  return {
    danhSachCongViec,
    dangTai,
    themCongViec,
    suaCongViec,
    xoaCongViec,
    capNhatTrangThai,
    sapXepLaiDanhSach,
  };
};

export default suDungDuLieuCongViec;
