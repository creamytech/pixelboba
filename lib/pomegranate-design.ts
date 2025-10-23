/**
 * Pomegranate Design System
 * Bold, playful design with hard shadows, thick borders, and vibrant colors
 */

export const pomegranate = {
  border: { thin: '2px', default: '3px', thick: '4px', bold: '5px' },
  radius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem', full: '9999px' },
  shadow: {
    sm: '2px 2px 0px 0px rgba(58, 0, 29, 1)',
    md: '3px 3px 0px 0px rgba(58, 0, 29, 1)',
    lg: '4px 4px 0px 0px rgba(58, 0, 29, 1)',
    xl: '6px 6px 0px 0px rgba(58, 0, 29, 1)',
    '2xl': '8px 8px 0px 0px rgba(58, 0, 29, 1)',
    '3xl': '12px 12px 0px 0px rgba(58, 0, 29, 1)',
  },
} as const;

export const cardStyles = {
  base: 'bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] transition-all',
  interactive:
    'bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer',
  padding: { sm: 'p-4', md: 'p-6', lg: 'p-8' },
} as const;

export const buttonStyles = {
  primary:
    'bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 uppercase',
  secondary:
    'bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 uppercase',
  outline:
    'bg-white text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:bg-cream hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 uppercase',
  size: { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' },
} as const;

export const badgeStyles = {
  status: {
    success:
      'inline-flex px-3 py-1.5 bg-matcha text-ink font-black text-xs rounded-full border-2 border-ink uppercase',
    warning:
      'inline-flex px-3 py-1.5 bg-thai-tea text-white font-black text-xs rounded-full border-2 border-ink uppercase',
    error:
      'inline-flex px-3 py-1.5 bg-strawberry text-white font-black text-xs rounded-full border-2 border-ink uppercase',
    info: 'inline-flex px-3 py-1.5 bg-taro text-white font-black text-xs rounded-full border-2 border-ink uppercase',
  },
} as const;

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
