import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import getYFdatas from './getYFdatas'

// CORS 미들웨어 초기화
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: 'http://localhost:5173', // 허용할 도메인
});

export default function handler (
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    cors(req, res, async () => {
      if (req.method === 'OPTIONS') {
          // Preflight 요청에 대한 응답
          res.status(200).end();
          return;
      }

      const yfDatas = await getYFdatas();
      console.log('yfDatas', yfDatas);

      // 데이터 처리 로직
      res.status(200).json({ data: yfDatas });
  });
  }