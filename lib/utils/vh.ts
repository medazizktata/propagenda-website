export function setViewportHeight() {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
