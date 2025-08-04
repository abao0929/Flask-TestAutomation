import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocatorList from "./components/LocatorList"; // 路径别写错

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 其他页面 */}
        <Route path="/locators" element={<LocatorList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
