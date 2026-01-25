import { ChevronLeftIcon } from '@/assets/icons'

type DesktopEditingHeaderProps = {
  onBack: () => void
  customizationOpen: boolean
  onOpenCustomization: () => void
}

const DesktopEditingHeader = ({
  onBack,
  customizationOpen,
  onOpenCustomization,
}: DesktopEditingHeaderProps) => {
  return (
    <>
      <button
        className='hidden lg:flex gap-1 items-center justify-center text-grey-800 bg-secondary-50 border border-grey-50 px-4 py-2 rounded-lg transition-colors hover:bg-primary-50'
        onClick={onBack}
      >
        <span className='w-4 h-4 block'>
          <ChevronLeftIcon />
        </span>
        <span className='text-base leading-[22px]'>Back</span>
      </button>
      <div className='flex lg:flex-col justify-between mt-2.5 items-center lg:items-start gap-2 lg:mb-3'>
        <div className='order-1 lg:order-2 flex lg:justify-between lg:items-center w-full'>
          <span className='font-medium text-grey-800'>
            Let&apos;s customize your template
          </span>
          {!customizationOpen && (
            <button
              className='hidden lg:block bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-colors py-2.5 px-3'
              onClick={onOpenCustomization}
            >
              Customize page
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default DesktopEditingHeader
