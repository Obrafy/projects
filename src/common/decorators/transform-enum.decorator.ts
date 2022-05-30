import { Transform } from 'class-transformer';

export const TransformEnum = <T, G>(to: T, from: G) => {
  return Transform(({ value }) => to[from[value]]);
};
