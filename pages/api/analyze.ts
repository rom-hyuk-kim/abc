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

  try {
    const { sentence } = req.body;

    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const result: Result = {
      original: sentence,
      translation: '이것은 예시 번역입니다.',
      phrases: [
        { text: 'The Net differs', meaning: '인터넷은 다릅니다' },
        { text: 'from most of the mass media', meaning: '대중 매체와' },
      ],
    };

    return res.status(200).json(result);
  } catch (e) {
    console.error('API ERROR:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
