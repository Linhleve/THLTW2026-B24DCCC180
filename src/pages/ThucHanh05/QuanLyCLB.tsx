import React, { useState, useMemo } from 'react'
import moment from 'moment'
import { Table, Button, Modal, Form, Input, Select, DatePicker, Upload, Popconfirm, Tabs, Row, Col, Statistic, Space, message, Avatar } from 'antd'
import type { ColumnsType } from 'antd'
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
// Dùng react-apexcharts thay vì @ant-design/plots để tương thích React 17
import Chart from 'react-apexcharts'

type CLB = {
	id: string
	ten: string
	ngayThanhLap?: string
	moTa?: string
	chuNhiem?: string
	hoatDong?: boolean
	anh?: string
}

type DonDangKy = {
	id: string
	hoTen: string
	email?: string
	sdt?: string
	gioiTinh?: string
	diaChi?: string
	soTruong?: string
	clbId?: string
	lyDo?: string
	trangThai: 'Pending' | 'Approved' | 'Rejected'
	ghiChuTuChoi?: string
}

type ThanhVien = {
	id: string
	hoTen: string
	email?: string
	sdt?: string
	clbId?: string
}

const { TabPane } = Tabs
const { TextArea } = Input

export default function QuanLyCLB() {
	// Dữ liệu mẫu (mock)
	const [danhSachClb, setDanhSachClb] = useState<CLB[]>([
		{ id: 'clb1', ten: 'CLB Bóng Đá', ngayThanhLap: '2020-09-01', moTa: '<p>CLB bóng đá</p>', chuNhiem: 'Nguyễn A', hoatDong: true },
		{ id: 'clb2', ten: 'CLB Robotics', ngayThanhLap: '2019-03-15', moTa: '<p>Robotics</p>', chuNhiem: 'Trần B', hoatDong: true },
	])

	const [danhSachDon, setDanhSachDon] = useState<DonDangKy[]>([
		{ id: 'd1', hoTen: 'Lê Văn C', email: 'c@example.com', sdt: '0900123456', gioiTinh: 'Nam', diaChi: 'Hà Nội', soTruong: 'Lập trình', clbId: 'clb2', lyDo: 'Yêu thích robotics', trangThai: 'Pending' },
		{ id: 'd2', hoTen: 'Phạm Thị D', email: 'd@example.com', sdt: '0900654321', gioiTinh: 'Nữ', diaChi: 'HCM', soTruong: 'Thiết kế', clbId: 'clb1', lyDo: 'Muốn chơi bóng', trangThai: 'Approved' },
	])

	const [danhSachThanhVien, setDanhSachThanhVien] = useState<ThanhVien[]>([
		{ id: 't1', hoTen: 'Phạm Thị D', email: 'd@example.com', sdt: '0900654321', clbId: 'clb1' },
	])

	// Modal và form state
	const [hienThiModalClb, setHienThiModalClb] = useState(false)
	const [clbHienTai, setClbHienTai] = useState<CLB | null>(null)
	const [formClb] = Form.useForm()
	const [previewAnh, setPreviewAnh] = useState<string | undefined>(undefined)
	const [anhThatBai, setAnhThatBai] = useState<Record<string, boolean>>({})

	const [hienThiModalDon, setHienThiModalDon] = useState(false)
	const [donHienTai, setDonHienTai] = useState<DonDangKy | null>(null)
	const [formDon] = Form.useForm()
	const [xemOnlyDon, setXemOnlyDon] = useState(false)

	const [chonDong, setChonDong] = useState<string[]>([])

	const [hienThiModalTuChoi, setHienThiModalTuChoi] = useState(false)
	const [lyDoTuChoi, setLyDoTuChoi] = useState('')

	const [hienThiLichSu, setHienThiLichSu] = useState(false)
	const [lichSuThaoTac, setLichSuThaoTac] = useState<string[]>([])

	const [hienThiModalChuyenCLB, setHienThiModalChuyenCLB] = useState(false)
	const [clbDichId, setClbDichId] = useState<string | undefined>(undefined)
	const [timKiemThanhVien, setTimKiemThanhVien] = useState('')
	// Modal đổi CLB cho từng thành viên
	const [hienThiModalDoiCLBSingle, setHienThiModalDoiCLBSingle] = useState(false)
	const [tvDoi, setTvDoi] = useState<ThanhVien | null>(null)
	const [clbDichSingle, setClbDichSingle] = useState<string | undefined>(undefined)

	// Columns cho bảng CLB
	const cotClb: ColumnsType<CLB> = [
		{ title: 'Ảnh', dataIndex: 'anh', key: 'anh', align: 'center', render: (val: any, record: CLB) => {
			const src = val || record.anh
			const failed = anhThatBai[record.id]
			const initials = (record.ten || '').split(' ').map(w => w[0]).slice(0,2).join('') || 'CL'
			return (
				<div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					{src && !failed ? (
						<img src={src} alt={record.ten} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} onError={() => setAnhThatBai(prev => ({ ...prev, [record.id]: true }))} />
					) : (
						<Avatar shape="square" size={60}>{initials}</Avatar>
					)}
				</div>
			)
		} },
		{ title: 'Tên CLB', dataIndex: 'ten', key: 'ten', align: 'center', sorter: (a: CLB, b: CLB) => a.ten.localeCompare(b.ten) },
		{ title: 'Ngày thành lập', dataIndex: 'ngayThanhLap', key: 'ngayThanhLap', align: 'center', sorter: (a: CLB, b: CLB) => (a.ngayThanhLap || '').localeCompare(b.ngayThanhLap || '') },
		{ title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', align: 'center', render: (val: any) => <div dangerouslySetInnerHTML={{ __html: val || '' }} /> },
		{ title: 'Chủ nhiệm', dataIndex: 'chuNhiem', key: 'chuNhiem', align: 'center' },
		{ title: 'Hoạt động', dataIndex: 'hoatDong', key: 'hoatDong', align: 'center', render: (val: boolean) => (val ? 'Có' : 'Không') },
		{
			title: 'Thao tác', key: 'actions', align: 'center', render: (_: any, record: CLB) => (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Space>
						<Button icon={<EyeOutlined />} onClick={() => xuLyXemThanhVien(record)}>Xem TV</Button>
						<Button icon={<EditOutlined />} onClick={() => xuLyMoModalClb(record)}>Sửa</Button>
						<Popconfirm title="Xóa CLB?" onConfirm={() => xuLyXoaClb(record.id)}>
							<Button icon={<DeleteOutlined />} danger> Xóa </Button>
						</Popconfirm>
					</Space>
				</div>
			)
		}
	]

	// Columns cho đơn đăng ký
	const cotDon: ColumnsType<DonDangKy> = [
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen', align: 'center', sorter: (a: DonDangKy, b: DonDangKy) => a.hoTen.localeCompare(b.hoTen) },
		{ title: 'Email', dataIndex: 'email', key: 'email', align: 'center' },
		{ title: 'SĐT', dataIndex: 'sdt', key: 'sdt', align: 'center' },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh', align: 'center' },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi', align: 'center' },
		{ title: 'Sở trường', dataIndex: 'soTruong', key: 'soTruong', align: 'center' },
		{ title: 'Câu lạc bộ', dataIndex: 'clbId', key: 'clbId', align: 'center', render: (val: string) => danhSachClb.find(c => c.id === val)?.ten || '' },
		{ title: 'Lý do', dataIndex: 'lyDo', key: 'lyDo', align: 'center' },
		{ title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', align: 'center' },
		{ title: 'Ghi chú', dataIndex: 'ghiChuTuChoi', key: 'ghiChuTuChoi', align: 'center' },
		{
			title: 'Thao tác', key: 'actions', render: (_: any, record: DonDangKy) => (
					<Space>
						<Button onClick={() => xuLyXemDon(record)}>Xem</Button>
						<Button onClick={() => xuLyMoModalDon(record)}>Sửa</Button>
					<Popconfirm title="Xóa đơn?" onConfirm={() => xuLyXoaDon(record.id)}>
						<Button danger> Xóa </Button>
					</Popconfirm>
					<Button type="primary" onClick={() => xuLyDuyetDon(record.id)}>Duyệt</Button>
					<Button danger onClick={() => xuLyMoModalTuChoi(record.id)}>Từ chối</Button>
				</Space>
			)
		}
	]

	// Columns cho thành viên
	const cotThanhVien: ColumnsType<ThanhVien> = [
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen', align: 'center' },
		{ title: 'Email', dataIndex: 'email', key: 'email', align: 'center' },
		{ title: 'SĐT', dataIndex: 'sdt', key: 'sdt', align: 'center' },
		{ title: 'Câu lạc bộ', dataIndex: 'clbId', key: 'clbId', align: 'center', render: (val: string) => danhSachClb.find(c => c.id === val)?.ten || '' },
		{ title: 'Thao tác', key: 'actions', align: 'center', render: (_: any, record: ThanhVien) => (
			<Space>
				<Button onClick={() => { setTvDoi(record); setClbDichSingle(record.clbId); setHienThiModalDoiCLBSingle(true) }}>Đổi CLB</Button>
			</Space>
		) },
	]

	// Xử lý CLB
	function xuLyMoModalClb(clb?: CLB) {
		setClbHienTai(clb || null)
		if (clb) {
			formClb.setFieldsValue({ ...clb, ngayThanhLap: clb.ngayThanhLap ? moment(clb.ngayThanhLap) : undefined })
			setPreviewAnh(clb.anh)
		} else {
			formClb.resetFields()
			setPreviewAnh(undefined)
		}
		setHienThiModalClb(true)
	}

	function handleUploadChange(info: any) {
		const file = info.file && (info.file.originFileObj || info.file)
		if (!file) return
		const reader = new FileReader()
		reader.onload = e => {
			const result = e.target?.result as string
			setPreviewAnh(result)
			formClb.setFieldsValue({ anh: result })
		}
		reader.readAsDataURL(file)
	}

	function beforeUploadFile(file: File) {
		const reader = new FileReader()
		reader.onload = e => {
			const result = e.target?.result as string
			setPreviewAnh(result)
			formClb.setFieldsValue({ anh: result })
		}
		reader.readAsDataURL(file)
		// returning false prevents upload; we handle file locally
		return false
	}

	function handleRemoveUpload() {
		setPreviewAnh(undefined)
		formClb.setFieldsValue({ anh: undefined })
	}

	function xuLyLuuClb() {
		formClb.validateFields().then(values => {
			// Xử lý giá trị trước khi lưu: chuyển moment -> string và ảnh
			const processed: any = { ...values }
			if (values.ngayThanhLap && values.ngayThanhLap.format) processed.ngayThanhLap = values.ngayThanhLap.format('YYYY-MM-DD')
			processed.anh = values.anh || previewAnh
			if (clbHienTai) {
				setDanhSachClb(prev => prev.map(p => p.id === clbHienTai.id ? { ...p, ...processed } : p))
				setLichSuThaoTac(prev => [`Admin đã chỉnh sửa CLB ${clbHienTai.ten} vào lúc ${new Date().toLocaleString()}`, ...prev])
				// reset lỗi ảnh nếu có
				setAnhThatBai(prev => ({ ...prev, [clbHienTai.id]: false }))
			} else {
				const moi: CLB = { id: `clb${Date.now()}`, ...processed }
				setDanhSachClb(prev => [moi, ...prev])
				setLichSuThaoTac(prev => [`Admin đã thêm CLB ${moi.ten} vào lúc ${new Date().toLocaleString()}`, ...prev])
				setAnhThatBai(prev => ({ ...prev, [moi.id]: false }))
			}
			setHienThiModalClb(false)
			// reset preview
			setPreviewAnh(undefined)
		})
	}

	function xuLyXoaClb(id: string) {
		setDanhSachClb(prev => prev.filter(p => p.id !== id))
		message.success('Xóa CLB thành công')
	}

	// Xử lý đơn đăng ký

	function xuLyMoModalDon(don?: DonDangKy) {
		// Mở modal để thêm hoặc sửa
		setXemOnlyDon(false)
		setDonHienTai(don || null)
		if (don) formDon.setFieldsValue(don)
		else formDon.resetFields()
		setHienThiModalDon(true)
	}

	function xuLyXemDon(don: DonDangKy) {
		// Mở modal chỉ xem
		setXemOnlyDon(true)
		setDonHienTai(don)
		formDon.setFieldsValue(don)
		setHienThiModalDon(true)
	}

	function xuLyLuuDon() {
		formDon.validateFields().then(values => {
			if (donHienTai) {
				setDanhSachDon(prev => prev.map(p => p.id === donHienTai.id ? { ...p, ...values } : p))
			} else {
				const moi: DonDangKy = { id: `d${Date.now()}`, trangThai: 'Pending', ...values }
				setDanhSachDon(prev => [moi, ...prev])
			}
			setHienThiModalDon(false)
		})
	}

	function xuLyXoaDon(id: string) {
		setDanhSachDon(prev => prev.filter(p => p.id !== id))
		message.success('Xóa đơn thành công')
	}

	function xuLyDuyetDon(id: string) {
		const don = danhSachDon.find(d => d.id === id)
		if (!don) return message.error('Không tìm thấy đơn')
		// Thêm thành viên nếu chưa có
		setDanhSachThanhVien(prev => {
			const exists = don.email ? prev.find(tv => tv.email === don.email) : undefined
			if (exists) return prev
			const moiTV: ThanhVien = { id: `tv${Date.now()}${Math.random()}`, hoTen: don.hoTen, email: don.email, sdt: don.sdt, clbId: don.clbId }
			return [moiTV, ...prev]
		})
		// Cập nhật trạng thái đơn thành Approved (không xóa)
		setDanhSachDon(prev => prev.map(p => p.id === id ? { ...p, trangThai: 'Approved' } : p))
		setLichSuThaoTac(prev => [`Admin đã Approved đơn ${id} vào lúc ${new Date().toLocaleString()}`, ...prev])
		message.success('Đã duyệt đơn')
	}

	function xuLyDuyetNhieuDon() {
		if (chonDong.length === 0) return message.warning('Chưa chọn đơn')
		const donsDuocDuyet = danhSachDon.filter(d => chonDong.includes(d.id))
		// Thêm thành viên từ các đơn được chọn
		setDanhSachThanhVien(prev => {
			const next = [...prev]
			donsDuocDuyet.forEach(don => {
				if (!don.email) return
				const exists = next.find(tv => tv.email === don.email)
				if (!exists) next.unshift({ id: `tv${Date.now()}${Math.random()}`, hoTen: don.hoTen, email: don.email, sdt: don.sdt, clbId: don.clbId })
			})
			return next
		})
		// Cập nhật trạng thái các đơn đã chọn thành Approved
		setDanhSachDon(prev => prev.map(p => chonDong.includes(p.id) ? { ...p, trangThai: 'Approved' } : p))
		setLichSuThaoTac(prev => [`Admin đã Approved ${chonDong.join(', ')} vào lúc ${new Date().toLocaleString()}`, ...prev])
		setChonDong([])
		message.success('Đã duyệt các đơn đã chọn')
	}

	function xuLyMoModalTuChoi(id?: string) {
		if (id) setChonDong([id])
		setHienThiModalTuChoi(true)
	}

	function xuLyXacNhanTuChoi() {
		if (!lyDoTuChoi) { message.error('Vui lòng nhập lý do từ chối'); return }
		// Cập nhật trạng thái các đơn đã bị từ chối
		setDanhSachDon(prev => prev.map(p => chonDong.includes(p.id) ? { ...p, trangThai: 'Rejected', ghiChuTuChoi: lyDoTuChoi } : p))
		setLichSuThaoTac(prev => [`Admin đã Rejected ${chonDong.join(', ')} vào lúc ${new Date().toLocaleString()} với lý do: ${lyDoTuChoi}`, ...prev])
		setHienThiModalTuChoi(false)
		setLyDoTuChoi('')
		setChonDong([])
		message.success('Đã từ chối các đơn đã chọn')
	}

	// Xử lý xem danh sách thành viên của CLB
	function xuLyXemThanhVien(clb: CLB) {
		// Lọc thành viên theo clb.id
		const thanhVienTheoClb = danhSachThanhVien.filter(tv => tv.clbId === clb.id)
		Modal.info({ title: `Thành viên của ${clb.ten}`, content: (<div>{thanhVienTheoClb.map(tv => <div key={tv.id}>{tv.hoTen} - {tv.email}</div>)}</div>) })
	}

	// Bulk chuyển CLB cho thành viên
	function xuLyMoModalChuyenCLB() {
		if (chonDong.length === 0) return message.warning('Chưa chọn thành viên')
		setHienThiModalChuyenCLB(true)
	}

	function xuLyXacNhanChuyenCLB() {
		if (!clbDichId) return message.error('Chưa chọn CLB đích')
		setDanhSachThanhVien(prev => prev.map(tv => chonDong.includes(tv.id) ? { ...tv, clbId: clbDichId } : tv))
		setLichSuThaoTac(prev => [`Admin đã chuyển ${chonDong.length} thành viên sang ${clbDichId} vào lúc ${new Date().toLocaleString()}`, ...prev])
		setHienThiModalChuyenCLB(false)
		setChonDong([])
	}

	function xuLyXacNhanDoiClbSingle() {
		if (!tvDoi) return message.error('Không có thành viên để đổi')
		if (!clbDichSingle) return message.error('Chưa chọn CLB đích')
		setDanhSachThanhVien(prev => prev.map(tv => tv.id === tvDoi.id ? { ...tv, clbId: clbDichSingle } : tv))
		setLichSuThaoTac(prev => [`Admin đã chuyển ${tvDoi.hoTen} từ ${tvDoi.clbId} sang ${clbDichSingle} vào lúc ${new Date().toLocaleString()}`, ...prev])
		setHienThiModalDoiCLBSingle(false)
		setTvDoi(null)
		setClbDichSingle(undefined)
		message.success('Đã chuyển CLB cho thành viên')
	}

	// Dữ liệu báo cáo
	const soLuong = useMemo(() => ({
		tongClb: danhSachClb.length,
		pending: danhSachDon.filter(d => d.trangThai === 'Pending').length,
		approved: danhSachDon.filter(d => d.trangThai === 'Approved').length,
		rejected: danhSachDon.filter(d => d.trangThai === 'Rejected').length,
	}), [danhSachClb, danhSachDon])

	// Chuẩn bị dữ liệu cho biểu đồ bằng react-apexcharts
	const chartCategories = useMemo(() => danhSachClb.map(c => c.ten), [danhSachClb])

	const chartSeries = useMemo(() => {
		const pending = danhSachClb.map(c => danhSachDon.filter(d => d.clbId === c.id && d.trangThai === 'Pending').length)
		const approved = danhSachClb.map(c => danhSachDon.filter(d => d.clbId === c.id && d.trangThai === 'Approved').length)
		const rejected = danhSachClb.map(c => danhSachDon.filter(d => d.clbId === c.id && d.trangThai === 'Rejected').length)
		const members = danhSachClb.map(c => danhSachThanhVien.filter(tv => tv.clbId === c.id).length)
		return [
			{ name: 'Pending', data: pending },
			{ name: 'Approved', data: approved },
			{ name: 'Rejected', data: rejected },
			{ name: 'Thành viên', data: members },
		]
	}, [danhSachClb, danhSachDon, danhSachThanhVien])

	const chartOptions = useMemo(() => ({
		chart: { type: 'bar', stacked: true },
		colors: ['#f39c12', '#27ae60', '#e74c3c', '#3498db'],
		plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
		dataLabels: { enabled: false },
		stroke: { show: true, width: 1, colors: ['#fff'] },
		xaxis: { categories: chartCategories },
		yaxis: { title: { text: 'Số lượng' } },
		tooltip: { shared: true, intersect: false, y: { formatter: (val: any) => `${val}` } },
		legend: { position: 'top' },
		responsive: [{ breakpoint: 600, options: { plotOptions: { bar: { columnWidth: '70%' } }, legend: { position: 'bottom' } } }]
	}), [chartCategories])

	// Dữ liệu tóm tắt báo cáo theo CLB
	const reportData = useMemo(() => {
		return danhSachClb.map(c => {
			const pending = danhSachDon.filter(d => d.clbId === c.id && d.trangThai === 'Pending').length
			const approved = danhSachDon.filter(d => d.clbId === c.id && d.trangThai === 'Approved').length
			const rejected = danhSachDon.filter(d => d.clbId === c.id && d.trangThai === 'Rejected').length
			const members = danhSachThanhVien.filter(tv => tv.clbId === c.id).length
			return { key: c.id, clb: c.ten, pending, approved, rejected, members, total: pending + approved + rejected }
		})
	}, [danhSachClb, danhSachDon, danhSachThanhVien])

	const cotBaoCao: ColumnsType<any> = [
		{ title: 'Câu lạc bộ', dataIndex: 'clb', key: 'clb', align: 'center' },
		{ title: 'Pending', dataIndex: 'pending', key: 'pending', align: 'center' },
		{ title: 'Approved', dataIndex: 'approved', key: 'approved', align: 'center' },
		{ title: 'Rejected', dataIndex: 'rejected', key: 'rejected', align: 'center' },
		{ title: 'Thành viên', dataIndex: 'members', key: 'members', align: 'center' },
		{ title: 'Tổng đơn', dataIndex: 'total', key: 'total', align: 'center' },
	]

	return (
		<div style={{ padding: 16 }}>
			<Tabs defaultActiveKey="1">
				<TabPane tab="Danh sách CLB" key="1">
					<Space style={{ marginBottom: 12 }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => xuLyMoModalClb()}>Thêm CLB</Button>
						<Button onClick={() => setHienThiLichSu(true)}>Xem Lịch Sử Thao Tác</Button>
					</Space>
					<Table rowKey="id" columns={cotClb} dataSource={danhSachClb} />
				</TabPane>
				<TabPane tab="Quản lý đơn đăng ký" key="2">
					<Space style={{ marginBottom: 12 }}>
						<Button type="primary" onClick={() => xuLyMoModalDon()}>Thêm đơn</Button>
						<Button onClick={() => xuLyDuyetNhieuDon()}>Duyệt {chonDong.length} đơn đã chọn</Button>
						<Button danger onClick={() => xuLyMoModalTuChoi()}>Từ chối {chonDong.length} đơn đã chọn</Button>
						<Button onClick={() => setHienThiLichSu(true)}>Xem Lịch Sử</Button>
					</Space>
					<Table rowKey="id" rowSelection={{ onChange: (selectedRowKeys: React.Key[]) => setChonDong(selectedRowKeys as string[]) }} columns={cotDon} dataSource={danhSachDon.filter(d => d.trangThai === 'Pending')} />
				</TabPane>
				<TabPane tab="Quản lý thành viên" key="3">
					<Space style={{ marginBottom: 12 }}>
						<Button onClick={xuLyMoModalChuyenCLB}>Chuyển CLB cho {chonDong.length} TV</Button>
						<Button onClick={() => setHienThiLichSu(true)}>Xem Lịch Sử</Button>
						<Input.Search placeholder="Tìm theo tên, email hoặc SĐT" allowClear onSearch={v => setTimKiemThanhVien(v)} onChange={e => setTimKiemThanhVien(e.target.value)} style={{ width: 320 }} />
					</Space>
					<Table rowKey="id" rowSelection={{ onChange: (selectedRowKeys: React.Key[]) => setChonDong(selectedRowKeys as string[]) }} columns={cotThanhVien} dataSource={useMemo(() => {
						const q = timKiemThanhVien.trim().toLowerCase()
						if (!q) return danhSachThanhVien
						return danhSachThanhVien.filter(tv => (tv.hoTen || '').toLowerCase().includes(q) || (tv.email || '').toLowerCase().includes(q) || (tv.sdt || '').toLowerCase().includes(q))
					}, [danhSachThanhVien, timKiemThanhVien])} />
				</TabPane>
		
				<TabPane tab="Báo cáo & Thống kê" key="4">
					<Row gutter={16} style={{ marginBottom: 12 }}>
						<Col span={6}><Statistic title="Số CLB" value={soLuong.tongClb} /></Col>
						<Col span={6}><Statistic title="Tổng đơn" value={danhSachDon.length} /></Col>
						<Col span={6}><Statistic title="Đã duyệt" value={soLuong.approved} /></Col>
						<Col span={6}><Statistic title="Tổng thành viên" value={danhSachThanhVien.length} /></Col>
					</Row>
					<div style={{ background: '#fff', padding: 12 }}>
						<Chart key={JSON.stringify(chartSeries)} options={chartOptions} series={chartSeries} type="bar" height={320} />
						<div style={{ marginTop: 16 }}>
							<Table columns={cotBaoCao} dataSource={reportData} pagination={false} size="small" />
						</div>

					</div>
				</TabPane>
			</Tabs>

			{/* Modal thêm/sửa CLB */}
			<Modal title={clbHienTai ? 'Sửa CLB' : 'Thêm CLB'} visible={hienThiModalClb} onCancel={() => setHienThiModalClb(false)} onOk={xuLyLuuClb}>
				<Form form={formClb} layout="vertical">
					<Form.Item name="ten" label="Tên CLB" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}><Input /></Form.Item>
					<Form.Item name="ngayThanhLap" label="Ngày thành lập"><DatePicker style={{ width: '100%' }} /></Form.Item>
					<Form.Item name="moTa" label="Mô tả (HTML)"><TextArea rows={4} /></Form.Item>
					<Form.Item name="chuNhiem" label="Chủ nhiệm"><Input /></Form.Item>
					<Form.Item name="hoatDong" label="Hoạt động"><Select><Select.Option value={true}>Có</Select.Option><Select.Option value={false}>Không</Select.Option></Select></Form.Item>
					<Form.Item label="Ảnh đại diện">
						<Upload accept="image/*" listType="picture" beforeUpload={beforeUploadFile} onRemove={handleRemoveUpload} maxCount={1} showUploadList={false}>
							<Button icon={<UploadOutlined />}>Tải ảnh</Button>
						</Upload>
						{previewAnh ? <div style={{ marginTop: 8 }}><Avatar shape="square" src={previewAnh} size={120} /></div> : null}
						<Form.Item name="anh" noStyle hidden>
							<Input />
						</Form.Item>
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal đơn */}
			<Modal
				title={donHienTai ? 'Chi tiết đơn' : 'Thêm đơn'}
				visible={hienThiModalDon}
				onCancel={() => setHienThiModalDon(false)}
				onOk={xemOnlyDon ? undefined : xuLyLuuDon}
				width={800}
				footer={xemOnlyDon ? [<Button key="close" onClick={() => setHienThiModalDon(false)}>Đóng</Button>] : undefined}
			>
				<Form form={formDon} layout="vertical">
					<Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}><Input disabled={xemOnlyDon} /></Form.Item>
					<Form.Item name="email" label="Email"><Input disabled={xemOnlyDon} /></Form.Item>
					<Form.Item name="sdt" label="SĐT"><Input disabled={xemOnlyDon} /></Form.Item>
					<Form.Item name="gioiTinh" label="Giới tính"><Select disabled={xemOnlyDon}><Select.Option value="Nam">Nam</Select.Option><Select.Option value="Nữ">Nữ</Select.Option></Select></Form.Item>
					<Form.Item name="diaChi" label="Địa chỉ"><Input disabled={xemOnlyDon} /></Form.Item>
					<Form.Item name="soTruong" label="Sở trường"><Input disabled={xemOnlyDon} /></Form.Item>
					<Form.Item name="clbId" label="Câu lạc bộ"><Select disabled={xemOnlyDon} allowClear>{danhSachClb.map(c => <Select.Option key={c.id} value={c.id}>{c.ten}</Select.Option>)}</Select></Form.Item>
					<Form.Item name="lyDo" label="Lý do đăng ký"><TextArea rows={3} disabled={xemOnlyDon} /></Form.Item>
				</Form>
			</Modal>

			{/* Modal từ chối với lý do */}
			<Modal title="Từ chối đơn" visible={hienThiModalTuChoi} onCancel={() => setHienThiModalTuChoi(false)} onOk={xuLyXacNhanTuChoi}>
				<Form layout="vertical">
					<Form.Item label={`Từ chối ${chonDong.length} đơn`}>
						<TextArea value={lyDoTuChoi} onChange={e => setLyDoTuChoi(e.target.value)} rows={4} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal chuyển CLB */}
			<Modal title="Chuyển CLB" visible={hienThiModalChuyenCLB} onCancel={() => setHienThiModalChuyenCLB(false)} onOk={xuLyXacNhanChuyenCLB}>
				<p>Chuyển {chonDong.length} thành viên sang:</p>
				<Select style={{ width: '100%' }} value={clbDichId} onChange={v => setClbDichId(v)}>
					{danhSachClb.map(c => <Select.Option key={c.id} value={c.id}>{c.ten}</Select.Option>)}
				</Select>
			</Modal>

			{/* Modal đổi CLB cho từng thành viên */}
			<Modal title={tvDoi ? `Đổi CLB cho ${tvDoi.hoTen}` : 'Đổi CLB'} visible={hienThiModalDoiCLBSingle} onCancel={() => setHienThiModalDoiCLBSingle(false)} onOk={xuLyXacNhanDoiClbSingle}>
				<p>Chuyển thành viên sang CLB:</p>
				<Select style={{ width: '100%' }} value={clbDichSingle} onChange={v => setClbDichSingle(v)}>
					{danhSachClb.map(c => <Select.Option key={c.id} value={c.id}>{c.ten}</Select.Option>)}
				</Select>
			</Modal>

			{/* Modal lịch sử thao tác */}
			<Modal title="Lịch sử thao tác" visible={hienThiLichSu} onCancel={() => setHienThiLichSu(false)} footer={<Button onClick={() => setHienThiLichSu(false)}>Đóng</Button>}>
				<div>
					{lichSuThaoTac.length === 0 ? <div>Chưa có lịch sử</div> : lichSuThaoTac.map((l, idx) => <div key={idx}>{l}</div>)}
				</div>
			</Modal>
		</div>
	)
}

