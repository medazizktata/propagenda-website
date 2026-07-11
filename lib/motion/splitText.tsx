export function splitIntoChars(text: string, className = 'char inline-block') {
  return text.split('').map((char, i) => (
    <span key={`${char}-${i}`} className={className} aria-hidden={char === ' ' ? undefined : undefined}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

export function splitIntoWords(text: string, className = 'inline-block') {
  return text.split(' ').map((word, i) => (
    <span key={`${word}-${i}`} className={`${className} mr-[0.25em]`}>
      {word}
    </span>
  ));
}
