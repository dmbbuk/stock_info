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

8. 서비스 후 이야기지만, 스크리너 적용 주식을 전부 구매해서 누가 수익을 가장 내는지 대회를 연다. 그래서 1등한 필터를 공식 적용한다던지도 가능하다.

9. [데이터 최적화] JSON 경량화 및 페이지네이션
   - 이슈: 전 종목(약 10,000개) 통합 JSON 사용 시 파일 용량이 커져 로딩 속도 저하 및 메모리 부족 가능성.
   - 계획:
     - 파이썬 스크립트에서 불필요한 필드는 제거하고 핵심 데이터만 남기는 Minify 과정 추가.
     - 필요 시 `page_1.json`, `page_2.json` 등으로 정적 파일을 분할하거나, 클라이언트 요구 시점에 잘라주는 전처리 로직 고려.

10. [검색 성능] 대량 데이터 검색 최적화
    - 이슈: 단순 문자열 매칭으로는 수만 개 데이터 검색 시 UI 멈춤(Freezing)이나 불편한 경험 발생.
    - 계획:
      - `Fuse.js` 같은 클라이언트 사이드 퍼지(Fuzzy) 검색 라이브러리 도입 검토.
      - 티커/회사명 검색 시 오타 보정 및 가중치 적용.
      - 데이터가 너무 많을 경우 Web Worker 등을 활용해 검색 로직을 메인 스레드에서 분리.

11. [자동화] 데이터 갱신 파이프라인 (CI/CD) 구축
    - 이슈: 매일 아침 로컬 수동 실행은 지속 불가능함. EOD 데이터 특성상 장 종료 후 자동 갱신 필수.
    - 계획:
      - GitHub Actions (cron 스케줄러) 또는 AWS Lambda/EventBridge 활용.

12. [다국어/테마] 국가별 상승/하락 색상 반전 기능
    - 이슈: 한국/동양권은 상승(Red)/하락(Blue), 미국/서양권은 상승(Green)/하락(Red)으로 색상 의미가 정반대임.
    - 계획:
      - i18n(다국어) 도입 시, 단순히 텍스트 번역뿐만 아니라 'Color Theme' 설정도 함께 연동.
      - 예: 한국어 설정 시 `theme-korea` (Up: Red, Down: Blue), 영어 설정 시 `theme-us` (Up: Green, Down: Red).
      - CSS 변수(Tailwind config)를 활용해 `text-bull-color`, `text-bear-color` 등으로 추상화하여 구현.