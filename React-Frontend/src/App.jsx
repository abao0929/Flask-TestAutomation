import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocatorList from "./components/locatorManagement/LocatorList";
import PageList from "./components/locatorManagement/PageList";
import AppLayout from "./components/AppLayout"
import LocatorLayout from "./components/locatorManagement/locatorLayout";
import OperateLayout from "./components/operateProcess/OperateLayout"
import CustomOperateProcess from "./components/operateProcess/CustomOperateProcess"
import ProcessManagement from "./components/operateProcess/ProcessManagement"
import 'antd/dist/reset.css';
import { Layout } from "antd";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="locatormanagement" element={<LocatorLayout />}>
            <Route path="locators" element={<LocatorList />} />
            <Route path="pages" element={<PageList />} />
          </Route>
          <Route path="operateprocess" element={<OperateLayout />}>
            <Route path="customoperateprocess" element={<CustomOperateProcess />} />
            <Route path="processmanagement" element={<ProcessManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
