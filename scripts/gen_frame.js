const fs = require('fs');

const w = 1100;
const h = 750;

// Top: 7 waves from (90, 50) to (1010, 50)
// Right: 5 waves from (1010, 90) to (1010, 660)
// Bottom: 7 waves from (1010, 700) to (90, 700)
// Left: 5 waves from (90, 660) to (90, 90)

function waveH(x1, x2, y, count, amp) {
  let res = '';
  const step = (x2 - x1) / count;
  for (let i = 0; i < count; i++) {
    const sx = x1 + i * step;
    const ex = sx + step;
    const mx1 = sx + step * 0.25;
    const mx2 = sx + step * 0.75;
    const my1 = y + (i % 2 === 0 ? -amp : amp);
    const my2 = y + (i % 2 === 0 ? amp : -amp);
    res += ` C ${mx1.toFixed(1)},${my1.toFixed(1)} ${mx2.toFixed(1)},${my2.toFixed(1)} ${ex.toFixed(1)},${y.toFixed(1)}`;
  }
  return res;
}

function waveV(x, y1, y2, count, amp) {
  let res = '';
  const step = (y2 - y1) / count;
  for (let i = 0; i < count; i++) {
    const sy = y1 + i * step;
    const ey = sy + step;
    const my1 = sy + step * 0.25;
    const my2 = sy + step * 0.75;
    const mx1 = x + (i % 2 === 0 ? amp : -amp);
    const mx2 = x + (i % 2 === 0 ? -amp : amp);
    res += ` C ${mx1.toFixed(1)},${my1.toFixed(1)} ${mx2.toFixed(1)},${my2.toFixed(1)} ${x.toFixed(1)},${ey.toFixed(1)}`;
  }
  return res;
}

let d = 'M 90,50';
d += waveH(90, 1010, 50, 7, 14);
d += ' Q 1055,50 1055,90';
d += waveV(1055, 90, 660, 5, 14);
d += ' Q 1055,700 1010,700';
d += waveH(1010, 90, 700, 7, 14);
d += ' Q 45,700 45,660';
d += waveV(45, 660, 90, 5, 14);
d += ' Q 45,50 90,50 Z';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
  <defs>
    <filter id="wishCardGlow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#3b0764" flood-opacity="0.22" />
    </filter>
  </defs>
  <g filter="url(#wishCardGlow)">
    <path d="${d}" fill="#fdfcf4" stroke="#66469b" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
  </g>
</svg>`;

fs.writeFileSync('public/images/wish-frame.svg', svg);
console.log('Saved updated wish-frame.svg');

