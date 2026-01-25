import { motion } from 'framer-motion'

type TemplateSelectionFooterProps = {
  canContinue: boolean
  onContinue: () => void
}

const TemplateSelectionFooter = ({
  canContinue,
  onContinue,
}: TemplateSelectionFooterProps) => {
  return (
    <div className='flex justify-center'>
      <motion.button
        onClick={onContinue}
        disabled={!canContinue}
        className={`px-9 py-3.5 rounded-xl w-full sm:w-auto font-medium transition-all ${
          canContinue
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-grey-200 text-grey-400 cursor-not-allowed'
        }`}
        whileHover={canContinue ? { scale: 1.02 } : {}}
        whileTap={canContinue ? { scale: 0.98 } : {}}
      >
        Save and Continue
      </motion.button>
    </div>
  )
}

export default TemplateSelectionFooter
