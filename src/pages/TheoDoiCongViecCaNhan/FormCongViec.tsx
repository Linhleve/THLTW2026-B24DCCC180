import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Tag, Typography, Space } from 'antd';
import moment from 'moment';
import type { CongViec, TrangThaiCongViec, MucDoUuTien } from './kieuDuLieu';

const { TextArea } = Input;
const { Title } = Typography;

interface FormCongViecProps {
  hienThi: boolean;
  congViecDangSua?: CongViec;
  trangThaiMacDinh?: TrangThaiCongViec;
  onDong: () => void;
  onLuu: (duLieu: Omit<CongViec, 'maId' | 'ngayTao'>) => void;
}

const MAU_UU_TIEN: Record<MucDoUuTien, string> = {
  cao: '#ff4d4f',
  trungBinh: '#faad14',
  thap: '#52c41a',
};

const NHAN_UU_TIEN: Record<MucDoUuTien, string> = {
  cao: 'Cao',
  trungBinh: 'Trung Bình',
  thap: 'Thấp',
};

const NHAN_TRANG_THAI: Record<TrangThaiCongViec, string> = {
  canLam: 'Cần Làm',
  dangLam: 'Đang Làm',
  hoanThanh: 'Hoàn Thành',
};

const FormCongViec: React.FC<FormCongViecProps> = ({
  hienThi,
  congViecDangSua,
  trangThaiMacDinh = 'canLam',
  onDong,
  onLuu,
}) => {
  const [form] = Form.useForm();
  const [dangXuLy, datDangXuLy] = useState(false);

  React.useEffect(() => {
    if (hienThi) {
      if (congViecDangSua) {
        form.setFieldsValue({
          tenCongViec: congViecDangSua.tenCongViec,
          moTa: congViecDangSua.moTa,
          hanChot: congViecDangSua.hanChot ? moment(congViecDangSua.hanChot) : undefined,
          mucDoUuTien: congViecDangSua.mucDoUuTien,
          trangThai: congViecDangSua.trangThai,
          nhanTag: congViecDangSua.nhanTag,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          mucDoUuTien: 'trungBinh',
          trangThai: trangThaiMacDinh,
          nhanTag: [],
        });
      }
    }
  }, [hienThi, congViecDangSua, trangThaiMacDinh, form]);

  const xuLyLuu = async () => {
    try {
      datDangXuLy(true);
      const giaTriForm = await form.validateFields();
      const duLieuCongViec: Omit<CongViec, 'maId' | 'ngayTao'> = {
        tenCongViec: giaTriForm.tenCongViec,
        moTa: giaTriForm.moTa,
        hanChot: giaTriForm.hanChot ? giaTriForm.hanChot.toISOString() : undefined,
        mucDoUuTien: giaTriForm.mucDoUuTien,
        trangThai: giaTriForm.trangThai,
        nhanTag: giaTriForm.nhanTag || [],
      };
      onLuu(duLieuCongViec);
      onDong();
    } catch (_err) {
      // lỗi validation form
    } finally {
      datDangXuLy(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={4}>
          {congViecDangSua ? '✏️ Chỉnh Sửa Công Việc' : '➕ Thêm Công Việc Mới'}
        </Title>
      }
      visible={hienThi}
      onCancel={onDong}
      footer={
        <Space>
          <Button onClick={onDong}>Hủy</Button>
          <Button type="primary" onClick={xuLyLuu} loading={dangXuLy}>
            {congViecDangSua ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
        </Space>
      }
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tenCongViec"
          label="Tên Công Việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        >
          <Input placeholder="Nhập tên công việc..." size="large" />
        </Form.Item>

        <Form.Item name="moTa" label="Mô Tả">
          <TextArea placeholder="Nhập mô tả chi tiết..." rows={3} />
        </Form.Item>

        <Form.Item name="hanChot" label="Hạn Chót">
          <DatePicker
            placeholder="Chọn ngày hạn chót"
            format="DD/MM/YYYY"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="mucDoUuTien"
          label="Mức Độ Ưu Tiên"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
        >
          <Select placeholder="Chọn mức độ ưu tiên" size="large">
            {(Object.keys(MAU_UU_TIEN) as MucDoUuTien[]).map((mucDo) => (
              <Select.Option key={mucDo} value={mucDo}>
                <Tag color={MAU_UU_TIEN[mucDo]}>{NHAN_UU_TIEN[mucDo]}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái" size="large">
            {(Object.keys(NHAN_TRANG_THAI) as TrangThaiCongViec[]).map((tt) => (
              <Select.Option key={tt} value={tt}>
                {NHAN_TRANG_THAI[tt]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="nhanTag" label="Nhãn / Tag">
          <Select
            mode="tags"
            placeholder="Nhập nhãn và nhấn Enter..."
            size="large"
            tokenSeparators={[',']}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCongViec;
