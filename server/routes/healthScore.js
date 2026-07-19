const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.trim() === "") {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
            'You are a nutrition analyst. Given a food product ingredient list, return ONLY valid JSON, no markdown, no extra text, in this exact shape: {"score": number (0-10), "rating": "Poor"|"Moderate"|"Good"|"Excellent", "concerns": [{"label": string, "explain": string}], "positives": [{"label": string, "explain": string}]}. Base every concern and positive STRICTLY on ingredients that are explicitly present in the given list. Do NOT infer, assume, or speculate about anything not directly stated (e.g. do not assume caffeine just because a drink is carbonated, do not assume nutrients not listed). If an ingredient is ambiguous or you are unsure, skip it rather than guessing. Keep each explanation under 20 words. List at most 6 concerns and 6 positives, only the most significant, grounded strictly in the text given.',
          },
          { role: "user", content: `Ingredients: ${ingredients}` },
        ],
        temperature: 0.3,
      }),
    });

    if (!groqRes.ok) throw new Error(`Groq API error: ${groqRes.status}`);

    const data = await groqRes.json();
    const raw = data.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({ source: "ai", ...parsed });
  } catch (err) {
    console.error("Health score AI error:", err.message);
    res.status(500).json({ error: "AI health score failed" });
  }
});

module.exports = router;
//done 