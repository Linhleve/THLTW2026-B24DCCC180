export type LoaiBaiTap = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type TrangThaiBuoiTap = 'Hoàn thành' | 'Bỏ lỡ';

export interface BuoiTap {
  id: string;
  ngay: string;
  loai: LoaiBaiTap;
  thoiLuong: number;
  calo: number;
  ghiChu: string;
  trangThai: TrangThaiBuoiTap;
}

export interface ChiSoSucKhoe {
  id: string;
  ngay: string;
  canNang: number;
  chieuCao: number;
  bmi: number;
  nhipTim: number;
  gioNgu: number;
}

export type LoaiMucTieu = 'Cân nặng' | 'Thể lực' | 'Dinh dưỡng' | 'Khác';
export type TrangThaiMucTieu = 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';

export interface MucTieu {
  id: string;
  ten: string;
  loai: LoaiMucTieu;
  giaTriMucTieu: number;
  giaTriHienTai: number;
  donVi: string;
  hanChot: string;
  trangThai: TrangThaiMucTieu;
}

export type NhomCo =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body';

export type MucDo = 'Dễ' | 'Trung bình' | 'Khó';

export interface BaiTap {
  id: string;
  ten: string;
  nhomCo: NhomCo;
  mucDo: MucDo;
  moTa: string;
  caloMoiGio: number;
  huongDan: string[];
}

export interface BuoiTapTheoTuan {
  tuan: string;
  soLuong: number;
}

export interface LichSuCanNang {
  ngay: string;
  canNang: number;
}
