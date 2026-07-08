import ShakeOnError from '@/components/common/ShakeOnError'
import type { BillsTabKey } from './constants'

export const TAB_META: Record<BillsTabKey, { title: string; description: string }> = {
  airtime: {
    title: 'Buy Airtime',
    description: 'Top up numbers or send airtime gifts in one builder.',
  },
  data: {
    title: 'Buy Data',
    description: 'Select data plans and configure each recipient independently.',
  },
  electricity: {
    title: 'Pay Electricity Bill',
    description: 'Pay instantly or configure scheduled and recurring bill actions.',
  },
  cable_tv: {
    title: 'Subscribe Cable TV',
    description: 'Handle one or many subscriptions with independent timing rules.',
  },
}

export const InlineError = ({ message }: { message?: string }) =>
  message ? (
    <ShakeOnError active={true}>
      <p className='text-xs text-error-600 mt-1'>{message}</p>
    </ShakeOnError>
  ) : null
