export async function analyzeProductAPI(product) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    if (!data.result) {
      throw new Error('No se recibió resultado');
    }
    
    let parsed;
    try {
      parsed = JSON.parse(data.result);
    } catch(e) {
      console.error('Error parsing JSON:', data.result);
      throw new Error('La respuesta no es JSON válido');
    }
    
    return parsed;
    
  } catch (err) {
    console.error('API Error:', err);
    throw new Error(err.message || 'Error de conexión con el servidor');
  }
}
