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

export default function App() {
  const [data, setData] = useState<string | null>(null);
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
      console.log('react response', res);

      const result = await res.json(); // JSON 데이터를 파싱
      setData(result.message); // 응답 메시지를 상태로 저장
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
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Exec</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell><Button>Exec</Button></TableCell>
            <TableCell className="text-right">$250.00</TableCell>
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
          {data && <p>{data}</p>}
        </div></></>
  )
}