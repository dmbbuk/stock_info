import { useState } from 'react';

export default function FetchDataButton() {
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
    <div>
      <button onClick={fetchData}>API 호출하기</button>
      
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>{data}</p>}
    </div>
  );
}
