import { Tabs } from "antd";
import DoanSo from "./DoanSo";

const gameDoanSoPage = () => {
  return (
    <Tabs defaultActiveKey = "doan-so">
      <Tabs.TabPane tab="Đoán số" key="doan-so">
        <DoanSo />
      </Tabs.TabPane>
    </Tabs> 
  );
};

export default gameDoanSoPage;
