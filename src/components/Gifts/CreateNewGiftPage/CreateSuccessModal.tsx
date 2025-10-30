'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'

import QRCode from 'qrcode'
import {
  InstagramColored,
  LinkedinIcon,
  WhatsappIcon,
  XTwitterIcon,
} from '../../../assets/icons'
import Image from 'next/image'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  giftPageLink: string
}

const SuccessModal = ({ isOpen, onClose, giftPageLink }: SuccessModalProps) => {
  const [copied, setCopied] = useState(false)
  const [qrCode, setQrCode] = useState('')

  useEffect(() => {
    if (isOpen && giftPageLink) {
      QRCode.toDataURL(giftPageLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrCode)
    }
  }, [isOpen, giftPageLink])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(giftPageLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: string) => {
    const text = 'Check out my gift page!'
    const url = encodeURIComponent(giftPageLink)

    const shareUrls: Record<string, string> = {
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        text + ' ' + giftPageLink
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[580px] bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto'
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-grey-100 transition-colors z-10'
            >
              <X className='w-5 h-5 text-grey-600' />
            </button>

            {/* Content */}
            <div className='p-8 text-center flex flex-col items-center'>
              <div className='w-[110px] h-[110px]'>
                <Image
                  src='/assets/images/success-confetti.svg'
                  alt='Success'
                  width={150}
                  height={150}
                  className='w-full h-full'
                />
              </div>

              {/* Title */}
              <h2 className='text-2xl font-medium text-blackish mb-1.5'>
                Your gift page is live!
              </h2>

              {/* Subtitle */}
              <p className='text-grey-600 mb-4'>
                It has been sent to the email address of all recipients.
              </p>

              {/* Divider */}
              <div className='w-full h-px bg-grey-100 mb-4' />

              {/* Sharing Section */}
              <h3 className='text-2xl text-grey-900 mb-4'>
                You can also share this by
              </h3>

              {/* 1. Link Sharing */}
              <div className='mb-3.5 w-full'>
                <p className='text-secondary-900 mb-2'>
                  1. Sharing the Gift Page link
                </p>
                <div className='flex items-center gap-2 p-3 bg-grey-50 border border-grey-100 rounded-[12px]'>
                  <input
                    type='text'
                    value={giftPageLink}
                    readOnly
                    className='flex-1 w-full bg-[#F2F2F326] text-grey-700 text-sm outline-none'
                  />
                  <button
                    onClick={handleCopy}
                    className='flex items-center text-primary-400 hover:text-primary-600 transition-colors'
                  >
                    {copied ? (
                      <>
                        <Check className='w-4 h-4' />
                      </>
                    ) : (
                      <>
                        <Copy className='w-4 h-4' />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Social Media Sharing */}
              <div className='mb-3.5'>
                <p className='text-secondary-900 mb-2'>
                  2. Sharing it on social media
                </p>
                <div className='flex items-center justify-center gap-4'>
                  <button
                    onClick={() => handleShare('instagram')}
                    className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-grey-50  hover:scale-110 transition-transform'
                  >
                    <span className='w-5 h-5 block'>
                      <InstagramColored />
                    </span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-grey-50  hover:scale-110 transition-transform'
                  >
                    <span className='w-5 h-5 block'>
                      <WhatsappIcon />
                    </span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-grey-50  hover:scale-110 transition-transform'
                  >
                    <span className='w-5 h-5 block'>
                      <XTwitterIcon />
                    </span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-grey-50  hover:scale-110 transition-transform'
                  >
                    <span className='w-5 h-5 block'>
                      <LinkedinIcon />
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. QR Code */}
              <div>
                <p className='text-secondary-900 mb-2'>
                  3. Scanning this QR code
                </p>
                {qrCode && (
                  <div className='inline-block'>
                    <img
                      src={qrCode}
                      alt='QR Code'
                      className='w-[90px] h-[90px]'
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal
