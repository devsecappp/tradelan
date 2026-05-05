export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { 
      status: 405, 
      headers 
    });
  }

  try {
    const { product } = await context.request.json();
    
    if (!product || product.trim() === '') {
      return new Response(JSON.stringify({ error: 'Producto no proporcionado' }), {
        status: 400,
        headers
      });
    }

    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'Configuración de API faltante. Agrega GROQ_API_KEY en Environment Variables de Cloudflare.' }), {
        status: 500,
        headers
      });
    }

    const systemPrompt = `Eres TradeLAN, un experto en comercio exterior colombiano.
Responde SOLO con JSON válido, sin texto adicional, sin markdown.

{
  "product": "nombre",
  "summary": "análisis en 3-4 párrafos",
  "markets": [
    {
      "rank": 1,
      "country": "país",
      "flag": "🇺🇸",
      "region": "Norteamérica",
      "lat": 40.0,
      "lng": -100.0,
      "demandScore": 85,
      "avgPriceUSD": "$XX",
      "priceRange": "$XX-XX",
      "marketSize": "$X.XXB",
      "growthRate": "+X%",
      "competition": "Media",
      "tariff": "0% TLC",
      "bestSeason": "Trimestre",
      "notes": "nota"
    }
  ],
  "transport": [
    {
      "type": "Aéreo",
      "emoji": "✈️",
      "name": "Nombre",
      "detail": "Detalle",
      "tag": "RÁPIDO",
      "tagClass": "fast"
    }
  ],
  "ports": [
    {
      "name": "Puerto",
      "emoji": "⚓",
      "detail": "Detalle",
      "time": "X días"
    }
  ],
  "documents": [
    {
      "name": "Documento",
      "note": "Nota",
      "status": "required"
    }
  ],
  "seasons": [
    {
      "name": "Alta",
      "months": "Ene-Mar",
      "score": 90,
      "label": "✨ Temporada alta"
    }
  ],
  "tips": [
    {
      "emoji": "💡",
      "title": "Tip",
      "text": "Consejo"
    }
  ]
}

Incluye 5 mercados, 3 transportes, 4 puertos, 6 documentos, 4 temporadas, 4 tips.
Datos reales para ${product} desde Colombia.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 4000,
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analiza el mercado de exportación para: ${product} desde Colombia` }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error de Groq');
    }

    const result = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ result }), { headers });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
}
