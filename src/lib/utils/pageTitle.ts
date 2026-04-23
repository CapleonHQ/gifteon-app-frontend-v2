import { PAGE_TITLE_ROUTES } from '@/lib/constants/menu'

const DEFAULT_TITLE = 'Dashboard'

export const resolvePageTitle = (pathname: string): string => {
  const cleanPath = pathname.split('?')[0] // remove query params

  const matchedRoute = PAGE_TITLE_ROUTES.find((route) =>
    route.pattern.test(cleanPath)
  )

  return matchedRoute?.title ?? DEFAULT_TITLE
}
