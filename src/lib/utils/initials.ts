export const getInitials = (name: string, email?: string) => {
  const trimmed = name.trim()
  if (trimmed) {
    const parts = trimmed.split(' ').filter(Boolean)
    const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase())
    return letters.join('')
  }
  return email?.slice(0, 2).toUpperCase()
}
