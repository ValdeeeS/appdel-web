
export async function appdelChat(payload){
  const call = async (url) => {
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    const data = await r.json();
    return data?.text || data?.message || data?.output || '';
  };
  try { return await call('/.netlify/functions/chat'); }    // Netlify
  catch { try { return await call('/api/chat'); }           // Vercel fallback
         catch { return 'Ahora mismo no puedo conectarme al motor de IA. Despliega con OPENAI_API_KEY o usa window.OPENAI_API_KEY para pruebas.'; } }
}
