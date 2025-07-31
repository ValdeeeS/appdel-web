export const handler = async () => {
  const hasKey = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20);
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: hasKey, model, note: hasKey ? "OPENAI_API_KEY available to Functions" : "Set OPENAI_API_KEY (Functions scope) in Site settings → Environment variables, then redeploy." })
  };
};