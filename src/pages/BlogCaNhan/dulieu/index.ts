import type { IBaiViet, IThe, IThongTinNguoiDung } from '../kieu';

export const duLieuTacGia: IThongTinNguoiDung = {
  id: 'user-001',
  tenHienThi: 'Phạm Hữu Linh',
  tenDangNhap: 'phamlinh',
  email: 'linh230326@gmail.com',
  tieuSu:
    'Tôi là một travel blogger đam mê khám phá thế giới. Với hơn 5 năm đặt bút viết về du lịch, tôi đã đặt chân đến hơn 30 quốc gia và vô số vùng đất kỳ thú trên khắp Việt Nam. Tôi chia sẻ những trải nghiệm thực tế, mẹo du lịch tiết kiệm và những câu chuyện thú vị từ mỗi hành trình.',
  anhDaiDien: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamLinh',
  viTri: 'Travel Blogger · Hà Nội, Việt Nam',
  kyNang: [
    'Phượt bụi',
    'Nhiếp ảnh du lịch',
    'Ẩm thực đường phố',
    'Leo núi',
    'Lặn biển',
    'Cắm trại',
    'Review khách sạn',
    'Lập kế hoạch chuyến đi',
    'Tiết kiệm chi phí',
    'Văn hóa bản địa',
  ],
  lienKetMangXaHoi: {
    github: 'https://github.com/Linhleve',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    website: 'https://github.com/Linhleve',
    facebook: 'https://facebook.com',
  },
};

export const duLieuCacThe: IThe[] = [
  { id: 'the-001', tenThe: 'Việt Nam', mauSac: 'red' },
  { id: 'the-002', tenThe: 'Châu Âu', mauSac: 'blue' },
  { id: 'the-003', tenThe: 'Đông Nam Á', mauSac: 'green' },
  { id: 'the-004', tenThe: 'Ẩm thực', mauSac: 'orange' },
  { id: 'the-005', tenThe: 'Biển đảo', mauSac: 'cyan' },
  { id: 'the-006', tenThe: 'Phượt', mauSac: 'volcano' },
  { id: 'the-007', tenThe: 'Văn hóa', mauSac: 'purple' },
  { id: 'the-008', tenThe: 'Tiết kiệm', mauSac: 'lime' },
];

const noiDungMauHTML = `
<h2>Giới thiệu điểm đến</h2>
<p>Mỗi chuyến đi là một trang sách mới, mỗi vùng đất là một câu chuyện chưa được kể. Trong bài viết này, tôi sẽ chia sẻ toàn bộ trải nghiệm của mình — từ những khoảnh khắc ngỡ ngàng trước vẻ đẹp thiên nhiên, những bữa ăn ven đường đậm đà hương vị địa phương, đến những con người thân thiện mà tôi may mắn gặp gỡ.</p>

<h2>Hành trình di chuyển</h2>
<p>Việc lên kế hoạch di chuyển luôn là bước quan trọng nhất. Tôi thường ưu tiên các phương tiện công cộng để tiết kiệm chi phí và hòa nhập với cuộc sống của người dân địa phương. Dưới đây là một số lưu ý hữu ích:</p>
<ul>
  <li>Đặt vé sớm ít nhất 2–4 tuần để có giá tốt nhất</li>
  <li>Tải bản đồ offline để dùng khi không có internet</li>
  <li>Luôn có sẵn tiền mặt địa phương cho những nơi không nhận thẻ</li>
  <li>Hỏi người dân địa phương về các tuyến đường ít người biết</li>
</ul>

<h2>Ẩm thực và trải nghiệm</h2>
<p>Không gì phản ánh văn hóa của một vùng đất rõ nét hơn ẩm thực. Tôi luôn dành thời gian ghé các khu chợ địa phương, thử các món ăn đường phố mà người dân bản xứ yêu thích. Đây là cách tuyệt vời để hiểu về con người và lối sống nơi đó.</p>

<h2>Mẹo và lưu ý</h2>
<p>Sau nhiều chuyến đi, tôi đúc kết được một số bài học quý giá. Hãy luôn chuẩn bị tinh thần cho những điều bất ngờ — đó chính là gia vị làm cho mỗi hành trình trở nên đáng nhớ. Đừng quên mua bảo hiểm du lịch và để lại lịch trình cho người thân trước khi lên đường!</p>
`;

