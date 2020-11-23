let idCounter = 0;

export function uniqueId(prefix: string) {
  var id = ++idCounter;
  return prefix + id;
}
