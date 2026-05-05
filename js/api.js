import { CONFIG } from './config.js';

export async function analyzeProductAPI(product) {
  const response = await fetch(`${CONFIG.API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la API');
  }

  const data = await response.json();
  
  let parsed;
  try {
    let clean = data.result.replace(/```json|```/g, '').trim();
    clean = clean.replace(/,\s*"[^"]*"\s*(?=[,\}])/g, '');
    clean = clean.replace(/,(\s*[\}\]])/g, '$1');
    
    try {
      parsed = JSON.parse(clean);
    } catch(e1) {
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        let sub = clean.slice(start, end + 1);
        sub = sub.replace(/,\s*"[^"]*"\s*(?=[,\}])/g, '');
        sub = sub.replace(/,(\s*[\}\]])/g, '$1');
        parsed = JSON.parse(sub);
      } else {
        throw e1;
      }
    }
  } catch(e) {
    console.error('JSON parse error', e);
    throw new Error('No se pudo procesar la respuesta de IA');
  }
  
  return parsed;
}
