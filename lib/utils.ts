export const clone = (state: any) => JSON.parse(JSON.stringify(state))

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m
}

export const sanitize = (input: string): string => {
  return input.replace(/\t/g, '').replace(/  /g, '')
}
