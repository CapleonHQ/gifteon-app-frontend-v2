'use client'

import { useState } from 'react'
import { WALLET_BALANCE_VISIBILITY_KEY } from '@/components/Wallet/utils'

export const useWalletBalanceVisibility = () => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      window.localStorage.getItem(WALLET_BALANCE_VISIBILITY_KEY) === 'true'
    )
  })

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => {
      const nextValue = !prev

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          WALLET_BALANCE_VISIBILITY_KEY,
          String(nextValue)
        )
      }

      return nextValue
    })
  }

  return {
    isBalanceHidden,
    toggleBalanceVisibility,
  }
}
