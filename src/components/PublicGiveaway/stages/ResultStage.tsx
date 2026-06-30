'use client'

import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { PartyPopper, Target, Ticket } from 'lucide-react'
import ConfettiBurst from '@/components/PublicGiveaway/components/ConfettiBurst'
import type { GiveawayCategory } from '@/types/Giveaways'

type ResultStageProps = {
  category: GiveawayCategory
  score?: number
  celebrate: boolean
  onShare: () => void
  onViewLeaderboard: () => void
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value])
  return <span className='tabular-nums'>{display}</span>
}

const ResultStage = ({
  category,
  score,
  celebrate,
  onShare,
  onViewLeaderboard,
}: ResultStageProps) => {
  const isTrivia = category === 'trivia'
  const ResultIcon =
    category === 'lottery' ? Ticket : isTrivia ? Target : PartyPopper

  return (
    <div className='relative flex flex-col items-center text-center gap-5 max-w-md mx-auto w-full py-6'>
      <ConfettiBurst active={celebrate} />

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className='w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-primary-600'
      >
        <ResultIcon className='h-9 w-9' />
      </motion.div>

      {isTrivia ? (
        <div className='flex flex-col items-center gap-1'>
          <span className='text-sm text-grey-500'>Your score</span>
          <span className='text-5xl font-semibold text-primary-600'>
            <AnimatedNumber value={score ?? 0} />
          </span>
        </div>
      ) : (
        <div className='flex flex-col gap-1'>
          <h2 className='text-2xl font-semibold text-grey-900'>You&apos;re in!</h2>
          <p className='text-sm text-grey-600'>
            Your entry has been recorded. Good luck!
          </p>
        </div>
      )}

      {isTrivia ? (
        <p className='text-sm text-grey-600'>
          Thanks for playing! Winners are based on the highest scores.
        </p>
      ) : null}

      <div className='flex flex-col sm:flex-row items-center gap-3 w-full'>
        <button
          type='button'
          onClick={onViewLeaderboard}
          className='w-full sm:flex-1 py-3 rounded-[12px] bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors'
        >
          View leaderboard
        </button>
        <button
          type='button'
          onClick={onShare}
          className='w-full sm:flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 text-sm font-medium hover:bg-grey-50 transition-colors'
        >
          Share
        </button>
      </div>
    </div>
  )
}

export default ResultStage
