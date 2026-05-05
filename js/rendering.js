export function renderResults(data) {
  document.getElementById('productNameDisplay').textContent = data.product;
  document.getElementById('resultsMeta').innerHTML = 
    `${data.markets.length} mercados analizados<br>${new Date().toLocaleDateString('es-CO')}`;

  document.getElementById('aiAnalysisText').textContent = data.summary;

  renderMarkets(data.markets);
  renderSeasons(data.seasons);
  renderPorts(data.ports);
  renderTransport(data.transport);
  renderDocs(data.documents);
  renderTips(data.tips);

  document.getElementById('results').classList.add('visible');
}

function renderMarkets(markets) {
  const grid = document.getElementById('marketsGrid');
  grid.innerHTML = '';
  markets.forEach((m, i) => {
    grid.innerHTML += `
      <div class="market-card ${i===0?'top-pick':''}">
        ${i===0 ? '<div class="top-pick-badge">★ MEJOR OPCIÓN</div>' : ''}
        <div class="market-rank">#${m.rank}</div>
        <span class="market-flag">${m.flag}</span>
        <div class="market-country">${m.country}</div>
        <div class="market-region">${m.region}</div>
        <div class="stat-row"><span class="stat-label">Precio promedio</span><span class="stat-value good">${m.avgPriceUSD}</span></div>
        <div class="stat-row"><span class="stat-label">Crecimiento</span><span class="stat-value good">${m.growthRate}</span></div>
        <div class="demand-bar"><div class="demand-fill" style="width:${m.demandScore}%"></div></div>
        <div class="market-note">${m.notes}</div>
      </div>`;
  });
}

function renderSeasons(seasons) {
  const content = document.getElementById('seasonsContent');
  content.innerHTML = `<div class="seasons-grid">` +
    seasons.map(s => `
      <div class="season-card ${s.score>=80?'peak':''}">
        <div class="season-name">${s.name}</div>
        <div class="season-months">${s.months}</div>
        <div class="season-score ${s.score>=80?'score-high':'score-mid'}">${s.score}</div>
        <div class="season-label">${s.label}</div>
      </div>`).join('') + `</div>`;
}

function renderPorts(ports) {
  const content = document.getElementById('portsContent');
  content.innerHTML = `<div class="ports-row">` +
    ports.map(p => `
      <div class="port-item">
        <div class="port-icon">${p.emoji}</div>
        <div class="port-info">
          <div class="port-name">${p.name}</div>
          <div class="port-detail">${p.detail}</div>
        </div>
        <div class="port-time">${p.time}</div>
      </div>`).join('') + `</div>`;
}

function renderTransport(transport) {
  const content = document.getElementById('transportContent');
  content.innerHTML = transport.map(t => `
    <div class="transport-item">
      <div class="transport-icon">${t.emoji}</div>
      <div class="transport-info">
        <div class="transport-name">${t.name}</div>
        <div class="transport-detail">${t.detail}</div>
      </div>
      <span class="transport-tag">${t.tag}</span>
    </div>`).join('');
}

function renderDocs(documents) {
  const content = document.getElementById('docsContent');
  content.innerHTML = documents.map(d => `
    <div class="doc-item">
      <div class="doc-status ${d.status}"></div>
      <div class="doc-name">${d.name}</div>
      <div class="doc-note">${d.note}</div>
    </div>`).join('');
}

function renderTips(tips) {
  const content = document.getElementById('tipsContent');
  content.innerHTML = tips.map(t => `
    <div class="tip-card">
      <div class="tip-title">${t.emoji} ${t.title}</div>
      <div class="tip-text">${t.text}</div>
    </div>`).join('');
}
