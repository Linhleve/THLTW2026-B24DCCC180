export type LoaiTrangThai = 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';

export interface KhoaHoc {
  idKhoaHoc: string;
  tenKhoaHoc: string;
  giangVien: string;
  soLuongHocVien: number;
  trangThai: LoaiTrangThai;
  moTa: string;
}

export const DANH_SACH_GIANG_VIEN: string[] = [
  'PGS.TS Nguyễn Văn An',
  'TS. Trần Thị Bình',
  'ThS. Lê Hoàng Cường',
  'TS. Phạm Minh Đức',
  'PGS.TS Hoàng Thị Mai',
  'ThS. Vũ Quang Huy',
];

export const DANH_SACH_TRANG_THAI: LoaiTrangThai[] = [
  'Đang mở',
  'Đã kết thúc',
  'Tạm dừng',
];

export const MAU_TRANG_THAI: Record<LoaiTrangThai, string> = {
  'Đang mở': 'green',
  'Đã kết thúc': 'red',
  'Tạm dừng': 'orange',
};

export const duLieuKhoaHocBanDau: KhoaHoc[] = [
  {
    idKhoaHoc: 'KH001',
    tenKhoaHoc: 'Lập trình React cơ bản',
    giangVien: 'PGS.TS Nguyễn Văn An',
    soLuongHocVien: 45,
    trangThai: 'Đang mở',
    moTa: 'Khóa học giúp bạn nắm vững kiến thức <b>React</b> từ cơ bản đến nâng cao, bao gồm Hooks, Context API và React Router.',
  },
  {
    idKhoaHoc: 'KH002',
    tenKhoaHoc: 'TypeScript nâng cao',
    giangVien: 'TS. Trần Thị Bình',
    soLuongHocVien: 32,
    trangThai: 'Đang mở',
    moTa: 'Đi sâu vào hệ thống kiểu dữ liệu của TypeScript: <i>Generics, Utility Types, Conditional Types</i> và các patterns nâng cao.',
  },
  {
    idKhoaHoc: 'KH003',
    tenKhoaHoc: 'Node.js & Express API',
    giangVien: 'ThS. Lê Hoàng Cường',
    soLuongHocVien: 0,
    trangThai: 'Tạm dừng',
    moTa: 'Xây dựng RESTful API hoàn chỉnh với Node.js, Express, kết nối MongoDB, xử lý authentication và authorization.',
  },
  {
    idKhoaHoc: 'KH004',
    tenKhoaHoc: 'Python cho Data Science',
    giangVien: 'TS. Phạm Minh Đức',
    soLuongHocVien: 78,
    trangThai: 'Đang mở',
    moTa: 'Học cách sử dụng Python, Pandas, NumPy và Matplotlib để phân tích và trực quan hóa dữ liệu.',
  },
  {
    idKhoaHoc: 'KH005',
    tenKhoaHoc: 'Java Spring Boot',
    giangVien: 'PGS.TS Hoàng Thị Mai',
    soLuongHocVien: 25,
    trangThai: 'Đã kết thúc',
    moTa: 'Phát triển ứng dụng web enterprise với Spring Boot, Spring Security, JPA/Hibernate và microservices.',
  },
  {
    idKhoaHoc: 'KH006',
    tenKhoaHoc: 'DevOps với Docker & Kubernetes',
    giangVien: 'ThS. Vũ Quang Huy',
    soLuongHocVien: 18,
    trangThai: 'Đang mở',
    moTa: 'Triển khai ứng dụng container hóa, CI/CD pipeline, quản lý cluster với Kubernetes.',
  },
  {
    idKhoaHoc: 'KH007',
    tenKhoaHoc: 'Thiết kế UI/UX chuyên nghiệp',
    giangVien: 'TS. Trần Thị Bình',
    soLuongHocVien: 0,
    trangThai: 'Tạm dừng',
    moTa: 'Nguyên lý thiết kế giao diện, trải nghiệm người dùng, công cụ Figma và Adobe XD.',
  },
  {
    idKhoaHoc: 'KH008',
    tenKhoaHoc: 'Cơ sở dữ liệu SQL & NoSQL',
    giangVien: 'PGS.TS Nguyễn Văn An',
    soLuongHocVien: 55,
    trangThai: 'Đã kết thúc',
    moTa: 'So sánh MySQL, PostgreSQL với MongoDB, Redis. Thiết kế schema, indexing và tối ưu hiệu năng query.',
  },
  {
    idKhoaHoc: 'KH009',
    tenKhoaHoc: 'An ninh mạng căn bản',
    giangVien: 'TS. Phạm Minh Đức',
    soLuongHocVien: 12,
    trangThai: 'Đang mở',
    moTa: 'Tổng quan bảo mật mạng, các loại tấn công phổ biến, phòng chống và ứng cứu sự cố an ninh mạng.',
  },
  {
    idKhoaHoc: 'KH010',
    tenKhoaHoc: 'Machine Learning cơ bản',
    giangVien: 'PGS.TS Hoàng Thị Mai',
    soLuongHocVien: 0,
    trangThai: 'Đã kết thúc',
    moTa: 'Giới thiệu các thuật toán ML cơ bản: Linear Regression, Decision Tree, Random Forest, SVM và Neural Network.',
  },
];
