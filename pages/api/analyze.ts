// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Phrase = {
  text: string;
  meaning: string;
};

type Result = {
  original: string;
  translation: string;
  phrases: Phrase[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // 여기는 테스트용 하드코딩 분석 예시야. 실제 분석은 이 부분을 교체하면 됨!
  const result: Result = {
    original: sentence,
    translation: '인터넷은 대중매체 대부분과 분명하고 매우 중요한 방식으로 다릅니다.',
    phrases: [
      { text: 'The Net differs', meaning: '인터넷은 다릅니다' },
      { text: 'from most of the mass media', meaning: '대부분의 대중 매체와' },
      { text: 'it replaces', meaning: '그것이 대체하는' },
      { text: 'in an obvious and very important way', meaning: '분명하고 매우 중요한 방식으로' },
    ],
  };

  return res.status(200).json(result);
}
