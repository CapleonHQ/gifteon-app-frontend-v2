import { Plus } from 'lucide-react'
import SectionCard from '@/components/Profile/components/SectionCard'

import PaymentMethodCard from '@/components/Profile/components/PaymentMethodCard'
import type { PaymentMethod } from '@/types/Profile/payment'

type PaymentMethodsSectionProps = {
  methods: PaymentMethod[]
  onAddAccount: () => void
  onDelete: (method: PaymentMethod) => void
}

const PaymentMethodsSection = ({
  methods,
  onAddAccount,
  onDelete,
}: PaymentMethodsSectionProps) => {
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
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 grid lg:grid-cols-2 gap-x-4 xl:gap-x-8 gap-y-5'>
        {methods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onDelete={onDelete}
          />
        ))}
      </div>
    </SectionCard>
  )
}

export default PaymentMethodsSection
