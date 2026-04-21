export type TrangThaiBaiViet = 'nhap' | 'da_dang';

export interface IThe {
  id: string;
  tenThe: string;
  mauSac: string;
}

export interface IThongTinNguoiDung {
  id: string;
  tenHienThi: string;
  tenDangNhap: string;
  email: string;
  tieuSu: string;
  anhDaiDien: string;
  viTri: string;
  kyNang: string[];
  lienKetMangXaHoi: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    facebook?: string;
  };
}

export interface IBaiViet {
  id: string;
  tieuDe: string;
  duongDan: string;
  tomTat: string;
  noiDung: string;
  anhDaiDien: string;
  tacGia: IThongTinNguoiDung;
  cacThe: IThe[];
  trangThai: TrangThaiBaiViet;
  luotXem: number;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface IGiaTriFormBaiViet {
  tieuDe: string;
  duongDan: string;
  anhDaiDien: string;
  tomTat?: string;
  noiDung: string;
  cacThe: string[];
  trangThai: TrangThaiBaiViet;
}

export interface IGiaTriFormThe {
  tenThe: string;
}

export type TenTrang =
  | 'trang-chu'
  | 'chi-tiet-bai-viet'
  | 'gioi-thieu'
  | 'quan-ly-bai-viet'
  | 'quan-ly-the';

export interface IThamSoDieuHuong {
  trang: TenTrang;
  duongDan?: string;
}
