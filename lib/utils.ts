export const clone = (state: any) => JSON.parse(JSON.stringify(state))

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m
}
