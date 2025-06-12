import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white">
      <BrowserRouter>
        <main className="max-w-screen-xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">실시간 주식 데이터</h1>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
