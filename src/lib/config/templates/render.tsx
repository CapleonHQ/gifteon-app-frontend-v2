import { InstagramColored, LinkedinIcon, XTwitterIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import type { RenderTemplateData, RenderTemplateProps } from './types'

const DEFAULT_IMAGE = '/assets/images/place-holder-image.jpg'

const toCssTextAlign = (
  alignment: RenderTemplateData['titleStyle']['alignment']
) => (alignment === 'middle' ? 'center' : alignment)

const ContentImage = ({ data }: { data: RenderTemplateData }) => {
  if (data.mediaType === 'video') {
    return (
      <video
        className='h-full w-full object-cover'
        src={data.mediaUrl}
        controls
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={data.mediaUrl || DEFAULT_IMAGE}
      alt={data.title}
      className='h-full w-full object-cover'
    />
  )
}

const SocialLinksRow = ({
  links,
  size = 'normal',
  variant = 'plain',
}: {
  links: RenderTemplateData['socialLinks']
  size?: 'normal' | 'compact'
  variant?: 'plain' | 'chips'
}) => {
  const iconSize = size === 'compact' ? 'h-3 w-3' : 'h-4 w-4'
  const gap = size === 'compact' ? 'gap-2' : 'gap-4'
  const chipClass =
    variant === 'chips'
      ? 'h-7 w-7 rounded-full bg-white/80 border border-grey-50 flex items-center justify-center shadow-[0px_1px_3px_0px_#1019281A]'
      : ''

  return (
    <div className={cn('flex items-center', gap)}>
      {links.instagram && (
        <a
          href={links.instagram}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Instagram'
          className={chipClass}
        >
          <span className={cn('block', iconSize)}>
            <InstagramColored />
          </span>
        </a>
      )}
      {links.twitter && (
        <a
          href={links.twitter}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='X'
          className={chipClass}
        >
          <span className={cn('block', iconSize)}>
            <XTwitterIcon />
          </span>
        </a>
      )}
      {links.linkedin && (
        <a
          href={links.linkedin}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='LinkedIn'
          className={chipClass}
        >
          <span className={cn('block', iconSize)}>
            <LinkedinIcon />
          </span>
        </a>
      )}
    </div>
  )
}

const titleStyle = (data: RenderTemplateData) =>
  ({
    fontFamily: data.titleStyle.fontFamily,
    fontSize: `${Math.max(32, data.titleStyle.size)}px`,
    fontWeight: data.titleStyle.bold ? 'bold' : 'normal',
    fontStyle: data.titleStyle.italic ? 'italic' : 'normal',
    textDecoration: data.titleStyle.underline ? 'underline' : 'none',
    textAlign: toCssTextAlign(data.titleStyle.alignment),
    color: data.titleStyle.color,
  } as const)

const descriptionStyle = (data: RenderTemplateData) =>
  ({
    fontFamily: data.descriptionStyle.fontFamily,
    fontSize: `${Math.max(15, data.descriptionStyle.size)}px`,
    textAlign: toCssTextAlign(data.descriptionStyle.alignment),
    color: data.descriptionStyle.color,
  } as const)

export const RenderTemplate1 = ({
  data,
  engagementSection,
}: RenderTemplateProps) => (
  <>
    <div className='w-full flex flex-col gap-6 relative'>
      <div className='absolute top-0 left-0 right-0 h-52 sm:h-[352px] bg-warning-50' />
      <div className=' px-5 sm:px-8 lg:px-15 pt-8 lg:pt-18 z-2 max-w-[860px] mx-auto'>
        <h1 className='mb-5' style={titleStyle(data)}>
          {data.title}
        </h1>

        <div className='flex flex-col md:flex-row gap-5 md:gap-8 lg:gap-10 items-center md:items-start mb-2 lg:mb-8'>
          <div className='flex-1 w-full'>
            <div className='w-full md:max-w-[400px] h-[260px] sm:h-[320px] lg:h-[381px] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_0px_#143535]'>
              <ContentImage data={data} />
            </div>
          </div>

          <div className='flex-1 w-full flex flex-col gap-4 lg:pt-13'>
            <p className='leading-8' style={descriptionStyle(data)}>
              {data.description}
            </p>
            <button
              type='button'
              className='rounded-full px-4 py-2 text-sm font-medium w-fit'
              style={{
                backgroundColor: data.buttonBackgroundColor,
                color: data.buttonTextColor,
              }}
            >
              {data.buttonLabel}
            </button>
            <SocialLinksRow links={data.socialLinks} />
          </div>
        </div>
      </div>
    </div>
    {engagementSection ? engagementSection : null}
  </>
)

export const RenderTemplate2 = ({
  data,
  engagementSection,
}: RenderTemplateProps) => (
  <>
    <div className='w-full flex flex-col gap-6 relative overflow-hidden'>
      <div className='absolute top-0 left-0 right-0 h-[170px] sm:h-[190px] lg:h-[205px] bg-warning-50' />
      <div className='relative px-5 sm:px-8 lg:px-15 pt-8 lg:pt-[68px] lg:pb-6'>
        <div className='flex flex-col items-center sm:flex-row sm:justify-between sm:items-end mb-6 gap-5'>
          <div className='h-[190px] w-[190px] sm:h-[220px] sm:w-[220px] lg:h-[260px] lg:w-[260px] rounded-full border border-grey-50 overflow-hidden shadow-[0px_0px_0px_6px_#FFFFFF] ring-1 ring-warning-100'>
            <ContentImage data={data} />
          </div>
          <div className='flex flex-col gap-3 items-center sm:items-end'>
            <SocialLinksRow links={data.socialLinks} variant='chips' />
            <button
              type='button'
              className='rounded-full px-4 py-2 text-sm font-medium shadow-[0px_6px_16px_-10px_#2E319299]'
              style={{
                backgroundColor: data.buttonBackgroundColor,
                color: data.buttonTextColor,
              }}
            >
              {data.buttonLabel}
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <h1 style={titleStyle(data)}>{data.title}</h1>
          <p className='leading-8' style={descriptionStyle(data)}>
            {data.description}
          </p>
        </div>
      </div>
    </div>
    {engagementSection ? engagementSection : null}
  </>
)

export const RenderTemplate3 = ({
  data,
  engagementSection,
}: RenderTemplateProps) => (
  <>
    <div className='w-full flex flex-col gap-6 relative overflow-hidden'>
      <div className='absolute top-[-90px] lg:top-[-107px] left-0 right-0 h-40 lg:h-[214px] bg-secondary-100 rounded-full blur-[36px]' />
      <div className='relative px-5 sm:px-8 lg:px-15 pt-8 lg:pt-[68px] max-w-[860px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-5 md:gap-8 lg:gap-10 items-center md:items-start mb-2 lg:mb-8'>
          <div className='flex-1 w-full flex flex-col gap-4'>
            <h1 style={titleStyle(data)}>{data.title}</h1>
            <p className='leading-8' style={descriptionStyle(data)}>
              {data.description}
            </p>
            <button
              type='button'
              className='rounded-full px-4 py-2 text-sm font-medium w-fit'
              style={{
                backgroundColor: data.buttonBackgroundColor,
                color: data.buttonTextColor,
              }}
            >
              {data.buttonLabel}
            </button>
            <SocialLinksRow links={data.socialLinks} variant='chips' />
          </div>

          <div className='w-full flex-1'>
            <div className='w-full md:max-w-[380px] lg:w-[380px] h-[320px] sm:h-[360px] lg:h-[381px] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_0px_#143535]'>
              <ContentImage data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
    {engagementSection ? engagementSection : null}
  </>
)

export const RenderTemplate4 = ({
  data,
  engagementSection,
}: RenderTemplateProps) => (
  <div className='w-full flex flex-col gap-4 relative overflow-hidden'>
    <div className='absolute top-0 left-0 right-0 h-[45%] md:h-full w-full md:w-1/2 bg-secondary-50 rounded-br-[80px] md:rounded-br-[120px] blur-lg md:blur-xl lg:blur-[30px]' />
    <div className='relative px-5 sm:px-8 lg:px-12 pt-8 lg:pt-15 flex flex-col md:flex-row gap-5 md:gap-8 lg:gap-10'>
      <div className='flex-1 flex flex-col'>
        <div className='w-full mb-4 lg:mb-8'>
          <div className='w-full md:max-w-[340px] lg:w-[370px] h-[320px] sm:h-[360px] md:h-[340px] lg:h-[381px] rounded-[20px] overflow-hidden shadow-[-4px_4px_0px_0px_#143535]'>
            <ContentImage data={data} />
          </div>
        </div>
        <h1 className='mb-2' style={titleStyle(data)}>
          {data.title}
        </h1>
        <div className='mb-2'>
          <SocialLinksRow links={data.socialLinks} />
        </div>
        <p className='leading-8' style={descriptionStyle(data)}>
          {data.description}
        </p>
      </div>

      <div className='flex-1 flex flex-col gap-3 md:items-end'>
        <div className='flex md:justify-end'>
          <button
            type='button'
            className='rounded-full px-4 py-2 text-sm font-medium shadow-[0px_10px_18px_-12px_#2E319299]'
            style={{
              backgroundColor: data.buttonBackgroundColor,
              color: data.buttonTextColor,
            }}
          >
            {data.buttonLabel}
          </button>
        </div>
        {engagementSection}
      </div>
    </div>
  </div>
)