export const duLieuCacBaiViet: IBaiViet[] = [
  {
    id: 'bv-001',
    tieuDe: 'Hà Giang Mùa Hoa Tam Giác Mạch: Thiên Đường Nơi Địa Đầu Tổ Quốc',
    duongDan: 'ha-giang-mua-hoa-tam-giac-mach',
    tomTat:
      'Tháng 10–11 hàng năm, cao nguyên đá Đồng Văn nở rộ sắc hồng của hoa tam giác mạch — khung cảnh đẹp đến khó tin ngay trên đất Việt. Trọn bộ kinh nghiệm phượt Hà Giang cho người lần đầu.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/hagiang/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[5]],
    trangThai: 'da_dang',
    luotXem: 3420,
    ngayTao: '2024-10-10T08:00:00Z',
    ngayCapNhat: '2024-10-15T10:00:00Z',
  },
  {
    id: 'bv-002',
    tieuDe: 'Phú Quốc 4 Ngày 3 Đêm: Đảo Ngọc Tây Nam Trên Từng Bước Chân',
    duongDan: 'phu-quoc-4-ngay-3-dem',
    tomTat:
      'Biển xanh trong vắt, bãi cát trắng mịn và những rặng san hô kỳ ảo. Phú Quốc không chỉ đẹp trên ảnh mà còn đẹp hơn rất nhiều ngoài thực tế. Lịch trình chi tiết kèm chi phí thực tế.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/phuquoc/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[4]],
    trangThai: 'da_dang',
    luotXem: 2890,
    ngayTao: '2024-07-05T08:00:00Z',
    ngayCapNhat: '2024-07-08T11:00:00Z',
  },
  {
    id: 'bv-003',
    tieuDe: 'Sapa Mây Mù và Ruộng Bậc Thang: Trekking Qua Làng Cát Cát',
    duongDan: 'sapa-treking-lang-cat-cat',
    tomTat:
      'Con đường mòn dẫn qua những thửa ruộng bậc thang xanh mướt, những ngôi làng người H\'Mông ẩn mình trong sương, và buổi chiều tà nhuộm vàng thung lũng Mường Hoa — Sapa mãi là giấc mơ.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/sapa-trek/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[6]],
    trangThai: 'da_dang',
    luotXem: 2150,
    ngayTao: '2024-09-01T08:00:00Z',
    ngayCapNhat: '2024-09-05T09:00:00Z',
  },
  {
    id: 'bv-004',
    tieuDe: 'Khám Phá Hội An: Phố Cổ Ngàn Năm Lung Linh Ánh Đèn Lồng',
    duongDan: 'kham-pha-hoi-an-pho-co',
    tomTat:
      'Hội An lọt top những thành phố đẹp nhất thế giới không phải ngẫu nhiên. Từ những ngôi nhà cổ rêu phong, chùa Cầu huyền bí đến chén cao lầu thơm ngon — mọi góc phố đều xứng đáng được khám phá.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/hoian/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[6], duLieuCacThe[3]],
    trangThai: 'da_dang',
    luotXem: 1980,
    ngayTao: '2024-04-15T08:00:00Z',
    ngayCapNhat: '2024-04-18T10:00:00Z',
  },
  {
    id: 'bv-005',
    tieuDe: 'Bali – Đảo Của Các Vị Thần: 7 Ngày Trải Nghiệm Thiên Đường',
    duongDan: 'bali-dao-cua-cac-vi-than',
    tomTat:
      'Từ ruộng bậc thang Tegalalang, đền Tanah Lot bên sóng biển, đến những buổi hoàng hôn huyền ảo tại Uluwatu — Bali là điểm đến khiến bạn muốn quay lại mãi mãi.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/bali-island/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[2], duLieuCacThe[4], duLieuCacThe[6]],
    trangThai: 'da_dang',
    luotXem: 3100,
    ngayTao: '2024-03-20T08:00:00Z',
    ngayCapNhat: '2024-03-25T12:00:00Z',
  },
  {
    id: 'bv-006',
    tieuDe: 'Du Lịch Châu Âu Bụi 21 Ngày Với 30 Triệu: Có Thật Không?',
    duongDan: 'du-lich-chau-au-bui-21-ngay',
    tomTat:
      'Nhiều người nghĩ Châu Âu quá đắt đỏ, nhưng với kế hoạch đúng đắn bạn hoàn toàn có thể khám phá Paris, Amsterdam, Prague và Budapest chỉ với 30 triệu đồng. Đây là toàn bộ bí quyết của tôi.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/europe-budget/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[1], duLieuCacThe[7]],
    trangThai: 'da_dang',
    luotXem: 4200,
    ngayTao: '2024-06-01T08:00:00Z',
    ngayCapNhat: '2024-06-05T14:00:00Z',
  },
  {
    id: 'bv-007',
    tieuDe: 'Ninh Bình — Hạ Long Trên Cạn: Chèo Thuyền Qua Tràng An Huyền Bí',
    duongDan: 'ninh-binh-ha-long-tren-can',
    tomTat:
      'Tràng An được UNESCO công nhận là Di sản thế giới kép. Những hành lang đá vôi uốn lượn, hang động bí ẩn và mặt hồ phẳng lặng như gương tạo nên khung cảnh không thể tìm thấy ở đâu khác.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/ninhbinh/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[6]],
    trangThai: 'da_dang',
    luotXem: 1760,
    ngayTao: '2024-05-10T08:00:00Z',
    ngayCapNhat: '2024-05-12T10:00:00Z',
  },
  {
    id: 'bv-008',
    tieuDe: 'Thái Lan 5 Ngày: Bangkok Sôi Động Đến Chiang Mai Thơ Mộng',
    duongDan: 'thai-lan-5-ngay-bangkok-chiangmai',
    tomTat:
      'Bangkok tấp nập with chùa Wat Pho, chợ nổi Damnoen Saduak và đường phố đầy màu sắc. Rồi thoát lên Chiang Mai yên bình with các ngôi đền cổ và lễ hội thả đèn trời Yi Peng.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/thailand/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[2], duLieuCacThe[3], duLieuCacThe[6]],
    trangThai: 'da_dang',
    luotXem: 2630,
    ngayTao: '2024-02-14T08:00:00Z',
    ngayCapNhat: '2024-02-18T11:00:00Z',
  },
  {
    id: 'bv-009',
    tieuDe: 'Ăn Gì Ở Đà Nẵng? 15 Món Không Thể Bỏ Qua Của Người Sành Ăn',
    duongDan: 'an-gi-o-da-nang-15-mon',
    tomTat:
      'Mì Quảng, bún chả cá, bánh tráng cuốn thịt heo, bánh xèo... Đà Nẵng là thiên đường của những người yêu ẩm thực miền Trung. Khám phá 15 quán ăn ngon mà dân địa phương hay lui tới.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/danang-food/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[3]],
    trangThai: 'da_dang',
    luotXem: 3850,
    ngayTao: '2024-08-20T08:00:00Z',
    ngayCapNhat: '2024-08-22T09:00:00Z',
  },
  {
    id: 'bv-010',
    tieuDe: 'Santorini – Hy Lạp: Khi Mơ Ước Chạm Đến Thực Tế',
    duongDan: 'santorini-hy-lap-mo-uoc',
    tomTat:
      'Những mái vòm xanh biếc nhìn xuống biển Aegean, những con phố trắng muốt dưới nắng chiều và ly rượu vang đỏ bên hoàng hôn Oia — Santorini là nơi mà bạn sẽ không muốn rời đi.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/santorini/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[1], duLieuCacThe[4]],
    trangThai: 'da_dang',
    luotXem: 2940,
    ngayTao: '2024-07-25T08:00:00Z',
    ngayCapNhat: '2024-07-28T10:00:00Z',
  },
  {
    id: 'bv-011',
    tieuDe: 'Cô Tô: Hòn Đảo Nguyên Sơ Cuối Cùng Của Miền Bắc',
    duongDan: 'co-to-dao-nguyen-so-mien-bac',
    tomTat:
      'Xa hơn Cát Bà, hoang sơ hơn Hạ Long, Cô Tô ẩn chứa vẻ đẹp thuần túy hiếm còn tìm thấy. Bãi biển tự nhiên, hải sản tươi rói và không khí trong lành là phần thưởng cho những ai dám đi xa.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/coto-island/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[4], duLieuCacThe[5]],
    trangThai: 'da_dang',
    luotXem: 1580,
    ngayTao: '2024-05-25T08:00:00Z',
    ngayCapNhat: '2024-05-27T09:00:00Z',
  },
  {
    id: 'bv-012',
    tieuDe: 'Nhật Bản Mùa Hoa Anh Đào: Lịch Trình Tokyo – Kyoto – Osaka',
    duongDan: 'nhat-ban-mua-hoa-anh-dao',
    tomTat:
      'Hanami — ngắm hoa anh đào — là trải nghiệm không thể bỏ qua khi đến Nhật. Từ công viên Ueno ở Tokyo, đến chùa Kinkakuji ở Kyoto và lâu đài Osaka, mùa xuân Nhật Bản thật sự huyền diệu.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/japan-sakura/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[6], duLieuCacThe[3]],
    trangThai: 'da_dang',
    luotXem: 4680,
    ngayTao: '2024-03-28T08:00:00Z',
    ngayCapNhat: '2024-04-02T11:00:00Z',
  },
  {
    id: 'bv-013',
    tieuDe: 'Kinh Nghiệm Du Lịch Maldives Tiết Kiệm: Không Cần Triệu Phú',
    duongDan: 'kinh-nghiem-du-lich-maldives-tiet-kiem',
    tomTat:
      'Maldives không đến nỗi xa xỉ như bạn nghĩ nếu biết cách. Ở local island thay vì resort nổi, đi ferry thay máy bay thủy phi cơ, mua thức ăn ở chợ địa phương — đây là công thức tiết kiệm tối đa.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/maldives-budget/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[4], duLieuCacThe[7]],
    trangThai: 'nhap',
    luotXem: 0,
    ngayTao: '2024-11-01T08:00:00Z',
    ngayCapNhat: '2024-11-01T08:00:00Z',
  },
  {
    id: 'bv-014',
    tieuDe: 'Hành Trình Xuyên Việt 30 Ngày: Từ Mũi Cà Mau Đến Lũng Cú',
    duongDan: 'hanh-trinh-xuyen-viet-30-ngay',
    tomTat:
      'Một chiếc xe máy, một ba lô nhỏ và 30 ngày dọc theo dải đất hình chữ S. Từ rừng đước Cà Mau, đến phố núi Đà Lạt, cố đô Huế, và cực Bắc Lũng Cú — đây là hành trình tôi sẽ nhớ cả đời.',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/xuyen-viet/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[0], duLieuCacThe[5], duLieuCacThe[6]],
    trangThai: 'da_dang',
    luotXem: 5200,
    ngayTao: '2024-01-10T08:00:00Z',
    ngayCapNhat: '2024-01-20T15:00:00Z',
  },
  {
    id: 'bv-015',
    tieuDe: '10 Lỗi Sai Phổ Biến Khi Du Lịch Lần Đầu Mà Tôi Từng Mắc',
    duongDan: '10-loi-sai-khi-du-lich-lan-dau',
    tomTat:
      'Từ quên mua bảo hiểm du lịch, đổi tiền tại sân bay, đặt khách sạn quá xa trung tâm đến mang theo quá nhiều hành lý — những sai lầm này tốn của tôi cả tiền lẫn thời gian. Đừng lặp lại!',
    noiDung: noiDungMauHTML,
    anhDaiDien: 'https://picsum.photos/seed/travel-tips/800/450',
    tacGia: duLieuTacGia,
    cacThe: [duLieuCacThe[7], duLieuCacThe[5]],
    trangThai: 'da_dang',
    luotXem: 6100,
    ngayTao: '2024-11-15T08:00:00Z',
    ngayCapNhat: '2024-11-16T10:00:00Z',
  },
];
