1. [데이터 수집 서버]를 만들기
   ・역할：장 종료 시점(EODHD API 갱신 시점)에 모든 티커에 대해 API를 실행하고, S3에 데이터를 저장하는 서버

   1. 모든 티커명.json(https://eodhd.com/api/exchange-symbol-list/{EXCHANGE_CODE}?delisted=1&api_token={YOUR_API_TOKEN}&fmt=json)
   2. 모든 티커의 펀더멘탈.json(https://eodhd.com/api/fundamentals/${symbol}.US?api_token=${apiKey}&fmt=json)
   3. 모든 티커의 종가.json(https://eodhd.com/api/eod/${symbol}.US?api_token=${apiKey}&fmt=json&limit=1)

2. (성능 관련)1의 json 파일을 서버->클라이언트로 보낼 때, Gzip으로 보내기(체감상 10mb->2mb정도가 됨)

3. 비동기 fetch + 로딩 스켈레톤

데이터 fetch 중에도 화면 틀, UI(검색창, 정렬탭, 헤더 등)만 먼저 보여주고
“데이터 로딩 중” 스켈레톤/프로그레스 UI로 체감 지연 최소화

4. 표 오른쪽에 "요약" 만들기, 요약의 기준을 여러가지 만들기
   예) 52주 최고가, 최근 거래량 많음 등등

5. 종가 데이터 취득 방식

   1. 매일 아침 5~6시(미장 종료 후), 모든 티커의 종가를 얻어오는 API를 실행한다.
   2. 결과를 JSON으로 S3에 저장하고, 이 값을 캐싱해서 화면에 뿌려준다.

6. 급등주 계산 로직

   1. 5일 누적 상승률 +20% 이상(개잡주도 필터링 되지만, 유저 판단에 맡긴다)

7. PRO Mode 도입
   1. 추가 필터링 지표 추가
   2. 지표 직접 입력 가능(원래는 박스 선택)
   3. 티커 감시 기능(즐겨찾기 기능)
