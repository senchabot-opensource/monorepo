import NextTopLoader from 'nextjs-toploader'

export function TopLoader() {
  return (
    <NextTopLoader
      height={2}
      color="#20ab8c"
      shadow={false}
      showSpinner={false}
    />
  )
}
