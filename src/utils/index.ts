/**
 * Masks an email address for privacy while keeping it human-readable.
 *
 * The masking logic preserves:
 *  - The first character of the local part (before '@')
 *  - The last 4 characters before '@'
 *  - The domain (after '@')
 *
 * All characters between the first character and the last 4 characters
 * are replaced with asterisks ('*').
 *
 * Example:
 * ```ts
 * maskEmail('testemailth23@gmail.com')
 * // → "t********th23@gmail.com"
 * ```
 *
 * Edge cases:
 * - If the email has 2 or fewer characters before '@',
 *   it only keeps the first character and masks the rest.
 * - If the email is invalid or doesn't contain '@',
 *   it returns the original input.
 *
 * @param email - The email address to mask.
 * @returns The masked email string.
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email

  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    // For very short local parts, mask everything after the first character
    return (
      localPart[0] +
      '*'.repeat(Math.max(0, localPart.length - 1)) +
      '@' +
      domain
    )
  }

  const firstChar = localPart[0]
  const lastVisible = localPart.slice(-4)
  const maskedLength = Math.max(0, localPart.length - (1 + lastVisible.length))
  const masked = '*'.repeat(maskedLength)

  return `${firstChar}${masked}${lastVisible}@${domain}`
}
