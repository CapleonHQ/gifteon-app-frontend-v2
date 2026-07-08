import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/initials'

interface ReviewCardProps {
  name: string
  image: string
  copy: string
}

const ReviewCard = ({ name, image, copy }: ReviewCardProps) => (
  <article className='lg:w-[390px] shrink-0 rounded-[16px] bg-[#FFF8F280] px-3 py-3 lg:py-[26px] lg:px-6'>
    <div className='mb-3 flex items-center gap-2'>
      <Avatar className='h-8 w-8 shrink-0'>
        <AvatarImage src={image} alt={name} className='object-cover' />
        <AvatarFallback className='bg-primary-100 text-sm font-semibold text-primary-700'>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <h5 className='text-xl leading-6 font-medium text-blackish'>{name}</h5>
    </div>
    <p className='leading-6 text-grey-600'>{copy}</p>
  </article>
)

export default ReviewCard
