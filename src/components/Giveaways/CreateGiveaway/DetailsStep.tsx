'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InlineError } from '@/components/Stores/Bills/config'
import TemplateSelectionFooter from '@/components/Gifts/CreateNewGiftPage/TemplateSelectionFooter'
import BillsDatePickerField from '@/components/Stores/Bills/components/BillsDatePickerField'
import BillsTimePickerField from '@/components/Stores/Bills/components/BillsTimePickerField'
import { CURRENCY_SYMBOL_MAP, formatAmountDigits } from '@/lib/utils/currency'
import { combineDateTime, isoToDate, isoToTime } from '@/lib/utils/dateTime'
import {
  GIVEAWAY_CURRENCIES,
  GIVEAWAY_PRIZE_TYPES,
} from '@/lib/constants/giveaways'
import type { DraftFieldErrors } from './helpers'
import type { GiveawayDraft } from './types'
import type { GiveawayPrizeType } from '@/types/Giveaways'

type DetailsStepProps = {
  totalSteps: number
  draft: GiveawayDraft
  update: (patch: Partial<GiveawayDraft>) => void
  errors: DraftFieldErrors
  onBack: () => void
  onContinue: () => void
}

const LABEL_CLASS = 'text-xs font-medium text-grey-700'
const fieldClass = (hasError?: boolean) =>
  `w-full px-3 py-3 border ${
    hasError ? 'border-error-300' : 'border-grey-50'
  } rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300`

const DetailsStep = ({
  totalSteps,
  draft,
  update,
  errors,
  onBack,
  onContinue,
}: DetailsStepProps) => {
  const symbol = CURRENCY_SYMBOL_MAP[draft.prizeCurrency] ?? draft.prizeCurrency

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-[0.18em] text-primary-500'>
            Step 2 of {totalSteps}
          </p>
          <h2 className='mt-2 text-2xl font-semibold text-blackish'>
            Giveaway details
          </h2>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-grey-700'>
            Set the prize, participation limits, and the schedule.
          </p>
        </div>
        <button
          type='button'
          onClick={onBack}
          className='inline-flex w-fit items-center gap-1 self-start rounded-[10px] border border-grey-200 bg-white px-3 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50 sm:self-auto'
        >
          <ChevronLeft className='h-4 w-4' />
          Back
        </button>
      </div>

      <div className='mb-5 flex flex-col gap-4 rounded-[20px] border border-grey-100 bg-white p-5'>
        <div className='space-y-1.5'>
          <p className={LABEL_CLASS}>Title</p>
          <input
            type='text'
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder='e.g. Gifteon Trivia Challenge'
            className={fieldClass(Boolean(errors.title))}
          />
          <InlineError message={errors.title} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <p className={LABEL_CLASS}>Prize type</p>
            <Select
              value={draft.prizeType}
              onValueChange={(value) =>
                update({ prizeType: value as GiveawayPrizeType })
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select prize type' />
              </SelectTrigger>
              <SelectContent>
                {GIVEAWAY_PRIZE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1.5'>
            <p className={LABEL_CLASS}>Currency</p>
            <Select
              value={draft.prizeCurrency}
              onValueChange={(value) => update({ prizeCurrency: value })}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select currency' />
              </SelectTrigger>
              <SelectContent>
                {GIVEAWAY_CURRENCIES.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    disabled={!currency.enabled}
                  >
                    {currency.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-1.5'>
          <p className={LABEL_CLASS}>Prize value</p>
          <div
            className={`flex items-center gap-2 px-3 py-3 border rounded-xl bg-white focus-within:ring-1 focus-within:ring-primary-300 ${
              errors.prizeValue ? 'border-error-300' : 'border-grey-50'
            }`}
          >
            <span className='text-sm font-medium text-grey-500 shrink-0'>
              {symbol}
            </span>
            <input
              type='text'
              inputMode='numeric'
              value={formatAmountDigits(draft.prizeValue)}
              onChange={(e) =>
                update({ prizeValue: e.target.value.replace(/\D/g, '') })
              }
              placeholder='e.g. 5,000'
              className='flex-1 min-w-0 bg-transparent text-sm text-grey-800 placeholder:text-grey-500 focus:outline-none'
            />
          </div>
          <div className='flex flex-wrap gap-2 pt-1'>
            {[1000, 5000, 10000, 50000].map((quick) => (
              <button
                key={quick}
                type='button'
                onClick={() => update({ prizeValue: String(quick) })}
                className='rounded-full border border-grey-200 bg-white px-2.5 py-1 text-xs font-medium text-grey-700 hover:border-primary-200 hover:text-primary-600 transition'
              >
                {quick.toLocaleString()}
              </button>
            ))}
          </div>
          <InlineError message={errors.prizeValue} />
        </div>

        <div className='space-y-1.5'>
          <p className={LABEL_CLASS}>Prize description</p>
          <input
            type='text'
            value={draft.prizeDescription}
            onChange={(e) => update({ prizeDescription: e.target.value })}
            placeholder='e.g. ₦5,000 cash prize'
            className={fieldClass(Boolean(errors.prizeDescription))}
          />
          <InlineError message={errors.prizeDescription} />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <p className={LABEL_CLASS}>Number of winners</p>
            <input
              type='text'
              inputMode='numeric'
              value={formatAmountDigits(draft.winnerCount)}
              onChange={(e) =>
                update({ winnerCount: e.target.value.replace(/\D/g, '') })
              }
              placeholder='1'
              className={fieldClass(Boolean(errors.winnerCount))}
            />
            <InlineError message={errors.winnerCount} />
          </div>
          <div className='space-y-1.5'>
            <p className={LABEL_CLASS}>Max participants</p>
            <input
              type='text'
              inputMode='numeric'
              value={formatAmountDigits(draft.maxParticipants)}
              onChange={(e) =>
                update({ maxParticipants: e.target.value.replace(/\D/g, '') })
              }
              placeholder='100'
              className={fieldClass(Boolean(errors.maxParticipants))}
            />
            <InlineError message={errors.maxParticipants} />
          </div>
        </div>

        <div className='space-y-2'>
          <p className={LABEL_CLASS}>Starts at</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <BillsDatePickerField
              label=''
              value={isoToDate(draft.startsAt)}
              minDate={new Date()}
              onChange={(date) =>
                update({
                  startsAt: combineDateTime(date, isoToTime(draft.startsAt)),
                })
              }
            />
            <BillsTimePickerField
              label=''
              value={isoToTime(draft.startsAt)}
              onChange={(time) =>
                update({
                  startsAt: combineDateTime(isoToDate(draft.startsAt), time),
                })
              }
            />
          </div>
          <InlineError message={errors.startsAt} />
        </div>

        <div className='space-y-2'>
          <p className={LABEL_CLASS}>Ends at</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <BillsDatePickerField
              label=''
              value={isoToDate(draft.endsAt)}
              minDate={isoToDate(draft.startsAt) ?? new Date()}
              onChange={(date) =>
                update({ endsAt: combineDateTime(date, isoToTime(draft.endsAt)) })
              }
            />
            <BillsTimePickerField
              label=''
              value={isoToTime(draft.endsAt)}
              onChange={(time) =>
                update({ endsAt: combineDateTime(isoToDate(draft.endsAt), time) })
              }
            />
          </div>
          <InlineError message={errors.endsAt} />
        </div>
      </div>

      <TemplateSelectionFooter
        canContinue
        onContinue={onContinue}
        ctaLabel='Continue'
      />
    </motion.div>
  )
}

export default DetailsStep
