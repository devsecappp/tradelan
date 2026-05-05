let map = null;

export function initMap(markets) {
  if (map) {
    map.remove();
    map = null;
  }

  function initMapWithRetry(retries = 0) {
    if (typeof L === 'undefined') {
      if (retries < 20) {
        setTimeout(() => initMapWithRetry(retries + 1), 300);
      } else {
        document.getElementById('map').innerHTML = '<div style="color:#888;padding:20px;text-align:center">No se pudo cargar el mapa</div>';
      }
      return;
    }

    map = L.map('map').setView([20, 10], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    const colIcon = L.divIcon({
      html: `<div style="background:#F0C040;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 12px rgba(232,197,71,0.8)"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker([4.711, -74.0721], { icon: colIcon })
      .bindPopup(`<b>🇨🇴 Colombia</b><br>Origen de exportación`)
      .addTo(map);

    markets.forEach((m, i) => {
      const size = i === 0 ? 16 : 12;
      const color = i === 0 ? '#F0C040' : '#60A5FA';
      const glow = i === 0 ? '0 0 14px rgba(232,197,71,0.8)' : '0 0 8px rgba(74,158,232,0.5)';

      const icon = L.divIcon({
        html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid rgba(255,255,255,0.6);box-shadow:${glow}"></div>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      L.marker([m.lat, m.lng], { icon })
        .bindPopup(`${m.flag} ${m.country}<br>💰 ${m.avgPriceUSD}`)
        .addTo(map);

      L.polyline([[4.711, -74.0721], [m.lat, m.lng]], {
        color: i === 0 ? 'rgba(232,197,71,0.5)' : 'rgba(74,158,232,0.2)',
        weight: i === 0 ? 2 : 1,
        dashArray: '5, 8'
      }).addTo(map);
    });
  }

  initMapWithRetry();
}
