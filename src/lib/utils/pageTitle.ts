import { PAGE_TITLES } from '@/lib/constants/menu'

const DEFAULT_TITLE = 'Dashboard'

export const resolvePageTitle = (pathname: string) => {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname]
  }

  const matchedKey = Object.keys(PAGE_TITLES).find(
    (key) => pathname.startsWith(key) && key !== '/'
  )

  return matchedKey ? PAGE_TITLES[matchedKey] : DEFAULT_TITLE
}
