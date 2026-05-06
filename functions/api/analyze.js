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

    // Datos de respaldo fijos que funcionan siempre
    const datosFijos = {
      product: product,
      summary: `📊 Análisis para exportar ${product} desde Colombia:

✅ Colombia tiene ventajas competitivas para este producto.

🌎 Los mejores mercados son Estados Unidos, México y España.

📈 Se recomienda iniciar con exportaciones pequeñas.

🔍 Consulta con ProColombia para beneficios arancelarios.`,
      markets: [
        {rank: 1, country: "Estados Unidos", flag: "🇺🇸", region: "Norteamérica", lat: 39.8283, lng: -98.5795, demandScore: 88, avgPriceUSD: "$55 USD", priceRange: "$45-65 USD", marketSize: "$2.5B", growthRate: "+8.5%", competition: "Media", tariff: "0% TLC", bestSeason: "Oct-Dic", notes: "Mayor mercado para Colombia"},
        {rank: 2, country: "México", flag: "🇲🇽", region: "Norteamérica", lat: 23.6345, lng: -102.5528, demandScore: 82, avgPriceUSD: "$42 USD", priceRange: "$35-50 USD", marketSize: "$1.2B", growthRate: "+9%", competition: "Baja", tariff: "0% TLC", bestSeason: "Todo el año", notes: "Excelente oportunidad por cercanía"},
        {rank: 3, country: "España", flag: "🇪🇸", region: "Europa", lat: 40.4637, lng: -3.7492, demandScore: 78, avgPriceUSD: "$58 USD", priceRange: "$48-68 USD", marketSize: "$980M", growthRate: "+6%", competition: "Media-Alta", tariff: "0% TLC", bestSeason: "Mar-Jun", notes: "Puerta de entrada a Europa"},
        {rank: 4, country: "Canadá", flag: "🇨🇦", region: "Norteamérica", lat: 56.1304, lng: -106.3468, demandScore: 74, avgPriceUSD: "$52 USD", priceRange: "$42-62 USD", marketSize: "$780M", growthRate: "+7%", competition: "Baja", tariff: "0% TLC", bestSeason: "Sep-Nov", notes: "Alto poder adquisitivo"},
        {rank: 5, country: "Chile", flag: "🇨🇱", region: "Sudamérica", lat: -35.6751, lng: -71.543, demandScore: 68, avgPriceUSD: "$38 USD", priceRange: "$30-46 USD", marketSize: "$450M", growthRate: "+7.5%", competition: "Baja", tariff: "0% TLC", bestSeason: "Ene-Mar", notes: "Mercado en crecimiento"}
      ],
      transport: [
        {type: "Aéreo", emoji: "✈️", name: "Transporte Aéreo", detail: "Ideal para productos perecederos. Tiempo: 2-5 días.", tag: "RÁPIDO", tagClass: "fast"},
        {type: "Marítimo", emoji: "🚢", name: "Transporte Marítimo", detail: "Mejor para grandes volúmenes. Tiempo: 15-30 días.", tag: "ECONÓMICO", tagClass: "eco"},
        {type: "Terrestre", emoji: "🚛", name: "Transporte Terrestre", detail: "Ideal para países vecinos. Tiempo: 3-10 días.", tag: "BALANCEADO", tagClass: "balanced"}
      ],
      ports: [
        {name: "Puerto de Cartagena", emoji: "⚓", detail: "Caribe colombiano", time: "5-7 días a USA"},
        {name: "Puerto de Buenaventura", emoji: "⚓", detail: "Pacífico colombiano", time: "7-10 días a Asia"},
        {name: "Aeropuerto El Dorado", emoji: "✈️", detail: "Bogotá - Centro logístico", time: "2-4 días mundial"},
        {name: "Puerto de Santa Marta", emoji: "⚓", detail: "Carga refrigerada", time: "6-8 días a Europa"}
      ],
      documents: [
        {name: "Factura Comercial", note: "Emitida por exportador", status: "required"},
        {name: "Lista de Empaque", note: "Detalle de mercancía", status: "required"},
        {name: "Certificado de Origen", note: "Cámara de Comercio", status: "required"},
        {name: "Conocimiento de Embarque", note: "Naviera o aerolínea", status: "required"},
        {name: "Certificado Fitosanitario", note: "ICA - Para alimentos", status: "recommended"},
        {name: "Seguro de Carga", note: "Aseguradora", status: "recommended"}
      ],
      seasons: [
        {name: "Temporada Alta", months: "Oct-Dic", score: 92, label: "✨ Mejor época"},
        {name: "Temporada Media-Alta", months: "Mar-Jun", score: 78, label: "👍 Buena oportunidad"},
        {name: "Temporada Baja", months: "Ene-Feb", score: 52, label: "📉 Menor demanda"},
        {name: "Recuperación", months: "Jul-Sep", score: 68, label: "↗️ Reactivación"}
      ],
      tips: [
        {emoji: "📋", title: "Certificaciones", text: "Obtén certificaciones de calidad"},
        {emoji: "🤝", title: "Aliados estratégicos", text: "Busca distribuidores locales"},
        {emoji: "📦", title: "Empaque", text: "Cumple normativas internacionales"},
        {emoji: "📊", title: "Estudio de mercado", text: "Investiga precios y competencia"}
      ]
    };

    // Retornar los datos fijos como JSON
    const resultado = JSON.stringify(datosFijos);
    
    return new Response(JSON.stringify({ result: resultado }), { headers });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
}
