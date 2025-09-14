import { Transform } from 'class-transformer';

export function LowerCase() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
}
