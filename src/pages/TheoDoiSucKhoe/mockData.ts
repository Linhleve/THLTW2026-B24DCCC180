import {
  BuoiTap,
  ChiSoSucKhoe,
  MucTieu,
  BaiTap,
  BuoiTapTheoTuan,
  LichSuCanNang,
} from './types';

export const danhSachBuoiTap: BuoiTap[] = [
  { id: '1', ngay: '2026-04-28', loai: 'HIIT', thoiLuong: 45, calo: 520, ghiChu: 'Cảm giác tuyệt vời sau buổi tập', trangThai: 'Hoàn thành' },
  { id: '2', ngay: '2026-04-27', loai: 'Strength', thoiLuong: 60, calo: 380, ghiChu: 'Tập ngực và tay', trangThai: 'Hoàn thành' },
  { id: '3', ngay: '2026-04-26', loai: 'Cardio', thoiLuong: 30, calo: 280, ghiChu: 'Chạy bộ buổi sáng', trangThai: 'Hoàn thành' },
  { id: '4', ngay: '2026-04-25', loai: 'Yoga', thoiLuong: 50, calo: 180, ghiChu: 'Yoga phục hồi', trangThai: 'Bỏ lỡ' },
  { id: '5', ngay: '2026-04-24', loai: 'Strength', thoiLuong: 70, calo: 430, ghiChu: 'Tập lưng và vai', trangThai: 'Hoàn thành' },
  { id: '6', ngay: '2026-04-23', loai: 'HIIT', thoiLuong: 40, calo: 480, ghiChu: 'Tập tại nhà', trangThai: 'Hoàn thành' },
  { id: '7', ngay: '2026-04-22', loai: 'Cardio', thoiLuong: 35, calo: 310, ghiChu: '', trangThai: 'Hoàn thành' },
  { id: '8', ngay: '2026-04-21', loai: 'Other', thoiLuong: 25, calo: 150, ghiChu: 'Đi bộ nhẹ', trangThai: 'Bỏ lỡ' },
  { id: '9', ngay: '2026-04-20', loai: 'Strength', thoiLuong: 65, calo: 400, ghiChu: 'Tập chân', trangThai: 'Hoàn thành' },
  { id: '10', ngay: '2026-04-19', loai: 'Yoga', thoiLuong: 60, calo: 200, ghiChu: 'Yoga buổi tối', trangThai: 'Hoàn thành' },
];

export const danhSachChiSo: ChiSoSucKhoe[] = [
  { id: '1', ngay: '2026-04-28', canNang: 70.5, chieuCao: 175, bmi: 23.02, nhipTim: 68, gioNgu: 7.5 },
  { id: '2', ngay: '2026-04-21', canNang: 71.0, chieuCao: 175, bmi: 23.18, nhipTim: 72, gioNgu: 7.0 },
  { id: '3', ngay: '2026-04-14', canNang: 71.8, chieuCao: 175, bmi: 23.44, nhipTim: 70, gioNgu: 6.5 },
  { id: '4', ngay: '2026-04-07', canNang: 72.5, chieuCao: 175, bmi: 23.67, nhipTim: 75, gioNgu: 6.0 },
  { id: '5', ngay: '2026-03-31', canNang: 73.2, chieuCao: 175, bmi: 23.9, nhipTim: 76, gioNgu: 6.8 },
  { id: '6', ngay: '2026-03-24', canNang: 74.0, chieuCao: 175, bmi: 24.16, nhipTim: 78, gioNgu: 7.2 },
];

export const danhSachMucTieu: MucTieu[] = [
  { id: '1', ten: 'Giảm 5kg trong 3 tháng', loai: 'Cân nặng', giaTriMucTieu: 5, giaTriHienTai: 3.5, donVi: 'kg', hanChot: '2026-06-30', trangThai: 'Đang thực hiện' },
  { id: '2', ten: 'Chạy 5km dưới 30 phút', loai: 'Thể lực', giaTriMucTieu: 30, giaTriHienTai: 35, donVi: 'phút', hanChot: '2026-05-31', trangThai: 'Đang thực hiện' },
  { id: '3', ten: 'Tập gym 20 buổi tháng này', loai: 'Thể lực', giaTriMucTieu: 20, giaTriHienTai: 12, donVi: 'buổi', hanChot: '2026-04-30', trangThai: 'Đang thực hiện' },
  { id: '4', ten: 'Uống 2 lít nước mỗi ngày', loai: 'Dinh dưỡng', giaTriMucTieu: 60, giaTriHienTai: 60, donVi: 'ngày', hanChot: '2026-04-01', trangThai: 'Đã đạt' },
  { id: '5', ten: 'Ngủ đủ 8 tiếng', loai: 'Khác', giaTriMucTieu: 30, giaTriHienTai: 5, donVi: 'ngày', hanChot: '2026-03-31', trangThai: 'Đã hủy' },
];

