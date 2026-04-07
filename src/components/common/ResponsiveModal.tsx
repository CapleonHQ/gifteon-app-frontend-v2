'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

type ResponsiveModalProps = {
  isOpen: boolean
  onClose: () => void
  header?: ReactNode
  body: ReactNode
  footer?: ReactNode
  desktopMaxWidthClass?: string
  mobileTopOffsetClass?: string
  desktopPanelClassName?: string
  mobilePanelClassName?: string
  contentClassName?: string
  zIndex?: string
}

const ResponsiveModal = ({
  isOpen,
  onClose,
  header,
  body,
  footer,
  desktopMaxWidthClass = 'max-w-[520px]',
  mobileTopOffsetClass = 'top-[72.5px]',
  desktopPanelClassName = '',
  mobilePanelClassName = '',
  contentClassName = '',
  zIndex = '',
}: ResponsiveModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const body = document.body
    const currentCount = Number(body.dataset.modalOpenCount ?? '0')
    body.dataset.modalOpenCount = String(currentCount + 1)

    if (currentCount === 0) {
      body.dataset.modalPrevOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    }

    return () => {
      const nextCount = Number(body.dataset.modalOpenCount ?? '1') - 1
      if (nextCount <= 0) {
        body.style.overflow = body.dataset.modalPrevOverflow ?? ''
        delete body.dataset.modalOpenCount
        delete body.dataset.modalPrevOverflow
        return
      }
      body.dataset.modalOpenCount = String(nextCount)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 ${zIndex || 'z-30 lg:z-50'}`}>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block'
        onClick={onClose}
      />

      <div className='hidden lg:flex items-center justify-center h-full px-4'>
        <div
          className={`relative w-full ${desktopMaxWidthClass} max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col ${desktopPanelClassName}`}
        >
          {header ? (
            <div className='px-6 sm:px-10 pt-10 pb-4'>{header}</div>
          ) : null}
          <div
            className={`px-6 sm:px-10 pb-8 overflow-y-auto flex-1 min-h-0 ${contentClassName}`}
          >
            {body}
          </div>
          {footer ? <div className='px-6 sm:px-10 pb-8'>{footer}</div> : null}
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 ${mobileTopOffsetClass} bg-white flex flex-col ${mobilePanelClassName}`}
      >
        {header ? <div className='px-4 pt-8 pb-4'>{header}</div> : null}
        <div className='flex-1 overflow-y-auto px-4 pb-4'>{body}</div>
        {footer ? (
          <div className='px-4 py-3 shadow-[0px_-10px_18px_5px_#4040401A] bg-white'>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ResponsiveModal
