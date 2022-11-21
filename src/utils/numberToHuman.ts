export default function numberToHuman(number: number) {
  if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T'
  if (number >= 1e9) return +(number / 1e9).toFixed(1) + 'B'
  if (number >= 1e6) return +(number / 1e6).toFixed(1) + 'M'
  if (number >= 1e3) return +(number / 1e3).toFixed(1) + 'K'
  return (Math.round(number * 100) / 100).toString()
}
