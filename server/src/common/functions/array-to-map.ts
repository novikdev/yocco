export function arrayToMap<T extends Record<string, any>, K extends keyof T>(
  data: T[],
  indexKey: K,
): Map<T[K], T> {
  return new Map(data.map((item) => [item[indexKey], item]));
}
