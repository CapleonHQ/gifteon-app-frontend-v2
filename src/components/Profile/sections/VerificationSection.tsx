import SectionCard from '@/components/Profile/components/SectionCard'
import { useKycStatus } from '@/hooks/tanstack/kyc'
import { formatCurrency } from '@/lib/utils/currency'
import ShakeOnError from '@/components/common/ShakeOnError'

type VerificationSectionProps = {
  onOpenKyc: () => void
}

const VerificationSection = ({ onOpenKyc }: VerificationSectionProps) => {
  const kycStatusQuery = useKycStatus()
  const kycStatus = kycStatusQuery.data?.data
  const kycLevel = kycStatus?.kycLevel ?? 0
  const hasCompletedKyc = kycLevel >= 3

  const statusText =
    (kycStatus?.overallStatus || 'not_started').replace(/_/g, ' ') || 'Not started'

  const actionLabel = hasCompletedKyc ? 'View KYC' : 'Update KYC'

  return (
    <SectionCard
      title='Verification'
      description='Complete KYC to increase your withdrawal limit.'
      action={
        <button
          type='button'
          onClick={onOpenKyc}
          className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[120px]'
        >
          {actionLabel}
        </button>
      }
    >
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-4 lg:pb-6 pt-4'>
        {kycStatusQuery.isLoading ? (
          <div className='animate-pulse space-y-2'>
            <div className='h-3 w-1/2 rounded bg-grey-100' />
            <div className='h-3 w-2/3 rounded bg-grey-100' />
            <div className='h-3 w-1/3 rounded bg-grey-100' />
          </div>
        ) : kycStatusQuery.isError ? (
          <div className='space-y-3'>
            <ShakeOnError active={true}>
              <p className='text-sm text-error-500'>
                Unable to load verification status.
              </p>
            </ShakeOnError>
            <button
              type='button'
              onClick={() => kycStatusQuery.refetch()}
              className='text-sm text-primary-500 underline underline-offset-2'
            >
              Retry
            </button>
          </div>
        ) : (
          <div className='grid gap-2 text-sm'>
            <p className='text-grey-700'>
              Current level:{' '}
              <span className='font-medium text-blackish'>
                {kycLevel < 1 ? 'Unverified' : `Level ${kycLevel}`}
              </span>
            </p>
            <p className='text-grey-700'>
              Status:{' '}
              <span className='font-medium text-blackish capitalize'>
                {statusText}
              </span>
            </p>
            <p className='text-grey-700'>
              Withdrawal limit:{' '}
              <span className='font-medium text-blackish'>
                {formatCurrency(kycStatus?.withdrawalLimit ?? 0, {
                  currency: 'NGN',
                  maximumFractionDigits: 0,
                })}
              </span>
            </p>
            {hasCompletedKyc ? (
              <p className='text-success-700'>
                KYC is complete for your current withdrawal tier.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </SectionCard>
  )
}

export default VerificationSection
