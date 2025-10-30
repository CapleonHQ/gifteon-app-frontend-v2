import React, { useState } from 'react'
import Image from 'next/image'
import {
  InstagramColored,
  LinkedinIcon,
  XTwitterIcon,
  ChevronDownIcon,
} from '@/assets/icons'
import { GiftPageData } from '@/types/gifts'

// ========== PREVIEW TEMPLATE 1 ==========
export const PreviewTemplate1 = ({ data }: { data: GiftPageData }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'activities'>(
    'comments'
  )

  return (
    <div className='w-full h-full flex flex-col gap-4 relative pb-8 bg-white'>
      {/* Colored Background - scaled down */}
      <div className='absolute top-0 left-0 right-0 h-32 bg-warning-50'></div>

      <div className='px-6 pt-6 z-2'>
        <h1
          className='font-semibold mb-3'
          style={{
            fontSize: `${parseInt(data.title.size) * 0.5}px`,
            fontWeight: data.title.bold ? 'bold' : 'normal',
            fontStyle: data.title.italic ? 'italic' : 'normal',
            textDecoration: data.title.underline ? 'underline' : 'none',
            textAlign: data.title.alignment,
            color: data.title.color,
            fontFamily: data.title.font,
          }}
        >
          {data.title.text}
        </h1>

        <div className='flex gap-4 items-center mb-4'>
          {/* Image */}
          <div className='flex-1'>
            <div className='w-full aspect-square rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#143535]'>
              {data.media.url ? (
                data.media.type === 'image' ? (
                  <img
                    src={data.media.url}
                    alt='gift-page-media'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <video
                    src={data.media.url}
                    className='w-full h-full object-cover'
                    controls
                  />
                )
              ) : (
                <Image
                  src='/assets/images/place-holder-image.jpg'
                  alt='place-holder-image'
                  width={150}
                  height={150}
                  className='w-full h-full object-cover'
                />
              )}
            </div>
          </div>

          {/* Description side */}
          <div className='flex-1 flex flex-col gap-2'>
            <p
              className='leading-snug'
              style={{
                fontSize: `${parseInt(data.description.size) * 0.8}px`,
                fontWeight: data.description.bold ? 'bold' : 'normal',
                fontStyle: data.description.italic ? 'italic' : 'normal',
                textDecoration: data.description.underline
                  ? 'underline'
                  : 'none',
                textAlign: data.description.alignment,
                color: data.description.color,
                fontFamily: data.description.font,
              }}
            >
              {data.description.text}
            </p>
            <button
              className='py-1 px-2 rounded-full text-xs w-fit'
              style={{
                backgroundColor: data.button.backgroundColor,
                color: data.button.textColor,
              }}
            >
              {data.button.label}
            </button>
            <div className='flex gap-2'>
              {data.socialLinks.instagram && (
                <a
                  href={data.socialLinks.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <InstagramColored />
                  </span>
                </a>
              )}
              {data.socialLinks.twitter && (
                <a
                  href={data.socialLinks.twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <XTwitterIcon />
                  </span>
                </a>
              )}
              {data.socialLinks.linkedin && (
                <a
                  href={data.socialLinks.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <LinkedinIcon />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments/Activities section */}
      <div className='px-6'>
        <div className='bg-primary-50/30 p-1 rounded-lg border border-primary-50/70 flex gap-1 mb-3'>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
              activeTab === 'comments'
                ? 'bg-primary-300 text-white'
                : 'text-grey-500 hover:bg-primary-50'
            }`}
          >
            Comments (12)
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
              activeTab === 'activities'
                ? 'bg-primary-300 text-white'
                : 'text-grey-500 hover:bg-primary-50'
            }`}
          >
            Activities
          </button>
        </div>

        {/* Tab Content */}
        <div className='flex flex-col gap-2 mb-3'>
          {activeTab === 'comments' ? (
            <>
              {[...Array(7)].map((_, i) => (
                <div key={i} className='w-full h-0.5 bg-grey-50 rounded'></div>
              ))}
            </>
          ) : (
            <>
              {[...Array(7)].map((_, i) => (
                <div key={i} className='w-full h-0.5 bg-grey-100 rounded'></div>
              ))}
            </>
          )}
        </div>

        {/* Drop comment */}
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-grey-800'>
            Drop a Comment
          </label>
          <div className='h-12 border border-grey-50 bg-[#F2F2F366] rounded-md mb-2'></div>
          <div className='flex justify-end'>
            <button className='text-[10px] px-3 py-1.5 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-colors'>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== PREVIEW TEMPLATE 2 ==========
export const PreviewTemplate2 = ({ data }: { data: GiftPageData }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'activities'>(
    'comments'
  )

  return (
    <div className='w-full h-full flex flex-col gap-4 relative pb-8 bg-white'>
      <div className='absolute top-0 left-0 right-0 h-24 bg-warning-50'></div>

      <div className='px-6 pt-6 z-2'>
        {/* Circular image with socials */}
        <div className='flex justify-between items-end mb-4'>
          <div className='w-24 h-24 rounded-full border border-grey-50 overflow-hidden shadow-[0px_0px_0px_4px_#FFFFFF]'>
            {data.media.url ? (
              data.media.type === 'image' ? (
                <img
                  src={data.media.url}
                  alt='gift-page-media'
                  className='w-full h-full object-cover'
                />
              ) : (
                <video
                  src={data.media.url}
                  className='w-full h-full object-cover'
                  controls
                />
              )
            ) : (
              <Image
                src='/assets/images/place-holder-image.jpg'
                alt='place-holder-image'
                width={96}
                height={96}
                className='object-cover w-full h-full'
              />
            )}
          </div>
          <div className='flex flex-col gap-2 items-end'>
            <div className='flex gap-2'>
              {data.socialLinks.instagram && (
                <a
                  href={data.socialLinks.instagram}
                  className='w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <InstagramColored />
                  </span>
                </a>
              )}
              {data.socialLinks.twitter && (
                <a
                  href={data.socialLinks.twitter}
                  className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <XTwitterIcon />
                  </span>
                </a>
              )}
              {data.socialLinks.linkedin && (
                <a
                  href={data.socialLinks.linkedin}
                  className='w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <LinkedinIcon />
                  </span>
                </a>
              )}
            </div>
            <button
              className='py-1 px-2 rounded-full text-xs'
              style={{
                backgroundColor: data.button.backgroundColor,
                color: data.button.textColor,
              }}
            >
              {data.button.label}
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <h1
            className='font-semibold'
            style={{
              fontSize: `${parseInt(data.title.size) * 0.5}px`,
              fontWeight: data.title.bold ? 'bold' : 'normal',
              fontStyle: data.title.italic ? 'italic' : 'normal',
              textDecoration: data.title.underline ? 'underline' : 'none',
              textAlign: data.title.alignment,
              color: data.title.color,
              fontFamily: data.title.font,
            }}
          >
            {data.title.text}
          </h1>
          <p
            className='leading-snug'
            style={{
              fontSize: `${parseInt(data.description.size) * 0.8}px`,
              fontWeight: data.description.bold ? 'bold' : 'normal',
              fontStyle: data.description.italic ? 'italic' : 'normal',
              textDecoration: data.description.underline ? 'underline' : 'none',
              textAlign: data.description.alignment,
              color: data.description.color,
              fontFamily: data.description.font,
            }}
          >
            {data.description.text}
          </p>
        </div>
      </div>

      <div className='px-6'>
        <div className='bg-primary-50/30 p-1 rounded-lg border border-primary-50/70 flex gap-1 mb-3'>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
              activeTab === 'comments'
                ? 'bg-primary-300 text-white'
                : 'text-grey-500 hover:bg-primary-50'
            }`}
          >
            Comments (12)
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
              activeTab === 'activities'
                ? 'bg-primary-300 text-white'
                : 'text-grey-500 hover:bg-primary-50'
            }`}
          >
            Activities
          </button>
        </div>

        <div className='flex flex-col gap-2 mb-3'>
          {activeTab === 'comments' ? (
            <>
              {[...Array(7)].map((_, i) => (
                <div key={i} className='w-full h-0.5 bg-grey-50 rounded'></div>
              ))}
            </>
          ) : (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='w-full h-0.5 bg-grey-100 rounded'></div>
              ))}
            </>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-grey-800'>
            Drop a Comment
          </label>
          <div className='h-12 border border-grey-50 bg-[#F2F2F366] rounded-md mb-2'></div>
          <div className='flex justify-end'>
            <button className='text-[10px] px-3 py-1.5 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-colors'>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== PREVIEW TEMPLATE 3 ==========
export const PreviewTemplate3 = ({ data }: { data: GiftPageData }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'activities'>(
    'comments'
  )

  return (
    <div className='w-full h-full flex flex-col gap-4 relative pb-8 bg-white'>
      <div className='absolute top-[-20px] left-0 right-0 h-28 bg-secondary-100 rounded-full blur-[30px]'></div>

      <div className='px-6 pt-6 z-2'>
        <div className='flex gap-4 items-center mb-4'>
          {/* Description first */}
          <div className='flex-1 flex flex-col gap-2'>
            <h1
              className='font-semibold'
              style={{
                fontSize: `${parseInt(data.title.size) * 0.5}px`,
                fontWeight: data.title.bold ? 'bold' : 'normal',
                fontStyle: data.title.italic ? 'italic' : 'normal',
                textDecoration: data.title.underline ? 'underline' : 'none',
                textAlign: data.title.alignment,
                color: data.title.color,
                fontFamily: data.title.font,
              }}
            >
              {data.title.text}
            </h1>
            <p
              className='leading-snug mb-2'
              style={{
                fontSize: `${parseInt(data.description.size) * 0.8}px`,
                fontWeight: data.description.bold ? 'bold' : 'normal',
                fontStyle: data.description.italic ? 'italic' : 'normal',
                textDecoration: data.description.underline
                  ? 'underline'
                  : 'none',
                textAlign: data.description.alignment,
                color: data.description.color,
                fontFamily: data.description.font,
              }}
            >
              {data.description.text}
            </p>
            <button
              className='py-1 px-2 rounded-full text-xs w-fit'
              style={{
                backgroundColor: data.button.backgroundColor,
                color: data.button.textColor,
              }}
            >
              {data.button.label}
            </button>
            <div className='flex gap-2'>
              {data.socialLinks.instagram && (
                <a
                  href={data.socialLinks.instagram}
                  className='w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <InstagramColored />
                  </span>
                </a>
              )}
              {data.socialLinks.twitter && (
                <a
                  href={data.socialLinks.twitter}
                  className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <XTwitterIcon />
                  </span>
                </a>
              )}
              {data.socialLinks.linkedin && (
                <a
                  href={data.socialLinks.linkedin}
                  className='w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors'
                >
                  <span className='w-2.5 h-2.5 block'>
                    <LinkedinIcon />
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Image second */}
          <div className='flex-1'>
            <div className='w-full aspect-square rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#143535]'>
              {data.media.url ? (
                data.media.type === 'image' ? (
                  <img
                    src={data.media.url}
                    alt='gift-page-media'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <video
                    src={data.media.url}
                    className='w-full h-full object-cover'
                    controls
                  />
                )
              ) : (
                <Image
                  src='/assets/images/place-holder-image.jpg'
                  alt='place-holder-image'
                  width={150}
                  height={150}
                  className='w-full h-full object-cover'
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='px-6'>
        <div className='bg-primary-50/30 p-1 rounded-lg border border-primary-50/70 flex gap-1 mb-3'>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
              activeTab === 'comments'
                ? 'bg-primary-300 text-white'
                : 'text-grey-500 hover:bg-primary-50'
            }`}
          >
            Comments (12)
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
              activeTab === 'activities'
                ? 'bg-primary-300 text-white'
                : 'text-grey-500 hover:bg-primary-50'
            }`}
          >
            Activities
          </button>
        </div>

        <div className='flex flex-col gap-2 mb-3'>
          {activeTab === 'comments' ? (
            <>
              {[...Array(7)].map((_, i) => (
                <div key={i} className='w-full h-0.5 bg-grey-50 rounded'></div>
              ))}
            </>
          ) : (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='w-full h-0.5 bg-grey-100 rounded'></div>
              ))}
            </>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-grey-800'>
            Drop a Comment
          </label>
          <div className='h-12 border border-grey-50 bg-[#F2F2F366] rounded-md mb-2'></div>
          <div className='flex justify-end'>
            <button className='text-[10px] px-3 py-1.5 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-colors'>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== PREVIEW TEMPLATE 4 ==========
export const PreviewTemplate4 = ({ data }: { data: GiftPageData }) => {
  const [commentsOpen, setCommentsOpen] = useState(true)
  const [activitiesOpen, setActivitiesOpen] = useState(false)

  return (
    <div className='w-full h-full flex flex-col gap-3 relative pb-8 bg-white'>
      <div className='absolute top-0 left-0 right-0 h-full w-1/2 bg-secondary-50 rounded-br-[100px] blur-[30px]'></div>

      <div className='px-6 pt-6 z-2 flex gap-3'>
        {/* Left column */}
        <div className='flex-1 flex flex-col'>
          <div className='w-full mb-3'>
            <div className='w-full rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#143535]'>
              {data.media.url ? (
                data.media.type === 'image' ? (
                  <img
                    src={data.media.url}
                    alt='gift-page-media'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <video
                    src={data.media.url}
                    className='w-full h-full object-cover'
                    controls
                  />
                )
              ) : (
                <Image
                  src='/assets/images/place-holder-image.jpg'
                  alt='place-holder-image'
                  width={200}
                  height={112}
                  className='object-cover w-full h-full'
                />
              )}
            </div>
          </div>
          <h1
            className='font-semibold mb-1.5'
            style={{
              fontSize: `${parseInt(data.title.size) * 0.5}px`,
              fontWeight: data.title.bold ? 'bold' : 'normal',
              fontStyle: data.title.italic ? 'italic' : 'normal',
              textDecoration: data.title.underline ? 'underline' : 'none',
              textAlign: data.title.alignment,
              color: data.title.color,
              fontFamily: data.title.font,
            }}
          >
            {data.title.text}
          </h1>
          <div className='flex gap-2 mb-1.5'>
            {data.socialLinks.instagram && (
              <a
                href={data.socialLinks.instagram}
                className='w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center'
              >
                <span className='w-2.5 h-2.5 block'>
                  <InstagramColored />
                </span>
              </a>
            )}
            {data.socialLinks.twitter && (
              <a
                href={data.socialLinks.twitter}
                className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'
              >
                <span className='w-2.5 h-2.5 block'>
                  <XTwitterIcon />
                </span>
              </a>
            )}
            {data.socialLinks.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                className='w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center'
              >
                <span className='w-2.5 h-2.5 block'>
                  <LinkedinIcon />
                </span>
              </a>
            )}
          </div>
          <p
            className='leading-snug'
            style={{
              fontSize: `${parseInt(data.description.size) * 0.8}px`,
              fontWeight: data.description.bold ? 'bold' : 'normal',
              fontStyle: data.description.italic ? 'italic' : 'normal',
              textDecoration: data.description.underline ? 'underline' : 'none',
              textAlign: data.description.alignment,
              color: data.description.color,
              fontFamily: data.description.font,
            }}
          >
            {data.description.text}
          </p>
        </div>

        {/* Right column */}
        <div className='flex-1 flex flex-col gap-2'>
          <div className='flex justify-end'>
            <button
              className='py-1 px-2 rounded-full text-xs'
              style={{
                backgroundColor: data.button.backgroundColor,
                color: data.button.textColor,
              }}
            >
              {data.button.label}
            </button>
          </div>

          <div className='flex flex-col gap-2'>
            {/* Comments Accordion */}
            <div className='border rounded-md border-grey-100 flex flex-col'>
              <button
                onClick={() => setCommentsOpen(!commentsOpen)}
                className='flex justify-between items-center bg-[#F3F2F280] p-2 hover:bg-[#F3F2F2] transition-colors'
              >
                <span className='text-[10px] font-medium text-grey-900'>
                  Comments (12)
                </span>
                <span
                  className={`w-3 h-3 transition-transform ${
                    commentsOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDownIcon />
                </span>
              </button>
              {commentsOpen && (
                <div className='flex flex-col gap-1 p-2'>
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className='w-full h-0.5 bg-grey-50 rounded'
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Activities Accordion */}
            <div className='border rounded-md border-grey-100 flex flex-col'>
              <button
                onClick={() => setActivitiesOpen(!activitiesOpen)}
                className='flex justify-between items-center bg-[#F3F2F280] p-2 hover:bg-[#F3F2F2] transition-colors'
              >
                <span className='text-[10px] font-medium text-grey-900'>
                  Activities
                </span>
                <span
                  className={`w-3 h-3 transition-transform ${
                    activitiesOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDownIcon />
                </span>
              </button>
              {activitiesOpen && (
                <div className='flex flex-col gap-1 p-2'>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className='w-full h-0.5 bg-grey-50 rounded'
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Drop Comment */}
            <div className='flex flex-col gap-1'>
              <label className='text-[10px] font-medium text-grey-800'>
                Drop a Comment
              </label>
              <div className='h-10 border border-grey-50 bg-[#F2F2F366] rounded-md mb-1'></div>
              <div className='flex justify-end'>
                <button className='text-[9px] px-2 py-1 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-colors'>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
