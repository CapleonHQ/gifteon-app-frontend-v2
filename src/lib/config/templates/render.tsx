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
}: {
  links: RenderTemplateData['socialLinks']
  size?: 'normal' | 'compact'
}) => {
  const iconSize = size === 'compact' ? 'h-3 w-3' : 'h-4 w-4'
  const gap = size === 'compact' ? 'gap-2' : 'gap-4'

  return (
    <div className={cn('flex items-center', gap)}>
      {links.instagram && (
        <a
          href={links.instagram}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Instagram'
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

export const RenderTemplate1 = ({ data }: RenderTemplateProps) => (
  <div className='w-full flex flex-col gap-6 relative'>
    <div className='absolute top-0 left-0 right-0 h-52 sm:h-56 bg-warning-50' />
    <div className=' px-5 sm:px-8 pt-8 z-2'>
      <h1 className='mb-5' style={titleStyle(data)}>
        {data.title}
      </h1>

      <div className='flex flex-col lg:flex-row gap-5 items-stretch lg:items-start mb-2'>
        <div className='flex-1'>
          <div className='w-full max-w-[400px] h-[260px] sm:h-[320px] lg:h-[381px] rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#143535]'>
            <ContentImage data={data} />
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-4 lg:pt-13'>
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
)

export const RenderTemplate2 = ({ data }: RenderTemplateProps) => (
  <div className='w-full flex flex-col gap-6 relative bg-white'>
    <div className='absolute top-0 left-0 right-0 h-40 sm:h-44 bg-warning-50' />
    <div className='relative px-5 sm:px-8 pt-8'>
      <div className='flex justify-between items-end mb-6 gap-5'>
        <div className='h-28 w-28 sm:h-36 sm:w-36 rounded-full border border-grey-50 overflow-hidden shadow-[0px_0px_0px_6px_#FFFFFF]'>
          <ContentImage data={data} />
        </div>
        <div className='flex flex-col gap-3 items-end'>
          <SocialLinksRow links={data.socialLinks} />
          <button
            type='button'
            className='rounded-full px-4 py-2 text-sm font-medium'
            style={{
              backgroundColor: data.buttonBackgroundColor,
              color: data.buttonTextColor,
            }}
          >
            {data.buttonLabel}
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h1 style={titleStyle(data)}>{data.title}</h1>
        <p className='leading-8' style={descriptionStyle(data)}>
          {data.description}
        </p>
      </div>
    </div>
  </div>
)

export const RenderTemplate3 = ({ data }: RenderTemplateProps) => (
  <div className='w-full flex flex-col gap-6 relative bg-white'>
    <div className='absolute top-[-24px] left-0 right-0 h-40 bg-secondary-100 rounded-full blur-[36px]' />
    <div className='relative px-5 sm:px-8 pt-8'>
      <div className='flex flex-col lg:flex-row gap-5 items-stretch lg:items-center mb-2'>
        <div className='flex-1 flex flex-col gap-4'>
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
          <SocialLinksRow links={data.socialLinks} />
        </div>

        <div className='flex-1'>
          <div className='w-full aspect-square rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#143535]'>
            <ContentImage data={data} />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const RenderTemplate4 = ({ data }: RenderTemplateProps) => (
  <div className='w-full flex flex-col gap-4 relative bg-white'>
    <div className='absolute top-0 left-0 right-0 h-full w-1/2 bg-secondary-50 rounded-br-[120px] blur-[30px]' />
    <div className='relative px-5 sm:px-8 pt-8 flex flex-col lg:flex-row gap-5'>
      <div className='flex-1 flex flex-col'>
        <div className='w-full mb-4'>
          <div className='w-full rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#143535]'>
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

      <div className='flex-1 flex flex-col gap-3'>
        <div className='flex justify-end'>
          <button
            type='button'
            className='rounded-full px-4 py-2 text-sm font-medium'
            style={{
              backgroundColor: data.buttonBackgroundColor,
              color: data.buttonTextColor,
            }}
          >
            {data.buttonLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
)
