// Join class names: cx('a', {b: true, c: false}) -> 'a b'
export default function cx(...parts) {
  return parts.flatMap(part => part && typeof part === 'object'
    ? Object.keys(part).filter(name => part[name])
    : part ? [part] : []
  ).join(' ')
}
