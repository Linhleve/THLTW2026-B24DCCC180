import { Tabs } from "antd";
import OrderProduct from "./OrderTable";
import ProductTable from "./ProductTable";
const DonHangSanPhamPage = () => {
  return (
    <Tabs defaultActiveKey = "products">
      <Tabs.TabPane tab="Quản lý Sản phẩm" key="products">
        <ProductTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Quản lý Đơn hàng" key="orders">
        <OrderProduct />
      </Tabs.TabPane>
    </Tabs> 
  );
};

export default DonHangSanPhamPage;
