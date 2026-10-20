import { MOTIFS, fxCount, type Motif } from '@/lib/fx';
import type { ThemeDef } from '@/lib/themes';

const COLORS = ['pink', 'sun', 'aqua', 'grape'];
const col = (i: number) => `rgb(var(--${COLORS[i % COLORS.length]}))`;

/** "Aleatório" determinístico: o servidor e o navegador geram os mesmos valores. */
const rnd = (i: number, k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;

function Layer({ motif, count, tag }: { motif: Motif; count: number; tag: string }) {
  if (count <= 0) return null;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const slow = motif.motion === 'rise' ? 16 : motif.motion === 'fly' ? 14 : 12;
        const dur = slow + rnd(i, 1) * 14;
        const size = motif.shape === 'balloon' ? 34 + rnd(i, 2) * 34 : motif.shape === 'confetti' ? 6 + rnd(i, 2) * 8 : 16 + rnd(i, 2) * 18;
        const style = {
          '--x': `${Math.round(rnd(i, 3) * 96)}%`,
          '--y': `${Math.round(8 + rnd(i, 4) * 80)}%`,
          '--dur': `${dur.toFixed(1)}s`,
          '--delay': `-${(rnd(i, 5) * dur).toFixed(1)}s`,
          '--sway': `${Math.round(12 + rnd(i, 6) * 36)}px`,
          '--size': `${Math.round(size)}px`,
          '--c': col(i + (tag === 'b' ? 0 : 1)),
          '--rot': `${Math.round(rnd(i, 7) * 360)}deg`,
        } as React.CSSProperties;
        const glyph = motif.glyphs?.[i % motif.glyphs.length];
        return (
          <span key={`${tag}${i}`} className={`fx fx-${motif.motion} ${i % 2 ? 'max-md:hidden' : ''}`} style={style}>
            <span className="fx-in">
              {motif.shape === 'balloon' ? (
                <svg viewBox="0 0 60 90" width="1em" height="1.5em" aria-hidden>
                  <ellipse cx="30" cy="32" rx="26" ry="30" style={{ fill: 'var(--c)' }} />
                  <path d="M30 62l-5 7h10z" style={{ fill: 'var(--c)' }} />
                  <path d="M30 69q-8 10 0 20" stroke="#8a7a99" strokeWidth="1.5" fill="none" />
                  <ellipse cx="20" cy="20" rx="6" ry="10" fill="#fff" opacity=".4" transform="rotate(25 20 20)" />
                </svg>
              ) : motif.shape === 'confetti' ? (
                <i className={i % 3 === 0 ? 'rounded-full' : ''} />
              ) : (
                glyph
              )}
            </span>
          </span>
        );
      })}
    </>
  );
}

/** Camada decorativa fixa (não bloqueia cliques). Quantidade e tipo vêm do painel (Aparência). */
export default function FX({ theme, level, style }: { theme: ThemeDef; level?: string; style?: string }) {
  const total = fxCount(level);
  if (total <= 0) return null;
  const chosen = style && style !== 'auto' && MOTIFS[style] ? style : undefined;
  const extra = MOTIFS[chosen ?? theme.fx];
  const showBalloons = !chosen || chosen === 'balloons';
  return (
    <div className="fx-layer" aria-hidden>
      {showBalloons && <Layer motif={MOTIFS.balloons} count={chosen ? total : Math.max(3, Math.round(total * 0.55))} tag="b" />}
      {extra && extra !== MOTIFS.balloons && <Layer motif={extra} count={Math.round(total * 0.9)} tag="m" />}
    </div>
  );
}
