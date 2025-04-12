import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  const phrases = sentence
    .split("/")
    .map((part: string) => part.trim())
    .filter(Boolean);

  return res.status(200).json({
    original: sentence, // 입력한 문장 그대로
    translation: "이 문장은 자동으로 해석되었습니다.",
    phrases: phrases.map((text) => ({
      text,
      meaning: `"${text}" 구문에 대한 해석입니다.`
    }))
  });
}
