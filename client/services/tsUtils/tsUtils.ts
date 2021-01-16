export type NotOptional<T, K extends keyof T> = {
  [P in K]-?: T[P];
};
