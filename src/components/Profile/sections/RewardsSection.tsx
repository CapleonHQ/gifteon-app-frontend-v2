'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Copy, Users, ChevronLeft, Trophy, Check } from 'lucide-react'
import {
  useRewardsBalance,
  useRewardsHistory,
  useReferralsHistory,
} from '@/hooks/tanstack/rewards'
import { useProfile } from '@/hooks/tanstack/account'
import GiftsPagination from '@/components/Gifts/GiftsPage/GiftsPagination'
import RedeemModal from '@/components/Profile/sections/rewards/RedeemModal'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatRelativeTimeOrDate } from '@/lib/utils/dateTime'
import {
  REWARDS_HISTORY_LIMIT,
  humanizeRewardAction,
  getRewardActionIcon,
} from '@/lib/utils/rewards'

const RewardsSection = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rewards' | 'referrals'>(
    'rewards',
  )
  const [page, setPage] = useState(1)
  const [isRedeemOpen, setIsRedeemOpen] = useState(false)
  const [copied, setCopied] = useState<'code' | 'link' | null>(null)

  const balanceQuery = useRewardsBalance()
  const historyQuery = useRewardsHistory({ page, limit: REWARDS_HISTORY_LIMIT })
  const referralsQuery = useReferralsHistory()
  const profileQuery = useProfile()

  const balance = balanceQuery.data?.data
  const historyItems = historyQuery.data?.data ?? []
  const historyPagination = historyQuery.data?.meta?.pagination
  const referralsData = referralsQuery.data?.data
  const userTag = profileQuery.data?.data?.giftseonTag ?? ''

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://giftseon.com'
  const referralLink = userTag ? `${origin}/register?ref=${userTag}` : ''

  const handleCopy = (text: string, type: 'code' | 'link') => {
    if (!text) return
    navigator.clipboard.writeText(text).catch(() => undefined)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const progressPercent = balance
    ? Math.min(
        100,
        (balance.totalCoins /
          (balance.totalCoins + balance.nextRank.pointsNeeded)) *
          100,
      )
    : 0

  return (
    <div className='flex flex-col gap-6 px-4 lg:px-0 pb-10 pt-4 lg:pt-0'>
      {/* Back link */}
      <Link
        href='/profile'
        className='flex items-center gap-1.5 text-sm text-grey-500 hover:text-grey-900 transition-colors w-fit'
      >
        <ChevronLeft className='w-4 h-4' />
        Back to Profile
      </Link>

      {/* Page header */}
      <div>
        <h2 className='text-xl font-bold text-grey-900'>Rewards & Referrals</h2>
        <p className='text-sm text-grey-500 mt-0.5'>
          Earn coins for every action and redeem for cash
        </p>
      </div>

      {/* Underline tabs */}
      <div className='flex border-b border-grey-100'>
        {(['rewards', 'referrals'] as const).map((tab) => (
          <button
            key={tab}
            type='button'
            onClick={() => setActiveSubTab(tab)}
            className={`relative px-5 py-2.5 text-sm font-medium transition-colors ${
              activeSubTab === tab
                ? 'text-primary-600'
                : 'text-grey-500 hover:text-grey-800'
            }`}
          >
            {tab === 'rewards' ? 'Rewards' : 'Referrals'}
            {activeSubTab === tab && (
              <motion.div
                layoutId='tab-underline'
                className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full'
              />
            )}
          </button>
        ))}
      </div>

      {activeSubTab === 'rewards' && (
        <motion.div
          key='rewards'
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className='flex flex-col gap-5'
        >
          {/* Hero balance card */}
          {balanceQuery.isLoading ? (
            <div className='rounded-2xl p-6 animate-pulse h-44 bg-grey-100' />
          ) : balanceQuery.isError ? (
            <div className='bg-white border border-grey-100 rounded-2xl p-5 flex flex-col gap-2'>
              <p className='text-sm text-grey-500'>Can&apos;t load rewards</p>
              <button
                type='button'
                onClick={() => void balanceQuery.refetch()}
                className='text-sm text-primary-500 hover:underline self-start'
              >
                Retry
              </button>
            </div>
          ) : (
            <div
              className='rounded-2xl p-6 flex flex-col gap-5 text-white relative overflow-hidden'
              style={{
                background:
                  'radial-gradient(ellipse at 80% 30%, #6366f1 0%, #4f46e5 40%, #312e81 100%)',
              }}
            >
              {/* Decorative rings */}
              <svg
                className='absolute right-0 top-0 opacity-10 pointer-events-none'
                width='180'
                height='180'
                viewBox='0 0 180 180'
                fill='none'
              >
                <circle
                  cx='150'
                  cy='30'
                  r='60'
                  stroke='white'
                  strokeWidth='1.5'
                />
                <circle
                  cx='150'
                  cy='30'
                  r='100'
                  stroke='white'
                  strokeWidth='1'
                />
              </svg>

              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs text-white/60 uppercase tracking-widest font-medium'>
                    Your Coins
                  </p>
                  <p className='text-4xl font-bold mt-1 tabular-nums'>
                    {balance?.totalCoins.toLocaleString() ?? '0'}
                  </p>
                  <p className='text-sm text-white/70 mt-0.5'>
                    {balance?.redeemableCoins.toLocaleString() ?? '0'}{' '}
                    redeemable
                  </p>
                </div>

                {balance && (
                  <span
                    className='px-3 py-1 rounded-full text-xs font-bold text-white ring-1 ring-white/20 shrink-0'
                    style={{
                      backgroundColor: balance.badgeColor + '33',
                      color: 'white',
                    }}
                  >
                    {balance.currentRank}
                  </span>
                )}
              </div>

              {/* Rank progress */}
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between text-xs text-white/70'>
                  <span>{balance?.currentRank}</span>
                  <span>{balance?.nextRank.name}</span>
                </div>
                <div className='w-full h-1.5 bg-white/20 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-white rounded-full transition-all duration-700'
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className='text-xs text-white/60'>
                  {balance?.nextRank.pointsNeeded.toLocaleString() ?? 0} pts to
                  reach{' '}
                  <span className='text-white/90 font-medium'>
                    {balance?.nextRank.name}
                  </span>
                </p>
              </div>

              <button
                type='button'
                onClick={() => setIsRedeemOpen(true)}
                disabled={!balance || balance.redeemableCoins === 0}
                className={`self-start px-5 py-2 rounded-xl text-sm font-semibold text-indigo-900 bg-white transition-all ${
                  balance && balance.redeemableCoins > 0
                    ? 'hover:bg-white/90 active:scale-95'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Redeem Coins
              </button>
            </div>
          )}

          {/* Rewards History */}
          <div className='bg-white border border-grey-100 rounded-2xl overflow-hidden'>
            <div className='px-5 py-4 border-b border-grey-50'>
              <h4 className='text-sm font-semibold text-grey-900'>
                Activity History
              </h4>
            </div>

            {historyQuery.isLoading ? (
              <div className='px-5 py-4 flex flex-col divide-y divide-grey-50'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-3 py-3.5 animate-pulse'
                  >
                    <div className='w-9 h-9 rounded-xl bg-grey-100 shrink-0' />
                    <div className='flex-1 flex flex-col gap-1.5'>
                      <div className='h-3 w-40 bg-grey-100 rounded' />
                      <div className='h-2.5 w-24 bg-grey-100 rounded' />
                    </div>
                    <div className='h-3 w-14 bg-grey-100 rounded' />
                  </div>
                ))}
              </div>
            ) : historyQuery.isError ? (
              <div className='px-5 py-5 text-sm text-grey-500'>
                Unable to load history.{' '}
                <button
                  type='button'
                  onClick={() => void historyQuery.refetch()}
                  className='text-primary-500 hover:underline'
                >
                  Retry
                </button>
              </div>
            ) : historyItems.length === 0 ? (
              <div className='px-5 py-12 flex flex-col items-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-grey-50 flex items-center justify-center'>
                  <Trophy className='w-5 h-5 text-grey-300' />
                </div>
                <p className='text-sm text-grey-400'>
                  No activity yet — start earning!
                </p>
              </div>
            ) : (
              <>
                <div className='divide-y divide-grey-50'>
                  {historyItems.map((item) => {
                    const Icon = getRewardActionIcon(item.kpiAction)
                    return (
                      <div
                        key={item.id}
                        className='flex items-center gap-3 px-5 py-3.5'
                      >
                        <div className='w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0'>
                          <Icon className='h-4 w-4 text-primary-500' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-grey-900'>
                            {humanizeRewardAction(item.kpiAction)}
                          </p>
                          <p className='text-xs text-grey-400 mt-0.5'>
                            {formatRelativeTimeOrDate(item.createdAt)}
                          </p>
                        </div>
                        <div className='flex flex-col items-end gap-0.5 shrink-0'>
                          <span className='text-sm font-semibold text-success-600'>
                            +{item.coinsEarned}
                            <span className='text-xs font-normal ml-0.5'>
                              coins
                            </span>
                          </span>
                          <span className='text-xs text-grey-400'>
                            +{item.rankPointsEarned} pts
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {historyPagination && historyPagination.totalPages > 1 && (
                  <GiftsPagination
                    total={historyPagination.total}
                    limit={REWARDS_HISTORY_LIMIT}
                    offset={(page - 1) * REWARDS_HISTORY_LIMIT}
                    onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() =>
                      setPage((p) =>
                        Math.min(historyPagination.totalPages, p + 1),
                      )
                    }
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {activeSubTab === 'referrals' && (
        <motion.div
          key='referrals'
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className='flex flex-col gap-5'
        >
          {/* Stats strip */}
          {!referralsQuery.isLoading && !referralsQuery.isError && (
            <div className='bg-primary-50 border border-primary-100 rounded-2xl px-5 py-4 flex items-center gap-4'>
              <div className='w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0'>
                <Users className='w-5 h-5 text-primary-600' />
              </div>
              <div>
                <p className='text-2xl font-bold text-primary-700'>
                  {referralsData?.totalReferrals ?? 0}
                </p>
                <p className='text-xs text-primary-500 mt-0.5'>
                  {referralsData?.totalReferrals === 1 ? 'person' : 'people'}{' '}
                  joined using your code
                </p>
              </div>
            </div>
          )}

          {/* Referral code card */}
          {referralsQuery.isLoading ? (
            <div className='bg-white border border-grey-100 rounded-2xl p-5 animate-pulse h-44' />
          ) : referralsQuery.isError ? (
            <div className='bg-white border border-grey-100 rounded-2xl p-5'>
              <p className='text-sm text-grey-500'>
                Can&apos;t load referral data.{' '}
                <button
                  type='button'
                  onClick={() => void referralsQuery.refetch()}
                  className='text-primary-500 hover:underline'
                >
                  Retry
                </button>
              </p>
            </div>
          ) : (
            <div className='bg-white border border-grey-100 rounded-2xl p-5 flex flex-col gap-4'>
              <div>
                <h4 className='text-sm font-semibold text-grey-900'>
                  Your Referral Code
                </h4>
                <p className='text-xs text-grey-500 mt-0.5'>
                  Share your code — earn coins when friends sign up
                </p>
              </div>

              {/* Code display — click anywhere to copy */}
              <button
                type='button'
                onClick={() => handleCopy(userTag, 'code')}
                className={`w-full text-left relative rounded-xl px-4 py-3 transition-all duration-200 group ${
                  copied === 'code'
                    ? 'bg-success-50 ring-1 ring-success-200'
                    : 'bg-grey-50 hover:bg-grey-100'
                }`}
              >
                <span className='font-mono text-2xl font-bold text-grey-900 tracking-widest'>
                  {userTag || '—'}
                </span>
                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 group-hover:text-grey-600 transition-colors'>
                  {copied === 'code' ? (
                    <Check className='w-4 h-4 text-success-500' />
                  ) : (
                    <Copy className='w-4 h-4' />
                  )}
                </span>
              </button>

              {/* Share link — click anywhere to copy */}
              <button
                type='button'
                onClick={() => handleCopy(referralLink, 'link')}
                className={`w-full text-left relative rounded-xl px-3 py-2.5 transition-all duration-200 group ${
                  copied === 'link'
                    ? 'bg-success-50 ring-1 ring-success-200'
                    : 'bg-grey-50 hover:bg-grey-100'
                }`}
              >
                <span className='text-xs text-grey-500 font-mono pr-6 block truncate'>
                  {referralLink
                    ? referralLink.replace('https://', '')
                    : 'Loading...'}
                </span>
                <span className='absolute right-2.5 top-1/2 -translate-y-1/2 text-grey-400 group-hover:text-grey-600 transition-colors'>
                  {copied === 'link' ? (
                    <Check className='w-3.5 h-3.5 text-success-500' />
                  ) : (
                    <Copy className='w-3.5 h-3.5' />
                  )}
                </span>
              </button>
            </div>
          )}

          {/* Referred users list */}
          <div className='bg-white border border-grey-100 rounded-2xl overflow-hidden'>
            <div className='px-5 py-4 border-b border-grey-50'>
              <h4 className='text-sm font-semibold text-grey-900'>
                People You&apos;ve Referred
              </h4>
            </div>

            {referralsQuery.isLoading ? (
              <div className='divide-y divide-grey-50'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-3 px-5 py-3.5 animate-pulse'
                  >
                    <div className='w-9 h-9 rounded-full bg-grey-100 shrink-0' />
                    <div className='flex-1 flex flex-col gap-1.5'>
                      <div className='h-3 w-32 bg-grey-100 rounded' />
                      <div className='h-2.5 w-20 bg-grey-100 rounded' />
                    </div>
                    <div className='h-5 w-16 bg-grey-100 rounded-full' />
                  </div>
                ))}
              </div>
            ) : !referralsData?.referrals?.length ? (
              <div className='px-5 py-12 flex flex-col items-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-grey-50 flex items-center justify-center'>
                  <Users className='w-5 h-5 text-grey-300' />
                </div>
                <p className='text-sm text-grey-400'>No referrals yet</p>
                <p className='text-xs text-grey-400'>
                  Share your code to get started
                </p>
              </div>
            ) : (
              <div className='divide-y divide-grey-50'>
                {referralsData.referrals.map((referral) => {
                  const initials = referral.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <div
                      key={referral.id}
                      className='flex items-center gap-3 px-5 py-3.5'
                    >
                      <Avatar className='w-9 h-9 shrink-0'>
                        {referral.profilePicture && (
                          <AvatarImage
                            src={referral.profilePicture}
                            alt={referral.fullName}
                          />
                        )}
                        <AvatarFallback className='text-xs font-semibold text-grey-700 bg-grey-100'>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-grey-900 truncate'>
                          {referral.fullName}
                        </p>
                        <p className='text-xs text-grey-400'>@{referral.tag}</p>
                      </div>
                      <div className='flex flex-col items-end gap-1 shrink-0'>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.rewarded
                              ? 'bg-success-50 text-success-600'
                              : 'bg-grey-100 text-grey-500'
                          }`}
                        >
                          {referral.rewarded ? 'Rewarded' : 'Pending'}
                        </span>
                        <span className='text-xs text-grey-400'>
                          {formatRelativeTimeOrDate(referral.date)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      <RedeemModal
        isOpen={isRedeemOpen}
        onClose={() => setIsRedeemOpen(false)}
        redeemableCoins={balance?.redeemableCoins ?? 0}
      />
    </div>
  )
}

export default RewardsSection
