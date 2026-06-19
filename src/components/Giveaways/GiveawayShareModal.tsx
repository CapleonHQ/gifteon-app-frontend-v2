'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, Download, PartyPopper } from 'lucide-react'
import QRCode from 'qrcode'
import CloseIcon from '@/assets/icons/CloseIcon'
import InstagramIcon from '@/assets/icons/brand/InstagramIcon'
import WhatsappIcon from '@/assets/icons/brand/WhatsappIcon'
import XIcon from '@/assets/icons/brand/XIcon'
import LinkedinIcon from '@/assets/icons/brand/LinkedinIcon'

type GiveawayShareModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  shareUrl: string
  subtitle?: string
  justPublished?: boolean
}

const GiveawayShareModal = ({
  isOpen,
  onClose,
  title,
  shareUrl,
  subtitle,
  justPublished = false,
}: GiveawayShareModalProps) => {
  const [tab, setTab] = useState<'link' | 'qr' | 'social'>('link')
  const [qrData, setQrData] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const resolvedUrl = useMemo(() => {
    if (!shareUrl) return ''
    if (/^https?:\/\//i.test(shareUrl)) return shareUrl
    if (typeof window === 'undefined') return shareUrl
    const path = shareUrl.startsWith('/') ? shareUrl : `/${shareUrl}`
    return `${window.location.origin}${path}`
  }, [shareUrl])

  const handleCloseModal = () => {
    setTab('link')
    setIsCopied(false)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    const buildQr = async () => {
      try {
        setQrData(await QRCode.toDataURL(resolvedUrl, { width: 180 }))
      } catch {
        setQrData('')
      }
    }
    buildQr()
  }, [isOpen, resolvedUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    } catch {
      setIsCopied(false)
    }
  }

  const handleDownloadQr = () => {
    if (!qrData) return
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const link = document.createElement('a')
    link.href = qrData
    link.download = `${safeTitle || 'giveaway'}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShareClick = async (
    platform: 'instagram' | 'whatsapp' | 'x' | 'linkedin'
  ) => {
    const encodedUrl = encodeURIComponent(resolvedUrl)
    const whatsappText = encodeURIComponent(
      `Join my giveaway "${title}" for a chance to win: ${resolvedUrl}`
    )
    const xText = encodeURIComponent(
      `Join my giveaway "${title}" for a chance to win!`
    )
    const linkedinText = encodeURIComponent(
      `I just launched a giveaway "${title}". Enter for a chance to win.`
    )

    if (platform === 'instagram') {
      try {
        if (navigator.share) {
          await navigator.share({ title, text: title, url: resolvedUrl })
          return
        }
        await navigator.clipboard.writeText(`${title} — ${resolvedUrl}`)
      } catch {
        // continue to Instagram regardless
      }
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
      return
    }

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${whatsappText}`,
      x: `https://twitter.com/intent/tweet?text=${xText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${linkedinText}%20${encodedUrl}`,
    }
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={handleCloseModal}
      />
      <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] p-6 pt-12 sm:py-10 sm:px-10'>
        <button
          type='button'
          onClick={handleCloseModal}
          className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
          aria-label='Close'
        >
          <span className='text-grey-700 w-6 h-6'>
            <CloseIcon />
          </span>
        </button>

        <div className='flex flex-col gap-4'>
          {justPublished ? (
            <div className='flex items-center gap-2 rounded-[12px] bg-success-50 px-3 py-2.5 text-sm font-medium text-success-700'>
              <PartyPopper className='h-4 w-4 shrink-0' />
              Your giveaway is live — share it to start getting entries.
            </div>
          ) : null}

          <div>
            <h3 className='text-2xl font-medium text-blackish'>
              Share{' '}
              <span className='italic text-secondary-900'>
                &ldquo;{title}&rdquo;
              </span>
            </h3>
            <p className='text-grey-700 mt-1'>
              Choose how you&apos;d like to share your giveaway with others.
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
                <p className='font-medium text-grey-800'>Giveaway URL</p>
                <div className='flex items-center gap-2 bg-[#f2f2f3]/15 border border-grey-100 rounded-[12px] p-3'>
                  <span className='text-sm text-grey-700 flex-1 truncate'>
                    {resolvedUrl}
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

              {subtitle ? (
                <div className='space-y-1'>
                  <p className='font-medium text-grey-800'>Preview</p>
                  <div className='bg-[#f2f2f3]/15 border border-grey-100 rounded-[12px] p-3'>
                    <p className='font-medium text-blackish'>{title}</p>
                    <p className='text-sm text-grey-700 mt-0.5'>{subtitle}</p>
                    <p className='text-[10px] text-grey-600 truncate mt-1'>
                      {resolvedUrl}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {tab === 'qr' && (
            <div className='flex flex-col items-center gap-2 py-2'>
              <div className='w-[140px] h-[140px] bg-white flex items-center justify-center'>
                {qrData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrData} alt='QR Code' className='w-full h-full' />
                ) : (
                  <div className='text-grey-400 text-sm'>QR Code</div>
                )}
              </div>
              <p className='text-sm text-grey-700 text-center max-w-[292px]'>
                Scan this QR Code or save it to share your giveaway
              </p>
              <button
                type='button'
                onClick={handleDownloadQr}
                disabled={!qrData}
                className='w-[200px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300 mt-4 disabled:opacity-60'
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
                { label: 'Share on Instagram', Icon: InstagramIcon, platform: 'instagram' },
                { label: 'Share on WhatsApp', Icon: WhatsappIcon, platform: 'whatsapp' },
                { label: 'Share on X', Icon: XIcon, platform: 'x' },
                { label: 'Share on LinkedIn', Icon: LinkedinIcon, platform: 'linkedin' },
              ].map(({ label, Icon, platform }) => (
                <button
                  key={label}
                  type='button'
                  onClick={() =>
                    void handleShareClick(
                      platform as 'instagram' | 'whatsapp' | 'x' | 'linkedin'
                    )
                  }
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
                media helps reach more people who might want to enter your
                giveaway.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GiveawayShareModal
