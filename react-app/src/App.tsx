import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import './App.css'

interface StockResponse {
  id: number;
  ticker: string;
  regularMarketPrice: number | undefined;
  currency: string | undefined;
  [key: string]: unknown; // 추가적인 필드는 무시
}

export default function App() {
  const [datas, setDatas] = useState<StockResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/fetchData'); // Next.js API 호출
      if (!res.ok) {
        throw new Error('API 호출 실패');
      }
      const result = await res.json(); // JSON 데이터를 파싱
      if(result){
        console.log('result', result);
        console.log('datas.regularMarketPrice', result.data.regularMarketPrice);
        setDatas(result.data); // 응답 메시지를 상태로 저장
      } else {
        throw new Error('API 값 존재하지 않음');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <><div className='content'>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="w-[100px]">Ticker</TableHead>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead className="w-[100px]">Change</TableHead>
            <TableHead className="w-[100px]">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell className="font-medium">AAPL</TableCell>
            <TableCell className="font-medium">{datas ? datas.regularMarketPrice : '데이터 없음'}</TableCell>
            <TableCell className="font-medium">1</TableCell>
            <TableCell className="font-medium">1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div><><h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
        <div>
          <Button onClick={fetchData}>API 호출하기</Button>

          {loading && <p>로딩 중...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div></></>
  )
}