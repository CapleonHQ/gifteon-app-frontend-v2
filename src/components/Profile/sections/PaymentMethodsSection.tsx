import { Plus } from 'lucide-react'
import SectionCard from '@/components/Profile/components/SectionCard'

import PaymentMethodCard from '@/components/Profile/components/PaymentMethodCard'
import type { PaymentMethod } from '@/types/Profile/payment'

type PaymentMethodsSectionProps = {
  methods: PaymentMethod[]
  onAddAccount: () => void
  onDelete: (method: PaymentMethod) => void
  onSetDefault: (method: PaymentMethod) => void
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

const PaymentMethodsSection = ({
  methods,
  onAddAccount,
  onDelete,
  onSetDefault,
  isLoading = false,
  hasError = false,
  onRetry,
}: PaymentMethodsSectionProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 grid lg:grid-cols-2 gap-x-4 xl:gap-x-8 gap-y-5 animate-pulse'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className='flex items-center justify-between gap-4 rounded-[10px] border border-grey-50 bg-white p-3'
            >
              <div className='flex items-center gap-2'>
                <div className='w-10 h-7 rounded-md bg-grey-100' />
                <div className='space-y-1.5'>
                  <div className='h-3.5 w-24 rounded bg-grey-100' />
                  <div className='h-3 w-20 rounded bg-grey-100' />
                </div>
              </div>
              <div className='h-8 w-8 rounded-full bg-grey-100' />
            </div>
          ))}
        </div>
      )
    }

    if (hasError) {
      return (
        <div className='border-t border-grey-50 px-3 lg:px-6 py-8 text-center'>
          <p className='text-base font-medium text-error-500'>
            We couldn&apos;t load your payment methods.
          </p>
          <p className='mt-1 text-sm text-grey-700'>
            Check your connection and try again.
          </p>
          <button
            type='button'
            onClick={onRetry}
            className='mt-4 inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 transition-colors duration-200'
          >
            Retry
          </button>
        </div>
      )
    }

    if (methods.length === 0) {
      return (
        <div className='border-t border-grey-50 px-3 lg:px-6 py-8 text-center'>
          <p className='text-base font-medium text-blackish'>
            No payment methods yet
          </p>
          <p className='mt-1 text-sm text-grey-700'>
            Add a bank account to start receiving withdrawals.
          </p>
        </div>
      )
    }

    return (
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 grid lg:grid-cols-2 gap-x-4 xl:gap-x-8 gap-y-5'>
        {methods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onDelete={onDelete}
            onSetDefault={onSetDefault}
          />
        ))}
      </div>
    )
  }

  return (
    <SectionCard
      title='Payment Methods'
      description='Securely save your card details for hassle-free withdrawals'
      action={
        <button
          type='button'
          onClick={onAddAccount}
          className='inline-flex items-center gap-1.5 rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors'
        >
          <Plus className='w-4 h-4' />
          <span className='hidden lg:inline-flex'>Add New Account</span>
          <span className='lg:hidden'>Add</span>
        </button>
      }
    >
      {renderContent()}
    </SectionCard>
  )
}

export default PaymentMethodsSection
