import KycIconIllustration from '@/assets/icons/diagrams/KycIconIllustration'
import type { KycRequiredAction } from '../types'

type IntroStepState = 'done' | 'current' | 'upcoming'
type IntroStepItem = {
  title: string
  description: string
  state: IntroStepState
}

const getVerificationSteps = (action: KycRequiredAction): IntroStepItem[] => {
  const allSteps: Array<{
    key: 'nin' | 'bvn' | 'level3'
    title: string
    description: string
  }> = [
    {
      key: 'nin',
      title: 'Submit your NIN',
      description: 'Enter your 11-digit National Identification Number.',
    },
    {
      key: 'bvn',
      title: 'Submit your BVN',
      description: 'Enter your 11-digit Bank Verification Number.',
    },
    {
      key: 'level3',
      title: 'Level 3 verification',
      description: 'First upload utility bill, then complete face recognition.',
    },
  ]

  const currentKey =
    action === 'nin'
      ? 'nin'
      : action === 'bvn'
      ? 'bvn'
      : action === 'utility' || action === 'face'
      ? 'level3'
      : 'level3'

  const doneKeys = new Set(
    action === 'nin'
      ? []
      : action === 'bvn'
      ? ['nin']
      : action === 'utility' || action === 'face'
      ? ['nin', 'bvn']
      : ['nin', 'bvn', 'level3']
  )

  return allSteps.map((step) => ({
    title: step.title,
    description: step.description,
    state: doneKeys.has(step.key)
      ? 'done'
      : step.key === currentKey
      ? 'current'
      : 'upcoming',
  }))
}

type IntroStepBodyProps = {
  action: KycRequiredAction
  isLoadingStatus?: boolean
}

export const IntroStepBody = ({
  action,
  isLoadingStatus = false,
}: IntroStepBodyProps) => {
  const verificationSteps = getVerificationSteps(action)

  return (
    <div className='space-y-4'>
      <div className='bg-secondary-50 rounded-[12px] p-3 flex flex-col gap-2'>
        <p className='font-medium leading-[22px] text-[#143535]'>
          Why do we need this?
        </p>
        <p className='text-sm text-secondary-800 leading-[20px]'>
          This helps us comply with financial regulations and keep your account
          secure. Your information is encrypted and never shared.
        </p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <h3 className='text-lg leading-6 font-medium text-grey-900 mb-4'>
          Verification process
        </h3>
        {isLoadingStatus ? (
          <p className='text-sm text-grey-600'>
            Checking your current KYC level...
          </p>
        ) : (
          <div className='flex flex-col gap-4'>
            {verificationSteps.map((item, i) => (
              <div
                key={item.title}
                className={`flex items-center justify-between gap-4 p-3 rounded-[12px] border ${
                  item.state === 'done'
                    ? 'bg-success-50 border-success-100'
                    : item.state === 'current'
                    ? 'bg-primary-50/40 border-primary-100'
                    : 'bg-grey-50/20 border-dashed border-grey-100'
                }`}
              >
                <div className='flex gap-2 items-center'>
                  <span className='w-10 h-10 rounded-lg shrink-0'>
                    <KycIconIllustration />
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='leading-5 font-medium text-blackish'>
                      {item.title}
                    </p>
                    <p className='text-xs text-grey-600 mt-1 leading-4'>
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className='text-sm leading-[18px] text-grey-800 shrink-0'>
                  {item.state === 'done' ? 'Done' : `STEP ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
