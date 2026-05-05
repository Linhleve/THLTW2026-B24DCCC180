export type TrangThaiCongViec = 'canLam' | 'dangLam' | 'hoanThanh';

export type MucDoUuTien = 'cao' | 'trungBinh' | 'thap';

export interface CongViec {
  maId: string;
  tenCongViec: string;
  moTa?: string;
  hanChot?: string;
  mucDoUuTien: MucDoUuTien;
  trangThai: TrangThaiCongViec;
  nhanTag: string[];
  ngayTao: string;
}

export interface ThongKeNhiemVu {
  tongSo: number;
  daHoanThanh: number;
  quaHan: number;
}

export interface CotKanban {
  id: TrangThaiCongViec;
  tieuDe: string;
  danhSachCongViec: CongViec[];
  mauNen: string;
  mauDuong: string;
}
