export const colors = {
  background: '#ffffff',
  surface: '#fafafa',
  border: '#dbdbdb',
  text: '#262626',
  textSecondary: '#8e8e8e',
  link: '#0095f6',
  danger: '#ed4956',
  bubbleMine: '#3897f0',
  bubbleTheirs: '#efefef',
  unreadDot: '#0095f6',
};

// Instagram's signature story-ring gradient, warm end to cool end.
export const storyGradient = ['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5'] as const;

export const avatarPalette = [
  '#F77737',
  '#E1306C',
  '#C13584',
  '#833AB4',
  '#5851DB',
  '#405DE6',
  '#00A8CC',
  '#2BBF80',
] as const;

export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
}
