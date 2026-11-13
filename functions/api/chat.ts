interface Env {
  GEMINI_API_KEY: string
  GEMINI_MODEL?: string
}
interface PagesContext {
  request: Request
  env: Env
}
export const onRequestPost = async ({ request, env }: PagesContext) => {
  try {
    if (!env.GEMINI_API_KEY) {
      return Response.json({ error: 'لم يتم إعداد GEMINI_API_KEY في إعدادات Cloudflare.' }, { status: 503 })
    }
    const body = await request.json() as { prompt?: string }
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    if (!prompt || prompt.length > 12000) {
      return Response.json({ error: 'الطلب فارغ أو أطول من الحد المسموح (12000 حرف).' }, { status: 400 })
    }
    const model = env.GEMINI_MODEL || 'gemini-2.5-flash'
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: 'You are the AI game development planner for BlightFall AI Studio. Help design practical, incremental Godot 4 game projects. Be honest about what is implemented versus planned. Do not claim to have created files, run Godot, generated 3D assets, or tested a game unless connected tools actually performed those actions. Give structured, actionable steps.' }]
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 2500 }
      })
    })
    const data = await upstream.json() as any
    if (!upstream.ok) {
      const message = data?.error?.message || `Gemini API returned ${upstream.status}`
      return Response.json({ error: message }, { status: upstream.status >= 500 ? 502 : upstream.status })
    }
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('\n').trim()
    return Response.json({ text: text || 'لم يُرجع النموذج نصاً. جرّب طلباً آخر.' })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء معالجة الطلب.' }, { status: 500 })
  }
}
