'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqItems } from './faqItems'

const FaqSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem((prev) => (prev === index ? null : index))
  }

  return (
    <motion.section
      className='px-4 lg:px-20 py-15 lg:py-20 flex flex-col gap-10 lg:gap-12'
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className='flex flex-col gap-2 items-center justify-center w-full max-w-[640px] mx-auto'>
        <div className='flex gap-1 items-center'>
          <span className='w-2 h-2 border border-primary-50 bg-[#AEAEFD] rounded-[2px]'></span>
          <h4 className='lg:text-xl leading-6 font-bold'>FAQs</h4>
        </div>
        <h6 className='text-[40px] leading-[48px] text-grey-800 text-center'>
          We ‘ve answered some questions you may have
        </h6>
      </div>

      <div className='w-full max-w-[1600px] mx-auto border-t border-grey-50'>
        {faqItems.map((item, index) => {
          const isOpen = openItem === index
          return (
            <div key={item.question} className='border-b border-grey-50'>
              <motion.button
                type='button'
                className='w-full text-left px-2 py-6 transition-colors duration-150 hover:bg-secondary-50/35'
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                whileTap={{ scale: 0.995 }}
              >
                <div className='flex items-center justify-between gap-4'>
                  <h5 className='text-2xl lg:text-[24px] leading-8 text-blackish font-medium'>
                    {item.question}
                  </h5>
                  <motion.span
                    className='inline-flex shrink-0'
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <ChevronDown className='w-6 h-6 text-grey-800' />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={`faq-content-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                      className='overflow-hidden'
                    >
                      <motion.p
                        id={`faq-answer-${index}`}
                        className='mt-2.5 leading-6 text-grey-700 whitespace-pre-line max-w-[1100px]'
                        initial={{ y: -4 }}
                        animate={{ y: 0 }}
                        exit={{ y: -2 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        {item.answer}
                      </motion.p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default FaqSection
