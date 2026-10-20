/** Animações de fundo do site: balões subindo, confete caindo, neve, corações etc. */
export type Motion = 'rise' | 'fall' | 'twinkle' | 'fly';
export type Motif = { label: string; motion: Motion; glyphs?: string[]; shape?: 'balloon' | 'confetti' };

export const MOTIFS: Record<string, Motif> = {
  balloons: { label: 'Balões subindo', motion: 'rise', shape: 'balloon' },
  confetti: { label: 'Confete caindo', motion: 'fall', shape: 'confetti' },
  hearts: { label: 'Corações', motion: 'rise', glyphs: ['❤️', '💖', '💕'] },
  snow: { label: 'Neve', motion: 'fall', glyphs: ['❄️', '❅', '❆'] },
  sparkles: { label: 'Brilhos e estrelas', motion: 'twinkle', glyphs: ['✨', '⭐', '✦'] },
  stars: { label: 'Estrelinhas e nuvens', motion: 'twinkle', glyphs: ['⭐', '☁️', '✨'] },
  flowers: { label: 'Pétalas e flores', motion: 'fall', glyphs: ['🌸', '🌷', '🌼'] },
  leaves: { label: 'Folhas', motion: 'fall', glyphs: ['🍃', '🍂'] },
  halloween: { label: 'Morcegos e abóboras', motion: 'fly', glyphs: ['🦇', '🎃', '👻'] },
  easter: { label: 'Ovos e coelhos', motion: 'rise', glyphs: ['🥚', '🐰', '🐣'] },
  fire: { label: 'Fogueira e milho', motion: 'rise', glyphs: ['🔥', '🌽', '✨'] },
  school: { label: 'Material escolar', motion: 'fall', glyphs: ['✏️', '📚', '🍎'] },
  grad: { label: 'Formatura', motion: 'fall', glyphs: ['🎓', '⭐', '🎉'] },
  money: { label: 'Ofertas', motion: 'fall', glyphs: ['🏷️', '💸', '🔥'] },
};

/** Animação extra de cada evento (os balões sempre acompanham). */
export const EVENT_FX: Record<string, string> = {
  'ano-novo': 'sparkles', carnaval: 'confetti', 'valentines-day': 'hearts', 'dia-da-mulher': 'flowers', pascoa: 'easter',
  'povos-indigenas': 'leaves', 'dia-das-maes': 'flowers', 'dia-dos-namorados': 'hearts', 'sao-joao': 'fire', 'dia-do-amigo': 'confetti',
  'dia-dos-pais': 'stars', 'dia-do-estudante': 'school', independencia: 'confetti', 'dia-do-cliente': 'sparkles',
  'dia-das-criancas': 'confetti', 'dia-dos-professores': 'school', halloween: 'halloween', 'black-friday': 'money', natal: 'snow',
  reveillon: 'sparkles', 'aniversario-infantil': 'confetti', 'aniversario-adulto': 'sparkles', 'cha-revelacao': 'confetti',
  'cha-de-bebe': 'stars', casamentos: 'flowers', noivados: 'sparkles', formaturas: 'grad', inauguracoes: 'confetti',
  'eventos-corporativos': 'sparkles', 'festas-escolares': 'school', mesversarios: 'stars', bodas: 'sparkles',
  'pedido-de-namoro': 'hearts', confraternizacoes: 'confetti', promocoes: 'money',
};

export const FX_LEVELS = [
  { value: 'desligada', label: 'Desligadas', count: 0 },
  { value: 'baixa', label: 'Poucas (discreto)', count: 6 },
  { value: 'media', label: 'Médias (recomendado)', count: 12 },
  { value: 'alta', label: 'Muitas (festa total)', count: 22 },
];

export const FX_STYLE_OPTIONS = [
  { value: 'auto', label: 'Automático (combina com o layout/evento)' },
  ...Object.entries(MOTIFS).map(([value, m]) => ({ value, label: m.label })),
];

export const fxCount = (level?: string) => FX_LEVELS.find((l) => l.value === level)?.count ?? 12;
