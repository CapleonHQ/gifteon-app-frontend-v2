'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type MobileBackContextValue = {
  onBack?: () => void
  setOnBack: (handler?: () => void) => void
}

const MobileBackContext = createContext<MobileBackContextValue | null>(null)

export const MobileBackProvider = ({ children }: { children: ReactNode }) => {
  const [onBack, setOnBack] = useState<(() => void) | undefined>(undefined)

  const value = useMemo(
    () => ({
      onBack,
      setOnBack,
    }),
    [onBack]
  )

  return (
    <MobileBackContext.Provider value={value}>
      {children}
    </MobileBackContext.Provider>
  )
}

export const useMobileBack = () => {
  const context = useContext(MobileBackContext)

  if (!context) {
    throw new Error('useMobileBack must be used within MobileBackProvider')
  }

  return context
}
