/* Excedentes solares: ¿compensar o minar? Estimación del valor esperado (no garantizado) de usar excedente fotovoltaico en un minero de Bitcoin. */
(function(root){
  const MINERS = {
    bitaxe:  { name: 'Bitaxe Gamma 601', th: 1.2,  w: 17,   url: 'https://mineshop.eu/es/bitaxe-gamma-601-solo-bitcoin-miner' },
    nerdqaxe:{ name: 'NerdQaxe Rev7 6 TH/s', th: 6, w: 100,  url: 'https://mineshop.eu/es/nerdqaxe-rev7-6ths-air-cooled' },
    nano3s:  { name: 'Avalon Nano 3S', th: 6,      w: 140,  url: 'https://mineshop.eu/es/avalon-nano-3s-6-ths-home-bitcoin-miner-and-heater-140w' },
    mini3:   { name: 'Avalon Mini 3', th: 37.5,    w: 750,  url: 'https://mineshop.eu/es/avalon-mini-3-home-bitcoin-miner' },
    avalonq: { name: 'Avalon Q', th: 90,           w: 1674, url: 'https://mineshop.eu/es/canaan-avalon-q-home-bitcoin-asic-miner' }
  };
  function evaluate(p){
    for (const k of ['surplusKwh','surplusHours','compPrice','th','watts','networkEh','reward','btcEur','poolFee']) {
      if (!Number.isFinite(p[k]) || p[k] < 0) throw new Error('Valor no válido: ' + k);
    }
    if (!p.th || !p.watts || !p.networkEh || !p.surplusHours || p.surplusHours > 24 || p.poolFee >= 100) throw new Error('Revisa los valores: potencia, hashrate, red y horas deben ser positivos (horas ≤ 24, comisión < 100 %).');
    const kw = p.watts / 1000;
    const energy = Math.min(p.surplusKwh, kw * p.surplusHours);        // kWh/día que el minero puede usar del excedente
    const hours = energy / kw;                                        // horas/día de minado
    const share = p.th * 1e12 / (p.networkEh * 1e18);
    const blocksPerDay = 144 * share * hours / 24;                    // bloques esperados por día (solo)
    const btcDay = blocksPerDay * p.reward * (1 - p.poolFee / 100);   // valor esperado en pool
    const mineEurDay = btcDay * p.btcEur;
    const compEurDay = energy * p.compPrice;
    const eurPerKwhMining = energy > 0 ? mineEurDay / energy : 0;
    const soloMonthChance = 1 - Math.exp(-blocksPerDay * 30);
    return { energy, hours, unusedSurplus: Math.max(0, p.surplusKwh - energy), btcDay, mineEurDay, compEurDay, diffEurDay: mineEurDay - compEurDay,
             eurPerKwhMining, satsDay: btcDay * 1e8, soloMonthChance, breakEvenCompPrice: eurPerKwhMining };
  }
  const api = { MINERS, evaluate };
  if (typeof module !== 'undefined') module.exports = api;
  root.SolarMining = api;
})(typeof window === 'undefined' ? globalThis : window);
