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
      return new Response(JSON.stringify({ error: 'Configuración de API faltante' }), {
        status: 500,
        headers
      });
    }

    // Prompt más simple y directo
    const userPrompt = `Analiza la exportación de ${product} desde Colombia. 
Responde SOLO con JSON válido. Usa esta estructura exacta:

{
  "product": "${product}",
  "summary": "Análisis completo del mercado para ${product} incluyendo oportunidades y desafíos",
  "markets": [
    {"rank": 1, "country": "Estados Unidos", "flag": "🇺🇸", "region": "Norteamérica", "lat": 39.8283, "lng": -98.5795, "demandScore": 85, "avgPriceUSD": "$50", "priceRange": "$40-60", "marketSize": "$2.5B", "growthRate": "+8%", "competition": "Media", "tariff": "0% TLC", "bestSeason": "Oct-Dic", "notes": "Alta demanda"},
    {"rank": 2, "country": "México", "flag": "🇲🇽", "region": "Norteamérica", "lat": 23.6345, "lng": -102.5528, "demandScore": 80, "avgPriceUSD": "$45", "priceRange": "$35-55", "marketSize": "$1.8B", "growthRate": "+10%", "competition": "Baja", "tariff": "0% TLC", "bestSeason": "Todo el año", "notes": "Mercado cercano"},
    {"rank": 3, "country": "España", "flag": "🇪🇸", "region": "Europa", "lat": 40.4637, "lng": -3.7492, "demandScore": 75, "avgPriceUSD": "$60", "priceRange": "$50-70", "marketSize": "$1.2B", "growthRate": "+5%", "competition": "Media-Alta", "tariff": "0% TLC", "bestSeason": "Mar-Jun", "notes": "Puerta de entrada a Europa"},
    {"rank": 4, "country": "Canadá", "flag": "🇨🇦", "region": "Norteamérica", "lat": 56.1304, "lng": -106.3468, "demandScore": 70, "avgPriceUSD": "$55", "priceRange": "$45-65", "marketSize": "$900M", "growthRate": "+6%", "competition": "Baja", "tariff": "0% TLC", "bestSeason": "Sep-Nov", "notes": "Alto poder adquisitivo"},
    {"rank": 5, "country": "Chile", "flag": "🇨🇱", "region": "Sudamérica", "lat": -35.6751, "lng": -71.543, "demandScore": 65, "avgPriceUSD": "$40", "priceRange": "$30-50", "marketSize": "$500M", "growthRate": "+7%", "competition": "Baja", "tariff": "0% TLC", "bestSeason": "Ene-Mar", "notes": "Crecimiento constante"}
  ],
  "transport": [
    {"type": "Aéreo", "emoji": "✈️", "name": "Transporte Aéreo", "detail": "Ideal para productos perecederos o de alto valor. Tiempo: 2-5 días. Costo: $$", "tag": "RÁPIDO", "tagClass": "fast"},
    {"type": "Marítimo", "emoji": "🚢", "name": "Transporte Marítimo", "detail": "Mejor para grandes volúmenes. Tiempo: 15-30 días. Costo: $", "tag": "ECONÓMICO", "tagClass": "eco"},
    {"type": "Terrestre", "emoji": "🚛", "name": "Transporte Terrestre", "detail": "Ideal para países vecinos. Tiempo: 3-10 días. Costo: $$", "tag": "BALANCEADO", "tagClass": "balanced"}
  ],
  "ports": [
    {"name": "Puerto de Cartagena", "emoji": "⚓", "detail": "Principal puerto del Caribe colombiano", "time": "5-7 días a USA"},
    {"name": "Puerto de Buenaventura", "emoji": "⚓", "detail": "Principal puerto del Pacífico", "time": "7-10 días a Asia"},
    {"name": "Aeropuerto El Dorado (BOG)", "emoji": "✈️", "detail": "Centro logístico aéreo", "time": "2-4 días mundial"},
    {"name": "Puerto de Santa Marta", "emoji": "⚓", "detail": "Especializado en carga refrigerada", "time": "6-8 días a Europa"}
  ],
  "documents": [
    {"name": "Factura Comercial", "note": "Emitida por el exportador", "status": "required"},
    {"name": "Lista de Empaque", "note": "Emitida por el exportador", "status": "required"},
    {"name": "Certificado de Origen", "note": "Cámara de Comercio", "status": "required"},
    {"name": "Conocimiento de Embarque", "note": "Naviera o aerolínea", "status": "required"},
    {"name": "Certificado Fitosanitario", "note": "ICA", "status": "recommended"},
    {"name": "Seguro de Carga", "note": "Aseguradora", "status": "recommended"}
  ],
  "seasons": [
    {"name": "Temporada Alta", "months": "Oct-Dic", "score": 95, "label": "✨ Mejor época"},
    {"name": "Temporada Media", "months": "Mar-Jun", "score": 75, "label": "👍 Buena época"},
    {"name": "Temporada Baja", "months": "Ene-Feb", "score": 50, "label": "📉 Demanda baja"},
    {"name": "Temporada Media", "months": "Jul-Sep", "score": 70, "label": "↗️ Recuperación"}
  ],
  "tips": [
    {"emoji": "💡", "title": "Certificaciones", "text": "Obtén certificaciones internacionales para aumentar el valor de tu producto"},
    {"emoji": "📦", "title": "Empaque", "text": "Invierte en empaques atractivos y funcionales para tu mercado objetivo"},
    {"emoji": "🤝", "title": "Aliados locales", "text": "Busca distribuidores locales en el país de destino"},
    {"emoji": "📊", "title": "Estudio de mercado", "text": "Investiga precios y competencia antes de exportar"}
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
          { role: "system", content: "Eres un experto en exportaciones. Responde SOLO con JSON válido. No añadas texto fuera del JSON." },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error de Groq');
    }

    let result = data.choices?.[0]?.message?.content || '';
    
    // Limpiar la respuesta
    result = result.replace(/```json\n?/g, '');
    result = result.replace(/```\n?/g, '');
    result = result.trim();
    
    // Intentar parsear
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch(e) {
      console.error('Error parsing JSON:', result);
      // Si falla, usar datos de respaldo
      parsed = JSON.parse(userPrompt);
    }

    return new Response(JSON.stringify({ result: JSON.stringify(parsed) }), { headers });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
}
