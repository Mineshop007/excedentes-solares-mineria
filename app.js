const $ = id => document.getElementById(id);
const eur = (n, d = 2) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' €';
const num = (n, d = 2) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
function pickMiner() {
  const key = $('miner').value;
  if (key !== 'custom') { const m = SolarMining.MINERS[key]; $('th').value = m.th; $('watts').value = m.w; $('minerLink').href = m.url; $('minerLink').textContent = 'Ficha de ' + m.name + ' ↗'; $('minerLink').hidden = false; }
  else $('minerLink').hidden = true;
}
function render() {
  try {
    if (!$('form').checkValidity()) throw new Error('Introduce valores válidos dentro de los límites indicados.');
    const p = Object.fromEntries(['surplusKwh','surplusHours','compPrice','th','watts','networkEh','reward','btcEur','poolFee'].map(k => [k, Number($(k).value)]));
    const r = SolarMining.evaluate(p);
    $('perKwh').textContent = num(r.eurPerKwhMining, 3);
    $('vsComp').textContent = r.eurPerKwhMining >= p.compPrice ? 'más que compensar (' + num(p.compPrice, 3) + ' €/kWh)' : 'menos que compensar (' + num(p.compPrice, 3) + ' €/kWh)';
    $('energy').textContent = num(r.energy) + ' kWh/día (' + num(r.hours, 1) + ' h)';
    $('unused').textContent = num(r.unusedSurplus) + ' kWh/día';
    $('mineMonth').textContent = eur(r.mineEurDay * 30) + ' (' + Math.round(r.satsDay * 30).toLocaleString('es-ES') + ' sats)';
    $('compMonth').textContent = eur(r.compEurDay * 30);
    $('diffMonth').textContent = (r.diffEurDay >= 0 ? '+' : '') + eur(r.diffEurDay * 30);
    $('solo').textContent = num(r.soloMonthChance * 100, 4) + ' % al mes';
    $('error').textContent = '';
  } catch (e) { ['perKwh','energy','unused','mineMonth','compMonth','diffMonth','solo'].forEach(id => $(id).textContent = '—'); $('vsComp').textContent = ''; $('error').textContent = e.message; }
}
$('miner').addEventListener('change', () => { pickMiner(); render(); });
$('form').addEventListener('input', e => { if (['th','watts'].includes(e.target.id)) { $('miner').value = 'custom'; $('minerLink').hidden = true; } render(); });
$('form').addEventListener('submit', e => e.preventDefault());
pickMiner(); render();
