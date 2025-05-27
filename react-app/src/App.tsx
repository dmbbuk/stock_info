// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
import "./App.css";
// import SSEComponent from '@/components/service/SSEComponent';
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="content">
      {/* <SSEComponent /> */}
      <h1>실시간 주식 데이터</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
