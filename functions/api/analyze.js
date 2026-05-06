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

    // ✅ LA KEY SE LEE DE LAS VARIABLES DE ENTORNO (SEGURA)
    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'Error de configuración: API key no encontrada' }), {
        status: 500,
        headers
      });
    }

    const prompt = `Eres un experto en exportaciones colombianas.
Genera un análisis para exportar: ${product} desde Colombia.

RESPONDE SOLO CON JSON.

{
  "product": "${product}",
  "summary": "Análisis completo",
  "markets": [
    {"rank": 1, "country": "Estados Unidos", "flag": "🇺🇸", "region": "Norteamérica", "lat": 39.8283, "lng": -98.5795, "demandScore": 85, "avgPriceUSD": "$50", "priceRange": "$40-60", "marketSize": "$2.5B", "growthRate": "+8%", "competition": "Media", "tariff": "0% TLC", "bestSeason": "Oct-Dic", "notes": "Alta demanda"},
    {"rank": 2, "country": "México", "flag": "🇲🇽", "region": "Norteamérica", "lat": 23.6345, "lng": -102.5528, "demandScore": 80, "avgPriceUSD": "$42", "priceRange": "$35-50", "marketSize": "$1.2B", "growthRate": "+9%", "competition": "Baja", "tariff": "0% TLC", "bestSeason": "Todo el año", "notes": "Mercado cercano"},
    {"rank": 3, "country": "España", "flag": "🇪🇸", "region": "Europa", "lat": 40.4637, "lng": -3.7492, "demandScore": 75, "avgPriceUSD": "$58", "priceRange": "$48-68", "marketSize": "$980M", "growthRate": "+6%", "competition": "Media", "tariff": "0% TLC", "bestSeason": "Mar-Jun", "notes": "Puerta a Europa"},
    {"rank": 4, "country": "Canadá", "flag": "🇨🇦", "region": "Norteamérica", "lat": 56.1304, "lng": -106.3468, "demandScore": 72, "avgPriceUSD": "$52", "priceRange": "$42-62", "marketSize": "$780M", "growthRate": "+7%", "competition": "Baja", "tariff": "0% TLC", "bestSeason": "Sep-Nov", "notes": "Alto poder adquisitivo"},
    {"rank": 5, "country": "Chile", "flag": "🇨🇱", "region": "Sudamérica", "lat": -35.6751, "lng": -71.543, "demandScore": 65, "avgPriceUSD": "$38", "priceRange": "$30-46", "marketSize": "$450M", "growthRate": "+7.5%", "competition": "Baja", "tariff": "0% TLC", "bestSeason": "Ene-Mar", "notes": "Mercado en crecimiento"}
  ],
  "transport": [
    {"type": "Aéreo", "emoji": "✈️", "name": "Transporte Aéreo", "detail": "Ideal para productos perecederos. Tiempo: 2-5 días.", "tag": "RÁPIDO", "tagClass": "fast"},
    {"type": "Marítimo", "emoji": "🚢", "name": "Transporte Marítimo", "detail": "Mejor para grandes volúmenes. Tiempo: 15-30 días.", "tag": "ECONÓMICO", "tagClass": "eco"},
    {"type": "Terrestre", "emoji": "🚛", "name": "Transporte Terrestre", "detail": "Ideal para países vecinos. Tiempo: 3-10 días.", "tag": "BALANCEADO", "tagClass": "balanced"}
  ],
  "ports": [
    {"name": "Puerto de Cartagena", "emoji": "⚓", "detail": "Caribe colombiano", "time": "5-7 días a USA"},
    {"name": "Puerto de Buenaventura", "emoji": "⚓", "detail": "Pacífico colombiano", "time": "7-10 días a Asia"},
    {"name": "Aeropuerto El Dorado", "emoji": "✈️", "detail": "Bogotá - Centro logístico", "time": "2-4 días mundial"},
    {"name": "Puerto de Santa Marta", "emoji": "⚓", "detail": "Carga refrigerada", "time": "6-8 días a Europa"}
  ],
  "documents": [
    {"name": "Factura Comercial", "note": "Emitida por exportador", "status": "required"},
    {"name": "Lista de Empaque", "note": "Detalle de mercancía", "status": "required"},
    {"name": "Certificado de Origen", "note": "Cámara de Comercio", "status": "required"},
    {"name": "Conocimiento de Embarque", "note": "Naviera", "status": "required"},
    {"name": "Certificado Fitosanitario", "note": "ICA", "status": "recommended"},
    {"name": "Seguro de Carga", "note": "Aseguradora", "status": "recommended"}
  ],
  "seasons": [
    {"name": "Temporada Alta", "months": "Oct-Dic", "score": 92, "label": "✨ Mejor época"},
    {"name": "Temporada Media", "months": "Mar-Jun", "score": 78, "label": "👍 Buena oportunidad"},
    {"name": "Temporada Baja", "months": "Ene-Feb", "score": 52, "label": "📉 Menor demanda"},
    {"name": "Recuperación", "months": "Jul-Sep", "score": 68, "label": "↗️ Reactivación"}
  ],
  "tips": [
    {"emoji": "📋", "title": "Certificaciones", "text": "Obtén certificaciones internacionales"},
    {"emoji": "🤝", "title": "Aliados", "text": "Busca distribuidores locales"},
    {"emoji": "📦", "title": "Empaque", "text": "Cumple normativas internacionales"},
    {"emoji": "📊", "title": "Estudio de mercado", "text": "Investiga precios y competencia"}
  ]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        temperature: 0.3,
        messages: [
          { role: "system", content: "Experto en exportaciones. Responde SOLO con JSON." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    let resultado;
    
    if (data.error) {
      resultado = JSON.parse(prompt);
    } else {
      let contenido = data.choices[0].message.content;
      contenido = contenido.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        resultado = JSON.parse(contenido);
      } catch(e) {
        resultado = JSON.parse(prompt);
      }
    }

    resultado.product = product;

    return new Response(JSON.stringify({ result: JSON.stringify(resultado) }), { headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
}
