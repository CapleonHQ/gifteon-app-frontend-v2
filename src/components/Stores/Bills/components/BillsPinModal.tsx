import { X } from 'lucide-react'
import ShakeOnError from '@/components/common/ShakeOnError'
import { useBillsFlow } from '../context/BillsFlowContext'

const BillsPinModal = () => {
  const {
    isPinOpen: isOpen,
    pin,
    pinError,
    isSubmitting,
    isPinComplete,
    pinRefs,
    onPinChange,
    onPinKeyDown,
    onPinPaste,
    onClosePinToReview,
    onRunPayment,
  } = useBillsFlow()
  if (!isOpen) return null

  return (
    <>
      <div className='fixed inset-0 z-60 hidden lg:flex items-center justify-center p-4'>
        <div
          className='absolute inset-0 bg-black/40 backdrop-blur-sm'
          onClick={onClosePinToReview}
        />
        <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
          <button
            type='button'
            onClick={onClosePinToReview}
            className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
            aria-label='Close'
          >
            <span className='text-grey-700'>
              <X className='h-5 w-5' />
            </span>
          </button>
          <div className='flex flex-col items-center text-center gap-4'>
            <div>
              <h3 className='text-xl font-medium text-blackish'>Confirmation</h3>
              <p className='text-sm text-grey-600'>
                Provide your account PIN to move forward
              </p>
            </div>
            <div className='flex items-center justify-center gap-3'>
              {pin.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    pinRefs.current[index] = el
                  }}
                  value={value}
                  onChange={(event) => onPinChange(index, event.target.value)}
                  onKeyDown={(event) => onPinKeyDown(index, event)}
                  onPaste={onPinPaste}
                  className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
                    pinError
                      ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                      : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                  }`}
                  type='password'
                  inputMode='numeric'
                  maxLength={1}
                />
              ))}
            </div>

            <div className='flex items-center gap-3 w-full'>
              <button
                type='button'
                onClick={onClosePinToReview}
                className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
              >
                Go Back
              </button>
              <button
                type='button'
                onClick={() => void onRunPayment()}
                disabled={!isPinComplete || isSubmitting}
                className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                  isPinComplete && !isSubmitting
                    ? 'bg-primary-500 hover:bg-primary-600'
                    : 'bg-primary-200 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>

            <ShakeOnError active={Boolean(pinError)} className='w-full'>
              {pinError ? <p className='text-xs text-error-500'>{pinError}</p> : null}
            </ShakeOnError>
          </div>
        </div>
      </div>

      <div className='fixed inset-0 z-70 lg:hidden flex items-center justify-center px-4'>
        <div
          className='absolute inset-0 bg-black/40 backdrop-blur-sm'
          onClick={onClosePinToReview}
        />
        <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
          <button
            type='button'
            onClick={onClosePinToReview}
            className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
            aria-label='Close'
          >
            <span className='text-grey-700'>
              <X className='h-5 w-5' />
            </span>
          </button>
          <div className='flex flex-col items-center text-center gap-4'>
            <div>
              <h3 className='text-xl font-medium text-blackish'>Confirmation</h3>
              <p className='text-sm text-grey-600'>
                Provide your account PIN to move forward
              </p>
            </div>
            <div className='flex items-center justify-center gap-3'>
              {pin.map((value, index) => (
                <input
                  key={`mobile-pin-${index}`}
                  ref={(el) => {
                    pinRefs.current[index] = el
                  }}
                  value={value}
                  onChange={(event) => onPinChange(index, event.target.value)}
                  onKeyDown={(event) => onPinKeyDown(index, event)}
                  onPaste={onPinPaste}
                  className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
                    pinError
                      ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                      : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                  }`}
                  type='password'
                  inputMode='numeric'
                  maxLength={1}
                />
              ))}
            </div>
            <div className='flex items-center gap-3 w-full'>
              <button
                type='button'
                onClick={onClosePinToReview}
                className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
              >
                Go Back
              </button>
              <button
                type='button'
                disabled={!isPinComplete || isSubmitting}
                onClick={() => void onRunPayment()}
                className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                  isPinComplete && !isSubmitting
                    ? 'bg-primary-500 hover:bg-primary-600'
                    : 'bg-primary-200 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
            <ShakeOnError active={Boolean(pinError)} className='w-full'>
              {pinError ? <p className='text-xs text-error-500'>{pinError}</p> : null}
            </ShakeOnError>
          </div>
        </div>
      </div>
    </>
  )
}

export default BillsPinModal
