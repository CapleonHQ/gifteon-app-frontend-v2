'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type ConfettiBurstProps = {
  active: boolean
  pieces?: number
}

const COLORS = ['#1a1abc', '#099137', '#dd900d', '#1671d9', '#cb1a14', '#a6dae8']

// Deterministic pseudo-random in [0,1) — pure, so it is safe during render.
const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Lightweight transform/opacity-only confetti — no heavy libraries.
const ConfettiBurst = ({ active, pieces = 28 }: ConfettiBurstProps) => {
  const reduce = useReducedMotion()

  const items = useMemo(
    () =>
      Array.from({ length: pieces }).map((_, index) => ({
        left: seeded(index + 1) * 100,
        delay: seeded(index + 2) * 0.2,
        duration: 1.1 + seeded(index + 3) * 0.9,
        rotate: (seeded(index + 4) - 0.5) * 720,
        drift: (seeded(index + 5) - 0.5) * 160,
        color: COLORS[index % COLORS.length],
        size: 6 + seeded(index + 6) * 6,
      })),
    [pieces]
  )

  if (!active || reduce) return null

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden z-20'>
      {items.map((piece, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
          animate={{ opacity: 0, y: '100vh', x: piece.drift, rotate: piece.rotate }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.6,
            borderRadius: 2,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiBurst
