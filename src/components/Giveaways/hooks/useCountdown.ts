'use client'

import { useEffect, useState } from 'react'
import {
  getCountdownState,
  type CountdownState,
} from '@/components/Giveaways/utils'
import type { Giveaway } from '@/types/Giveaways'

export const useCountdown = (
  giveaway: Pick<Giveaway, 'startsAt' | 'endsAt'>
): CountdownState => {
  const [state, setState] = useState<CountdownState>(() =>
    getCountdownState(giveaway)
  )

  useEffect(() => {
    const tick = () => setState(getCountdownState(giveaway))
    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [giveaway])

  return state
}
