export function scrollToAnchor(id: string, extraOffset = 16): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const header = document.querySelector('header');
  const headerHeight = header?.getBoundingClientRect().height ?? 64;

  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReduced ? 'auto' : 'smooth',
  });
  return true;
}
