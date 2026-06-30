'use client'

import { motion } from 'framer-motion'
import { Check, HelpCircle, ListChecks, Ticket } from 'lucide-react'
import TemplateSelectionFooter from '@/components/Gifts/CreateNewGiftPage/TemplateSelectionFooter'
import { CATEGORY_META } from '@/components/Giveaways/utils'
import type { GiveawayCategory } from '@/types/Giveaways'

const CATEGORIES: Array<{ value: GiveawayCategory; Icon: typeof HelpCircle }> = [
  { value: 'trivia', Icon: HelpCircle },
  { value: 'task', Icon: ListChecks },
  { value: 'lottery', Icon: Ticket },
]

type CategoryStepProps = {
  totalSteps: number
  selected: GiveawayCategory | null
  onSelect: (category: GiveawayCategory) => void
  onContinue: () => void
}

const CategoryStep = ({
  totalSteps,
  selected,
  onSelect,
  onContinue,
}: CategoryStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <div className='mb-6'>
        <p className='text-xs font-medium uppercase tracking-[0.18em] text-primary-500'>
          Step 1 of {totalSteps}
        </p>
        <h2 className='mt-2 text-2xl font-semibold text-blackish'>
          Choose a giveaway type
        </h2>
        <p className='mt-2 max-w-2xl text-sm leading-6 text-grey-700'>
          Pick how people will participate to win your prize. This shapes the
          rest of the setup.
        </p>
      </div>

      <div className='mb-8 grid grid-cols-1 gap-5 md:grid-cols-3'>
        {CATEGORIES.map(({ value, Icon }) => {
          const meta = CATEGORY_META[value]
          const isSelected = selected === value
          return (
            <button
              key={value}
              type='button'
              onClick={() => onSelect(value)}
              className='group relative rounded-[20px] text-left transition-all'
            >
              {isSelected ? (
                <div className='absolute -right-1 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-success-400'>
                  <Check className='h-3 w-3 text-white' strokeWidth={3} />
                </div>
              ) : null}
              <div
                className={`flex h-full flex-col rounded-[20px] border bg-white p-5 transition-all ${
                  isSelected
                    ? 'border-success-400 shadow-[0px_1.5px_4px_-1px_#10192812]'
                    : 'border-grey-100 hover:border-grey-200 hover:shadow-[0px_12px_24px_-18px_#10192830]'
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${meta.tile}`}
                >
                  <Icon className='h-6 w-6' />
                </span>
                <h3 className='mt-4 text-lg font-semibold text-blackish'>
                  {meta.label}
                </h3>
                <p className='mt-1.5 text-sm leading-6 text-grey-700'>
                  {meta.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <TemplateSelectionFooter
        canContinue={Boolean(selected)}
        onContinue={onContinue}
        ctaLabel='Continue'
      />
    </motion.div>
  )
}

export default CategoryStep
