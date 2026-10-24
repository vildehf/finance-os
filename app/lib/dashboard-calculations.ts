// Beregner prosentvis endring mellom to verdier.
// Returnerer 0 hvis forrige verdi er 0, slik at vi unngår deling på 0.
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
) {
  if (previousValue === 0) {
    return 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}
