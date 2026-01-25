import { useEffect, useState } from 'react'
import { useMobileBack } from '@/components/Layout/MobileTitleContext'
import EditingHeader from './EditingHeader'
import EditingFooter from './EditingFooter'
import CustomizeStep from './CustomizeStep'
import SettingsStep from './SettingsStep'

type Step = 'customize' | 'settings'
type CustomGiftForm = {
  title: string
  price: string
  imageName: string
  imageUrl?: string
  quantity: string
}

interface EditingSectionProps {
  onClose: () => void
  onSave: () => void
}

const EditingSection = ({ onClose, onSave }: EditingSectionProps) => {
  const [step, setStep] = useState<Step>('customize')
  const { setOnBack } = useMobileBack()

  const handleNext = () => {
    if (step === 'customize') {
      setStep('settings')
    } else {
      onSave()
    }
  }

  const handleBack = () => {
    if (step === 'settings') {
      setStep('customize')
    }
  }

  useEffect(() => {
    setOnBack(() => () => {
      if (step === 'settings') {
        setStep('customize')
      } else {
        onClose()
      }
    })

    return () => setOnBack(undefined)
  }, [onClose, setOnBack, step])

  return (
    <div className='h-full relative lg:rounded-t-3xl lg:shadow-[0px_-5px_13px_5px_#1019280F] bg-white flex flex-col overflow-hidden'>
      <EditingHeader step={step} onClose={onClose} />

      {/* Content */}
      <div className='flex-1 overflow-y-auto sm:px-6 sm:py-5'>
        {step === 'customize' ? <CustomizeStep /> : <SettingsStep />}
      </div>

      <EditingFooter
        step={step}
        onBack={handleBack}
        onClose={onClose}
        onNext={handleNext}
      />
    </div>
  )
}

export default EditingSection
