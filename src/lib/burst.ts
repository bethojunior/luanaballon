/** Explosão rápida de confete na posição do clique (ex.: ao adicionar ao carrinho). */
export function burst(el?: Element | null) {
  if (typeof document === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : innerWidth / 2;
  const y = r ? r.top + r.height / 2 : innerHeight / 2;
  const colors = ['pink', 'sun', 'aqua', 'grape'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
    const d = 50 + Math.random() * 60;
    p.className = 'fx-burst';
    p.style.cssText = `left:${x}px;top:${y}px;background:rgb(var(--${colors[i % 4]}));border-radius:${i % 2 ? '50%' : '2px'};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}
