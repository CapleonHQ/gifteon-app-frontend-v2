import CloseIcon from '@/assets/icons/CloseIcon'
import DeleteIcon from '@/assets/icons/DeleteIcon'
import type { PaymentMethod } from '@/types/Profile/payment'

type DeletePaymentModalProps = {
  target: PaymentMethod | null
  onClose: () => void
  onDelete: () => void
}

const DeletePaymentModal = ({
  target,
  onClose,
  onDelete,
}: DeletePaymentModalProps) => {
  if (!target) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[500px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-3 sm:px-10 py-12 text-center'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
          aria-label='Close'
        >
          <span className='text-grey-700 w-5 h-5'>
            <CloseIcon />
          </span>
        </button>
        <div className='flex flex-col gap-5 lg:gap-6'>
          <div className='flex flex-col gap-3 items-center justify-center'>
            <div className='w-[100px] h-[100px] rounded-full bg-error-50 flex items-center justify-center'>
              <div className='w-20 h-20 rounded-full bg-error-100 flex items-center justify-center'>
                <div className='w-[60px] h-[60px] rounded-full bg-error-400 flex items-center justify-center'>
                  <span className='w-6 h-6 text-white'>
                    <DeleteIcon />
                  </span>
                </div>
              </div>
            </div>
            <div className='space-y-1 border border-[#F5EFE6] shadow-[0px_10px_18px_-2px_#10192812] py-2.5 px-3 rounded-[8px] flex items-center gap-2'>
              <div className='w-10 h-7 rounded-md border-[0.57px] border-[#D9D9D9] flex items-center justify-center'>
                <div className='flex items-center gap-1'>
                  <span className='w-4 h-4 rounded-full bg-[#ED0006]' />
                  <span className='w-4 h-4 rounded-full bg-[#F9A000] -ml-2.5' />
                </div>
              </div>
              <div className='flex flex-col items-start min-w-[110px]'>
                <p className='font-medium text-blackish'>{target.bank}</p>
                <p className='text-sm text-grey-800'>{target.account}</p>
              </div>
            </div>
            <div>
              <h3 className='text-2xl leading-[30px] font-medium text-blackish'>
                Delete Payment Method
              </h3>
              <p className='text-sm text-grey-600 mt-1'>
                You are about to delete this payment method, <br /> Do you want
                to proceed?
              </p>
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-center gap-y-4 gap-x-5 w-full'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 order-2 sm:order-1 hover:bg-grey-100 transition-colors duration-300 w-full'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={onDelete}
              className='flex-1 py-3 rounded-[12px] bg-linear-to-b from-[#C94C48] from-[17.5%] to-[#AB1D18] border border-error-500 text-white font-medium hover:from-error-600 hover:bg-error-800 transition-colors duration-300 order-1 sm:order-2 w-full'
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletePaymentModal
