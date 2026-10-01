const assert = require('node:assert/strict');
const { MINERS, evaluate } = require('./calc');
const base = { surplusKwh: 8, surplusHours: 6, compPrice: 0.05, networkEh: 990.3, reward: 3.1521, btcEur: 74365, poolFee: 0 };
const nano = evaluate({ ...base, th: MINERS.nano3s.th, watts: MINERS.nano3s.w });
assert.ok(Math.abs(nano.energy - 0.84) < 1e-9);                       // 140 W × 6 h
assert.ok(Math.abs(nano.eurPerKwhMining - 0.0609) < 0.0005);           // same €/kWh as the full-day article table
assert.ok(Math.abs(evaluate({ ...base, poolFee: 2, th: 6, watts: 140 }).eurPerKwhMining - 0.0609 * 0.98) < 0.0005);
const q = evaluate({ ...base, th: MINERS.avalonq.th, watts: MINERS.avalonq.w });
assert.equal(q.energy, 8); assert.ok(Math.abs(q.hours - 8 / 1.674) < 1e-9); assert.equal(q.unusedSurplus, 0);   // limited by surplus, not by hours
assert.ok(Math.abs(q.eurPerKwhMining - 0.0764) < 0.0005);
const zero = evaluate({ ...base, compPrice: 0, th: 6, watts: 140 });
assert.ok(zero.diffEurDay > 0);                                        // surplus that is not paid: mining always adds value
assert.throws(() => evaluate({ ...base, th: 6, watts: 0 }));
assert.throws(() => evaluate({ ...base, th: 6, watts: 140, surplusHours: 25 }));
console.log('8 solar-surplus calculation checks passed');
