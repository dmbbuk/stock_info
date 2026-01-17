import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { useState } from "react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col">
      <BrowserRouter>
        {/* PC 중심 설정: 일반 min-h-screen 사용, 여백도 데스크탑 기준으로 고정 */}
        <div className="w-full px-6 py-8 flex-1 max-w-[1920px] mx-auto min-h-screen flex flex-col">
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} />} />
              </Routes>
            </div>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
