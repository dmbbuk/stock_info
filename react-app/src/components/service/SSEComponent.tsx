import { useEffect, useState } from 'react';
// import { FinnhubTrade } from '@/assets/type/type'

export default function SSEComponent() {
//   const [data, setData] = useState<FinnhubTrade[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // SSE 연결
    const eventSource = new EventSource('http://localhost:3001/api/stockWebSocketHandler'); // Next.js API 엔드포인트
    
    // SSE 연결 확인
    eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true);
      };

    // SSE 데이터 수신
    eventSource.onmessage = (event) => {
        console.log('aaa')
      try {
        console.log('event', event.data);
        console.log('event', event);
        // const message: FinnhubTrade = JSON.parse(event.data);
        // setData((prev) => [...prev, message]); // 수신 데이터 상태에 추가
        // console.log('Received data:', message); // 데이터 출력
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    // SSE 오류 처리
    eventSource.onerror = () => {
      console.error('SSE connection failed');
      setIsConnected(false);
      eventSource.close(); // 연결 종료
    };

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []); // 빈 배열로 의존성을 설정하여 한 번만 실행

  return (
    <div>
      <h1>Real-time Stock Data</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {/* <ul>
        {data.map((item, idx) => (
          <li key={idx}>
            Symbol: {item.s}, Price: {item.p}, Time: {new Date(item.t).toLocaleTimeString()}
          </li>
        ))}
      </ul> */}
    </div>
  );
}