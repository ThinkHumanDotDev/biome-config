import { a } from './a'
import { b } from './b'
export const f = (x: number) => {
  return [a(x), b(x), 'a string that is long enough to wrap past the hundred column limit']
}
