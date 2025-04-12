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

export default function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { sentence } = req.body;

  // 아주 간단한 더미 응답 - 원하는대로 바꿀 수 있음
  const result: Result = {
    original: sentence,
    translation: '이것은 예시 번역입니다.',
    phrases: [
      { text: 'The Net differs', meaning: '인터넷은 다릅니다' },
      { text: 'from most of the mass media', meaning: '대부분의 대중매체와' },
    ],
  };

  res.status(200).json(result);
}
