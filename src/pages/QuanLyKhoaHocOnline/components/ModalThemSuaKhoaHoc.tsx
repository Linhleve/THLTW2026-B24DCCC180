import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import type { KhoaHoc } from './duLieuMau';
import { DANH_SACH_GIANG_VIEN, DANH_SACH_TRANG_THAI } from './duLieuMau';

const { TextArea } = Input;
const { Option } = Select;

interface ModalThemSuaKhoaHocProps {
  hienThi: boolean;
  khiDongModal: () => void;
  khoaHocDangSua: KhoaHoc | undefined;
  khiLuuKhoaHoc: (duLieu: KhoaHoc) => void;
  danhSachKhoaHocHienTai: KhoaHoc[];
}

const ModalThemSuaKhoaHoc: React.FC<ModalThemSuaKhoaHocProps> = ({
  hienThi,
  khiDongModal,
  khoaHocDangSua,
  khiLuuKhoaHoc,
  danhSachKhoaHocHienTai,
}) => {
  const [form] = Form.useForm();

  const laChinhSua = !!khoaHocDangSua;

  useEffect(() => {
    if (hienThi) {
      if (khoaHocDangSua) {
        form.setFieldsValue(khoaHocDangSua);
      } else {
        form.resetFields();
        form.setFieldsValue({ soLuongHocVien: 0 });
      }
    }
  }, [hienThi, khoaHocDangSua, form]);

  const xuLyLuuForm = async () => {
    try {
      const duLieuForm = await form.validateFields();

      if (laChinhSua && khoaHocDangSua) {
        khiLuuKhoaHoc({
          ...khoaHocDangSua,
          ...duLieuForm,
        });
      } else {
        const idMoi = `KH${String(Date.now()).slice(-6)}`;
        khiLuuKhoaHoc({
          idKhoaHoc: idMoi,
          ...duLieuForm,
        });
      }

      form.resetFields();
      khiDongModal();
    } catch (loi) {
      console.log('Lỗi validate form:', loi);
    }
  };

  const kiemTraTrungTen = (_: any, giaTri: string) => {
    if (!giaTri) return Promise.resolve();

    const tenChuanHoa = giaTri.trim().toLowerCase();
    const danhSachKiemTra = danhSachKhoaHocHienTai.filter(
      (kh) => khoaHocDangSua?.idKhoaHoc !== kh.idKhoaHoc,
    );

    const biTrung = danhSachKiemTra.some(
      (kh) => kh.tenKhoaHoc.trim().toLowerCase() === tenChuanHoa,
    );

    if (biTrung) {
      return Promise.reject(
        new Error('Tên khóa học đã tồn tại! Vui lòng nhập tên khác.'),
      );
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={laChinhSua ? '✏️ Chỉnh sửa khóa học' : '➕ Thêm khóa học mới'}
      visible={hienThi}
      onOk={xuLyLuuForm}
      onCancel={() => {
        form.resetFields();
        khiDongModal();
      }}
      okText={laChinhSua ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy bỏ"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        autoComplete="off"
      >
        <Form.Item
          label="📖 Tên khóa học"
          name="tenKhoaHoc"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học!' },
            { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự!' },
            { validator: kiemTraTrungTen },
          ]}
        >
          <Input
            placeholder="Nhập tên khóa học..."
            showCount
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label="👨‍🏫 Giảng viên"
          name="giangVien"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
        >
          <Select
            placeholder="Chọn giảng viên phụ trách..."
          >
            {DANH_SACH_GIANG_VIEN.map((giangVien) => (
              <Option key={giangVien} value={giangVien}>
                {giangVien}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="👨‍🎓 Số lượng học viên"
          name="soLuongHocVien"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng học viên!' },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === '') {
                  return Promise.resolve();
                }
                if (Number(value) < 0) {
                  return Promise.reject(new Error('Số lượng học viên phải lớn hơn hoặc bằng 0!'));
                }
                if (!Number.isInteger(Number(value))) {
                  return Promise.reject(new Error('Số lượng học viên phải là số nguyên!'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="0"
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="📋 Trạng thái"
          name="trangThai"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select
            placeholder="Chọn trạng thái khóa học..."
          >
            {DANH_SACH_TRANG_THAI.map((trangThai) => (
              <Option key={trangThai} value={trangThai}>
                {trangThai === 'Đang mở' && '🟢 '}
                {trangThai === 'Đã kết thúc' && '🔴 '}
                {trangThai === 'Tạm dừng' && '🟠 '}
                {trangThai}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="📝 Mô tả khóa học (có thể nhập HTML cơ bản)"
          name="moTa"
        >
          <TextArea
            placeholder="Nhập mô tả chi tiết về khóa học. Có thể dùng thẻ HTML cơ bản như <b>, <i>, <ul>..."
            rows={4}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalThemSuaKhoaHoc;
