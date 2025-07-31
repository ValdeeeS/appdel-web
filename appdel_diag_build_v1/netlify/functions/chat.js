export const handler = async (event) => {
  // Only POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  // Environment check
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.length < 20) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY is missing in Netlify environment (Functions scope). Add it and redeploy.' }) };
  }
  try {
    const input = JSON.parse(event.body || "{}");
    const { level = "intermediate", budget = 120, style = "control", freq = 2, recommendations = [] } = input;

    const system = `Eres "Lola · Appdel", una entrenadora de pádel cercana y profesional. Español (España).
- Responde breve: 1–2 párrafos + viñetas si procede.
- Explica por qué encajan según nivel, estilo, presupuesto y frecuencia.
- Cierra con una pregunta corta (seguir ayudando o comparar modelos).`;

    const user = `Perfil: nivel=${level}, presupuesto=${budget}€, estilo=${style}, horas/semana=${freq}.
Candidatas:
${recommendations.map((r,i)=>`${i+1}. ${r.brand} ${r.model} — €${r.price} · ${r.level} · ${r.style}. ${r.description||''}`).join('\n')}`;

    // Try Responses API (moderna)
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    });

    if (!resp.ok) {
      const t = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: "OpenAI API error", details: t }) };
    }
    const data = await resp.json();
    const text = data?.output_text || data?.choices?.[0]?.message?.content || "No se pudo generar respuesta.";
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || String(err) }) };
  }
};