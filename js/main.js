import { LOADING_MESSAGES } from './config.js';
import { analyzeProductAPI } from './api.js';
import { initMap } from './map.js';
import { renderResults } from './rendering.js';

let loadingInterval = null;

function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('active');
  
  let step = 0;
  const stepsDiv = document.getElementById('loadingSteps');
  stepsDiv.innerHTML = `<div>${LOADING_MESSAGES[0]}</div>`;
  
  loadingInterval = setInterval(() => {
    step = (step + 1) % LOADING_MESSAGES.length;
    stepsDiv.innerHTML = `<div>${LOADING_MESSAGES[step]}</div>`;
  }, 1400);
}

function hideLoading() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('active');
}

export async function analyzeProduct() {
  const product = document.getElementById('productInput').value.trim();
  if (!product) return;

  showLoading();

  try {
    const data = await analyzeProductAPI(product);
    renderResults(data);
    initMap(data.markets);
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error: ' + err.message);
  } finally {
    hideLoading();
  }
}

window.analyzeProduct = analyzeProduct;
window.setProduct = (product) => {
  document.getElementById('productInput').value = product;
  analyzeProduct();
};