export const danhSachBaiTap: BaiTap[] = [
  {
    id: '1', ten: 'Push-ups', nhomCo: 'Chest', mucDo: 'Dễ',
    moTa: 'Bài tập cơ bản cho ngực, vai và tay', caloMoiGio: 300,
    huongDan: ['Bắt đầu ở tư thế chống đẩy, tay rộng bằng vai', 'Hạ người xuống cho đến khi ngực gần chạm sàn', 'Đẩy người lên về tư thế ban đầu', 'Lặp lại 3 hiệp x 15 lần'],
  },
  {
    id: '2', ten: 'Squat', nhomCo: 'Legs', mucDo: 'Dễ',
    moTa: 'Bài tập cơ bản cho chân và mông', caloMoiGio: 350,
    huongDan: ['Đứng thẳng, chân rộng bằng vai', 'Hạ người xuống như đang ngồi ghế', 'Giữ lưng thẳng, đầu gối không vượt qua mũi chân', 'Đứng lên về tư thế ban đầu'],
  },
  {
    id: '3', ten: 'Pull-ups', nhomCo: 'Back', mucDo: 'Khó',
    moTa: 'Bài tập nâng cao cho cơ lưng và tay', caloMoiGio: 400,
    huongDan: ['Nắm chặt thanh xà, tay rộng hơn vai', 'Kéo người lên cho đến khi cằm vượt qua thanh xà', 'Hạ người từ từ về tư thế ban đầu', 'Lặp lại 3 hiệp x 8-12 lần'],
  },
  {
    id: '4', ten: 'Plank', nhomCo: 'Core', mucDo: 'Trung bình',
    moTa: 'Bài tập tăng cường cơ bụng và cơ lõi', caloMoiGio: 250,
    huongDan: ['Nằm sấp, chống khuỷu tay và mũi bàn chân', 'Giữ người thẳng từ đầu đến gót chân', 'Siết chặt cơ bụng và mông', 'Giữ 30-60 giây, nghỉ 30 giây, lặp lại 3 lần'],
  },
  {
    id: '5', ten: 'Burpees', nhomCo: 'Full Body', mucDo: 'Khó',
    moTa: 'Bài tập toàn thân cường độ cao', caloMoiGio: 600,
    huongDan: ['Đứng thẳng, sau đó hạ xuống tư thế squat', 'Đặt tay xuống sàn và bật chân ra sau', 'Thực hiện 1 cái chống đẩy', 'Kéo chân về và nhảy lên cao, vỗ tay trên đầu'],
  },
  {
    id: '6', ten: 'Dumbbell Shoulder Press', nhomCo: 'Shoulders', mucDo: 'Trung bình',
    moTa: 'Bài tập tạ tay cho cơ vai', caloMoiGio: 320,
    huongDan: ['Ngồi hoặc đứng thẳng, cầm tạ ở hai bên đầu', 'Đẩy tạ lên thẳng trên đầu', 'Hạ tạ từ từ về tư thế ban đầu', 'Lặp lại 3 hiệp x 12 lần'],
  },
  {
    id: '7', ten: 'Bicep Curls', nhomCo: 'Arms', mucDo: 'Dễ',
    moTa: 'Bài tập tạ tay cho cơ bắp tay trước', caloMoiGio: 200,
    huongDan: ['Đứng thẳng, cầm tạ ở hai tay', 'Giữ khuỷu tay sát thân', 'Cuộn tạ lên đến vai', 'Hạ tạ từ từ, lặp lại 3 hiệp x 15 lần'],
  },
  {
    id: '8', ten: 'Deadlift', nhomCo: 'Back', mucDo: 'Khó',
    moTa: 'Bài tập nâng tạ tổng hợp cho lưng và chân', caloMoiGio: 450,
    huongDan: ['Đứng trước thanh tạ, chân rộng bằng hông', 'Cúi người xuống, lưng thẳng, nắm chặt thanh tạ', 'Đứng dậy, đưa hông về phía trước', 'Hạ tạ từ từ về sàn'],
  },
  {
    id: '9', ten: 'Mountain Climbers', nhomCo: 'Core', mucDo: 'Trung bình',
    moTa: 'Bài tập cardio kết hợp cho cơ bụng', caloMoiGio: 500,
    huongDan: ['Bắt đầu ở tư thế chống đẩy', 'Kéo đầu gối phải về ngực', 'Đổi chân, kéo đầu gối trái về ngực', 'Thực hiện nhanh như đang chạy, 30 giây x 3 hiệp'],
  },
];

export const buoiTapTheoTuan: BuoiTapTheoTuan[] = [
  { tuan: 'Tuần 1', soLuong: 4 },
  { tuan: 'Tuần 2', soLuong: 5 },
  { tuan: 'Tuần 3', soLuong: 3 },
  { tuan: 'Tuần 4', soLuong: 6 },
];

export const lichSuCanNang: LichSuCanNang[] = [
  { ngay: '24/03', canNang: 74.0 },
  { ngay: '31/03', canNang: 73.2 },
  { ngay: '07/04', canNang: 72.5 },
  { ngay: '14/04', canNang: 71.8 },
  { ngay: '21/04', canNang: 71.0 },
  { ngay: '28/04', canNang: 70.5 },
];
