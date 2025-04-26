// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
import './App.css'
import SSEComponent from '@/components/service/SSEComponent';

export default function App() {
  // const [datas, setDatas] = useState<StockResponse | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  // const fetchData = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const res = await fetch('http://localhost:3001/api/fetchSseData'); // Next.js API 호출
  //     if (!res.ok) {
  //       throw new Error('API 호출 실패');
  //     }
  //     const result = await res.json(); // JSON 데이터를 파싱
  //     if(result){
  //       console.log('result', result);
  //       setDatas(result.data); // 응답 메시지를 상태로 저장
  //     } else {
  //       throw new Error('API 값 존재하지 않음');
  //     }
  //   } catch (err) {
  //     setError((err as Error).message);
  //   } finally {
  //     setLoading(false); // 로딩 상태 해제
  //   }
  // };

  return (
    <div className='content'>
      <SSEComponent />
    </div>
  )
}