export function calculatePerimeter (lengths: number[]): number {
  return lengths.reduce((sum, length) => sum + length, 0);
}
