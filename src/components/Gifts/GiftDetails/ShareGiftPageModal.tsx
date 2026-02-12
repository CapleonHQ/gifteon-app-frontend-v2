'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'

import { Check, Copy, Download } from 'lucide-react'
import QRCode from 'qrcode'
import InstagramIcon from '@/assets/icons/brand/InstagramIcon'
import WhatsappIcon from '@/assets/icons/brand/WhatsappIcon'
import XIcon from '@/assets/icons/brand/XIcon'
import LinkedinIcon from '@/assets/icons/brand/LinkedinIcon'

type ShareGiftPageModalProps = {
  isOpen: boolean
  onClose: () => void
  pageTitle: string
  pageUrl: string
}

const ShareGiftPageModal = ({
  isOpen,
  onClose,
  pageTitle,
  pageUrl,
}: ShareGiftPageModalProps) => {
  const [tab, setTab] = useState<'link' | 'qr' | 'social'>('link')
  const [qrData, setQrData] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTab('link')
      setIsCopied(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const buildQr = async () => {
      try {
        const data = await QRCode.toDataURL(pageUrl, { width: 180 })
        setQrData(data)
      } catch {
        setQrData('')
      }
    }
    buildQr()
  }, [isOpen, pageUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    } catch {
      setIsCopied(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] p-6 pt-12  sm:py-10 sm:px-10'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
          aria-label='Close'
        >
          <span className='text-grey-700 w-6 h-6'>
            <CloseIcon />
          </span>
        </button>

        <div className='flex flex-col gap-4'>
          <div>
            <h3 className='text-2xl font-medium text-blackish'>
              Share{' '}
              <span className='italic text-secondary-900'>
                &ldquo;{pageTitle}&rdquo;
              </span>
            </h3>
            <p className='text-grey-700 mt-1'>
              Choose how you&apos;d like to share your gift page with others.
            </p>
          </div>

          <div className='flex items-center gap-2 rounded-[10px] bg-primary-50/20 border border-primary-50 p-1.5'>
            {[
              { id: 'link', label: 'Link' },
              { id: 'qr', label: 'QR Code' },
              { id: 'social', label: 'Social Media' },
            ].map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => setTab(item.id as typeof tab)}
                className={`text-sm sm:text-base flex-1 px-3 py-1 leading-6 rounded-[8px] transition-colors ${
                  tab === item.id
                    ? 'bg-primary-50 text-primary-900 font-medium'
                    : 'text-grey-600 hover:text-primary-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'link' && (
            <div className='space-y-4'>
              <div className='space-y-1'>
                <p className='font-medium text-grey-800'>Page URL</p>
                <div className='flex items-center gap-2 bg-[#f2f2f3]/15 border border-grey-100 rounded-[12px] p-3'>
                  <span className='text-sm text-grey-700 flex-1 truncate'>
                    {pageUrl}
                  </span>
                  <button
                    type='button'
                    onClick={handleCopy}
                    className='text-grey-500 hover:text-grey-700'
                    aria-label='Copy link'
                  >
                    {isCopied ? (
                      <Check className='w-4 h-4 text-success-500' />
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>

              <div className='space-y-1'>
                <p className='font-medium text-grey-800'>Link Preview</p>
                <div className='flex items-center gap-3 bg-[#f2f2f3]/15 border border-grey-100 rounded-[12px] p-3'>
                  <div className='w-[60px] h-[60px] rounded-[8px] overflow-hidden bg-grey-50'>
                    <Image
                      src='/assets/images/place-holder-image.jpg'
                      alt='Preview'
                      width={80}
                      height={80}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='text-base flex flex-col gap-1'>
                    <p className='font-medium text-blackish'>{pageTitle}</p>
                    <p className='text-[10px] text-grey-600 truncate'>
                      {pageUrl}
                    </p>
                    <p className='text-xs text-grey-700'>
                      Happy Birthday to me, celebrate with me by dropping wishes
                      and...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'qr' && (
            <div className='flex flex-col items-center gap-2 py-2'>
              <div className='w-[140px] h-[140px] bg-white flex items-center justify-center'>
                {qrData ? (
                  <img src={qrData} alt='QR Code' className='w-full h-full' />
                ) : (
                  <div className='text-grey-400 text-sm'>QR Code</div>
                )}
              </div>
              <p className='text-sm text-grey-700 text-center max-w-[292px]'>
                Scan this QR Code or save it to share your giftpage
              </p>
              <button
                type='button'
                className='w-[200px] flex items-center gap-2 px-5 py-3.5 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300 mt-4'
              >
                <Download className='w-4 h-4' />
                Download QR Code
              </button>
            </div>
          )}

          {tab === 'social' && (
            <div className='space-y-2'>
              <p className='font-medium text-grey-800'>Share on social media</p>
              {[
                { label: 'Share on Instagram', Icon: InstagramIcon },
                { label: 'Share on WhatsApp', Icon: WhatsappIcon },
                { label: 'Share on X', Icon: XIcon },
                { label: 'Share on LinkedIn', Icon: LinkedinIcon },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type='button'
                  className='w-full flex items-center gap-2 border border-grey-100 rounded-[12px] px-4 py-3 text-sm text-blackish hover:bg-grey-50 transition-colors'
                >
                  <span className='w-5 h-5'>
                    <Icon />
                  </span>
                  {label}
                </button>
              ))}
              <div className='mt-2 rounded-[12px] bg-secondary-50 p-3 text-[#143535] text-sm'>
                <span className='font-semibold'> Tip:</span> Sharing on social
                media helps reach more friends and family who might want to
                contribute to your celebration.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareGiftPageModal
