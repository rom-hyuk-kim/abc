import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  // 임시 분석 결과 (더미 데이터)
  const result = {
    original: sentence,
    translation: "이것은 예시 번역입니다.",
    phrases: [
      { text: "The Net differs", meaning: "인터넷은 다르다" },
      { text: "from most of the mass media", meaning: "대부분의 대중 매체와" },
      { text: "it replaces", meaning: "그것이 대체하는" },
      { text: "in an obvious and very important way", meaning: "분명하고 매우 중요한 방식으로" }
    ]
  };

  return res.status(200).json(result);
}
