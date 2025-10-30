import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  InstagramColored,
  LinkedinIcon,
  XTwitterIcon,
  ChevronDownIcon,
} from '../../../assets/icons'

export const TEMPLATES = [
  {
    id: 1,
    title: 'Template 1',
    description: 'Side by side layout',
    layout: 'template1',
  },
  {
    id: 2,
    title: 'Template 2',
    description: 'Centered circular image',
    layout: 'template2',
  },
  {
    id: 3,
    title: 'Template 3',
    description: 'Horizontal split view',
    layout: 'template3',
  },
  {
    id: 4,
    title: 'Template 4',
    description: 'Grid layout',
    layout: 'template4',
  },
]

// ========== SELECTION TEMPLATES (Scaled for grid view) ==========
export const Template1Selection = () => (
  <div className='w-full h-full flex flex-col gap-3 relative pb-6 bg-white'>
    {/* Colored Background - scaled down */}
    <div className='absolute top-0 left-0 right-0 h-32 bg-warning-50'></div>

    <div className='px-4 pt-5 z-2'>
      <h1 className='text-xs font-semibold mb-2 text-blackish'>Title here</h1>

      <div className='flex gap-3 items-center mb-3'>
        {/* Image - scaled down */}
        <div className='flex-1'>
          <div className='w-full aspect-square rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#143535]'>
            <Image
              src='/assets/images/place-holder-image.jpg'
              alt='place-holder-image'
              width={100}
              height={100}
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        {/* Description side - scaled down */}
        <div className='flex-1 flex flex-col gap-1.5'>
          <p className='text-[7px] text-grey-800 leading-tight'>
            You can include the description of the celebration here. You can
            include the description of the celebration here. You can include the
            description of the celebration here.
          </p>
          <button className='bg-primary-900 py-1 px-2 rounded-full text-white text-[8px]'>
            Say something nice 🥰
          </button>
          <div className='flex gap-1'>
            <div className='w-3 h-3 rounded-full bg-pink-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <InstagramColored />
              </span>
            </div>
            <div className='w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <XTwitterIcon />
              </span>
            </div>
            <div className='w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <LinkedinIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Comments section - scaled down */}
    <div className='px-4'>
      <div className='bg-primary-50/30 p-0.5 rounded-md border border-primary-50/70 flex gap-1 mb-1.5'>
        <button className='bg-primary-300 py-1 text-[8px] font-medium text-white rounded flex-1'>
          Comments (12)
        </button>
        <button className='py-1 text-[8px] font-medium text-grey-500 rounded flex-1'>
          Activities
        </button>
      </div>

      {/* Comment lines */}
      <div className='flex flex-col gap-1 mb-2'>
        {[...Array(7)].map((_, i) => (
          <div key={i} className='w-full h-0.5 bg-grey-50'></div>
        ))}
      </div>

      {/* Drop comment - scaled down */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-[8px] font-medium text-grey-800'>
          Drop a Comment
        </label>
        <div className='h-8 border border-grey-50 bg-[#F2F2F366] rounded-md mb-1'></div>
        <div className='flex justify-end'>
          <button className='text-[7px] px-2 py-1 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md'>
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
)

export const Template2Selection = () => (
  <div className='w-full h-full flex flex-col gap-3 relative pb-6 bg-white'>
    <div className='absolute top-0 left-0 right-0 h-20 bg-warning-50'></div>

    <div className='px-4 pt-5 z-2'>
      {/* Circular image with socials */}
      <div className='flex justify-between items-end mb-3'>
        <div className='w-20 h-20 rounded-full border border-grey-50 overflow-hidden shadow-[0px_0px_0px_3px_#FFFFFF]'>
          <Image
            src='/assets/images/place-holder-image.jpg'
            alt='place-holder-image'
            width={80}
            height={80}
            className='object-cover w-full h-full'
          />
        </div>
        <div className='flex flex-col gap-2 items-end'>
          <div className='flex gap-1'>
            <div className='w-3 h-3 rounded-full bg-pink-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <InstagramColored />
              </span>
            </div>
            <div className='w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <XTwitterIcon />
              </span>
            </div>
            <div className='w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <LinkedinIcon />
              </span>
            </div>
          </div>
          <button className='bg-primary-900 py-1 px-2 rounded-full text-white text-[8px]'>
            Say something nice 🥰
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <h1 className='text-xs font-semibold text-blackish'>Title here</h1>
        <p className='text-[7px] text-grey-800 leading-tight'>
          You can include the description of the celebration here. You can
          include the description of the celebration here. You can include the
          description of the celebration here.
        </p>
      </div>
    </div>

    <div className='px-4'>
      <div className='bg-primary-50/30 p-0.5 rounded-md border border-primary-50/70 flex gap-1 mb-1.5'>
        <button className='bg-primary-300 py-1 text-[8px] font-medium text-white rounded flex-1'>
          Comments (12)
        </button>
        <button className='py-1 text-[8px] font-medium text-grey-500 rounded flex-1'>
          Activities
        </button>
      </div>

      <div className='flex flex-col gap-1 mb-2'>
        {[...Array(7)].map((_, i) => (
          <div key={i} className='w-full h-0.5 bg-grey-50'></div>
        ))}
      </div>

      <div className='flex flex-col gap-0.5'>
        <label className='text-[8px] font-medium text-grey-800'>
          Drop a Comment
        </label>
        <div className='h-8 border border-grey-50 bg-[#F2F2F366] rounded-md mb-1'></div>
        <div className='flex justify-end'>
          <button className='text-[7px] px-2 py-1 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md'>
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
)

export const Template3Selection = () => (
  <div className='w-full h-full flex flex-col gap-3 relative pb-6 bg-white'>
    <div className='absolute top-[-10px] left-0 right-0 h-20 bg-secondary-100 rounded-full blur-[20px]'></div>

    <div className='px-4 pt-5 z-2'>
      <div className='flex gap-3 items-center mb-3'>
        {/* Description first */}
        <div className='flex-1 flex flex-col gap-1'>
          <h1 className='text-xs font-semibold text-blackish'>Title here</h1>
          <p className='text-[7px] text-grey-800 leading-tight mb-1'>
            You can include the description of the celebration here. You can
            include the description of the celebration here. You can include the
            description of the celebration here.
          </p>
          <button className='bg-primary-900 py-1 px-2 rounded-full text-white text-[8px] w-fit'>
            Say something nice 🥰
          </button>
          <div className='flex gap-1'>
            <div className='w-3 h-3 rounded-full bg-pink-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <InstagramColored />
              </span>
            </div>
            <div className='w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <XTwitterIcon />
              </span>
            </div>
            <div className='w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 block'>
                <LinkedinIcon />
              </span>
            </div>
          </div>
        </div>

        {/* Image second */}
        <div className='flex-1'>
          <div className='w-full aspect-square rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#143535]'>
            <Image
              src='/assets/images/place-holder-image.jpg'
              alt='place-holder-image'
              width={100}
              height={100}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>
    </div>

    <div className='px-4'>
      <div className='bg-primary-50/30 p-0.5 rounded-md border border-primary-50/70 flex gap-1 mb-1.5'>
        <button className='bg-primary-300 py-1 text-[8px] font-medium text-white rounded flex-1'>
          Comments (12)
        </button>
        <button className='py-1 text-[8px] font-medium text-grey-500 rounded flex-1'>
          Activities
        </button>
      </div>

      <div className='flex flex-col gap-1 mb-2'>
        {[...Array(7)].map((_, i) => (
          <div key={i} className='w-full h-0.5 bg-grey-50'></div>
        ))}
      </div>

      <div className='flex flex-col gap-0.5'>
        <label className='text-[8px] font-medium text-grey-800'>
          Drop a Comment
        </label>
        <div className='h-8 border border-grey-50 bg-[#F2F2F366] rounded-md mb-1'></div>
        <div className='flex justify-end'>
          <button className='text-[7px] px-2 py-1 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md'>
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
)

export const Template4Selection = () => (
  <div className='w-full h-full flex flex-col gap-2 relative pb-6 bg-white'>
    <div className='absolute top-0 left-0 right-0 h-full w-1/2 bg-secondary-50 rounded-br-[80px] blur-[20px]'></div>

    <div className='px-4 pt-5 z-2 flex gap-2'>
      {/* Left column */}
      <div className='flex-1 flex flex-col'>
        <div className='w-full mb-2'>
          <div className='w-full  rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#143535]'>
            <Image
              src='/assets/images/place-holder-image.jpg'
              alt='place-holder-image'
              width={150}
              height={84}
              className='object-cover w-full h-full'
            />
          </div>
        </div>
        <h1 className='text-xs font-semibold mb-1 text-blackish'>Title here</h1>
        <div className='flex gap-1 mb-1'>
          <div className='w-3 h-3 rounded-full bg-pink-100 flex items-center justify-center'>
            <span className='w-1.5 h-1.5 block'>
              <InstagramColored />
            </span>
          </div>
          <div className='w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center'>
            <span className='w-1.5 h-1.5 block'>
              <XTwitterIcon />
            </span>
          </div>
          <div className='w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center'>
            <span className='w-1.5 h-1.5 block'>
              <LinkedinIcon />
            </span>
          </div>
        </div>
        <p className='text-[7px] text-grey-800 leading-tight'>
          You can include the description of the celebration here. You can
          include the description of the celebration here. You can include the
          description of the celebration here.
        </p>
      </div>

      {/* Right column */}
      <div className='flex-1 flex flex-col gap-2'>
        <div className='flex justify-end'>
          <button className='bg-primary-900 py-1 px-2 rounded-full text-white text-[8px]'>
            Say something nice 🥰
          </button>
        </div>

        <div className='border rounded-md border-grey-100 flex flex-col'>
          <div className='flex justify-between items-center bg-[#F3F2F280] p-1'>
            <span className='text-[8px] font-medium text-grey-900'>
              Comments (12)
            </span>
            <span className='w-2 h-2'>
              <ChevronDownIcon />
            </span>
          </div>
          <div className='flex flex-col gap-0.5 p-1'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='w-full h-0.5 bg-grey-50'></div>
            ))}
          </div>
        </div>

        <div className='border rounded-md border-grey-100 flex flex-col'>
          <div className='flex justify-between items-center bg-[#F3F2F280] p-1'>
            <span className='text-[8px] font-medium text-grey-900'>
              Activities
            </span>
            <span className='w-2 h-2'>
              <ChevronDownIcon />
            </span>
          </div>
          <div className='flex flex-col gap-0.5 p-1'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='w-full h-0.5 bg-grey-50'></div>
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-0.5'>
          <label className='text-[7px] font-medium text-grey-800'>
            Drop a Comment
          </label>
          <div className='h-8 border border-grey-50 bg-[#F2F2F366] rounded-md mb-0.5'></div>
          <div className='flex justify-end'>
            <button className='text-[6px] px-1.5 py-0.5 bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md'>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)
