import { Tabs } from "antd";
import OanTuTi from "./OanTuTi";

const GameDoanSoPage = () => {
  return (
    <Tabs defaultActiveKey="oan-tu-ti">
      <Tabs.TabPane tab="Oẳn tù tì" key="oan-tu-ti">
        <OanTuTi />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default GameDoanSoPage;
