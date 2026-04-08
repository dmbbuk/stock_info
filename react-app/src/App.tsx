import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { useState } from "react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      <BrowserRouter>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex-1 px-4 py-3 w-full max-w-[1920px] mx-auto">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
