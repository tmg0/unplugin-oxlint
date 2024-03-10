export function until(value: () => any, truthyValue: any = true, ms: number = 500): Promise<void> {
  return new Promise((resolve) => {
    function c() {
      if (value() === truthyValue)
        resolve()
      else
        setTimeout(c, ms)
    }
    c()
  })
}
