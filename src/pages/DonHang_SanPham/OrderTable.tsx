import { Table, Button, Modal, Form,Input, Select, InputNumber, Space, message } from "antd";
import { useState, useEffect, useMemo } from "react";


type Status = "Chờ xử lý" | "Đang giao" | "Hoàn thành" | "Đã hủy";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    products: OrderItem[];
    totalAmount: number;
    status: Status;
    createdAt: string;
}

const PRODUCT_KEY = "products";
const ORDER_KEY = "orders";

const OrderTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState<Order | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [form] = Form.useForm();

    useEffect(() => {
        const p = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "[]");
        const o = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
        setProducts(p);
        setOrders(o);
    }, []);

    const totalAmount = useMemo(() => {
        return selectedProducts.reduce((sum, id) => {
            const p = products.find(pr => pr.id === id);
            const qty = quantities[id] || 0;
            return p ? sum + p.price * qty : sum;
        }, 0);
    }, [selectedProducts, quantities, products]);

    const generateOrderId = () => {
        if (orders.length === 0) return "DH001";
        const last = orders[orders.length - 1].id;
        const num = parseInt(last.replace("DH", ""), 10) + 1;
        return "DH" + num.toString().padStart(3, "0");
    };


        const createOrder = (value: any) => {
        const items: OrderItem[] = selectedProducts.map(id => {
            const p = products.find(pr => pr.id === id)!;
            const qty = quantities[id];

            if (!qty || qty <= 0) {
                throw new Error("Số lượng không hợp lệ");
            }
            if (qty > p.quantity) {
                throw new Error(`Số lượng ${p.name} vượt tồn kho`);
            }

            return {
                productId: p.id,
                productName: p.name,
                price: p.price,
                quantity: qty,
            };
        });

        const newOrder: Order = {
            id: generateOrderId(),
            customerName: value.customerName,
            phone: value.phone,
            address: value.address,
            products: items,
            totalAmount,
            status: "Chờ xử lý",
            createdAt: new Date().toISOString().slice(0, 10),
        };

        const newOrders = [...orders, newOrder];
        setOrders(newOrders);
        localStorage.setItem(ORDER_KEY, JSON.stringify(newOrders));

        setOpen(false);
        form.resetFields();
        setSelectedProducts([]);
        setQuantities({});
        message.success("Tạo đơn hàng thành công");
    };

    const updateStatus = (order: Order, status: Status) => {
        const newOrders = orders.map(o => {
            if (o.id !== order.id) return o;

            let newProducts = [...products];

            if (status === "Hoàn thành" && o.status !== "Hoàn thành") {
                newProducts = newProducts.map(p => {
                    const item = o.products.find(i => i.productId === p.id);
                    return item ? { ...p, quantity: p.quantity - item.quantity } : p;
                });
            }

            if (status === "Đã hủy" && o.status === "Hoàn thành") {
                newProducts = newProducts.map(p => {
                    const item = o.products.find(i => i.productId === p.id);
                    return item ? { ...p, quantity: p.quantity + item.quantity } : p;
                });
            }

            localStorage.setItem(PRODUCT_KEY, JSON.stringify(newProducts));
            setProducts(newProducts);

            return { ...o, status };
        });

        setOrders(newOrders);
        localStorage.setItem(ORDER_KEY, JSON.stringify(newOrders));
    };



    const columns = [
        { title: "Mã Đơn Hàng", dataIndex: "id", key: "id", align: 'center' as 'center' },
        { title: "Tên Khách Hàng", dataIndex: "customerName", key: "customerName", align: 'center' as 'center' },
        { title: "Số Sản Phẩm", render: (_: any, r: Order) => r.products.length, align: 'center' as 'center' },
        { title: "Tổng Tiền", dataIndex: "totalAmount", key: "totalAmount", render: (totalAmount: number) => totalAmount.toLocaleString("vi-VN", {style: "currency", currency: "VND"}), align: 'center' as 'center' },
        { title: "Trạng Thái", dataIndex: "status", render: (s: Status, r: Order) => (
                <Select value={s} onChange={v => updateStatus(r, v)}>
                    <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
                    <Select.Option value="Đang giao">Đang giao</Select.Option>
                    <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                    <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                </Select>
            ),
             align: 'center' as 'center' 
        },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", align: 'center' as 'center' },
        {
            title: "Thao tác",
            render: (_: any, r: Order) => (
                <Button onClick={() => setDetail(r)}>Chi tiết</Button>
            ),
            align: 'center' as 'center'
        },
    ];

    return (
    <>
            <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>Tạo đơn hàng</Button>
            <Table rowKey="id" columns={columns} dataSource={orders} pagination={{ pageSize: 5 }} />

            
            <Modal title="Tạo đơn hàng" visible={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={createOrder}>
                    <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }, { pattern: /^\d{10,11}$/, message: "SĐT không hợp lệ" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Sản phẩm">
                        <Select mode="multiple" value={selectedProducts} onChange={setSelectedProducts}>
                            {products.map(p => <Select.Option key={p.id} value={p.id}>{p.name} (Kho: {p.quantity})</Select.Option>)}
                        </Select>
                    </Form.Item>
                    {selectedProducts.map(id => {
                        const p = products.find(pr => pr.id === id)!;
                        return (
                            <Space key={id} style={{ display: "flex", marginBottom: 8 }}>
                                <span>{p.name}</span>
                                <InputNumber min={1} max={p.quantity} value={quantities[id] || undefined} onChange={v => setQuantities(prev => ({ ...prev, [id]: v || 0 }))} />
                            </Space>
                        );
                    })}
                    <h3>Tổng tiền: {totalAmount.toLocaleString("vi-VN")} ₫</h3>
                </Form>
            </Modal>

            {/* Modal chi tiết */}
            <Modal visible={!!detail} footer={null} onCancel={() => setDetail(null)} title="Chi tiết đơn hàng">
                {detail && <>
                    <p><b>Khách hàng:</b> {detail.customerName}</p>
                    <p><b>SĐT:</b> {detail.phone}</p>
                    <p><b>Địa chỉ:</b> {detail.address}</p>
                    <p><b>Sản phẩm:</b></p>
                    {detail.products.map(p => <p key={p.productId}>{p.productName} × {p.quantity} = {(p.price * p.quantity).toLocaleString("vi-VN")} ₫</p>)}
                    <h3>Tổng: {detail.totalAmount.toLocaleString("vi-VN")} ₫</h3>
                </>}
            </Modal>
        </> 
    );
};    

export default OrderTable;