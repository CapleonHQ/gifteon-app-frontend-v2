import Image from 'next/image'

const ProfileAvatar = () => {
  return (
    <div className='w-[100px] md:w-[140px] h-[100px] md:h-[140px] rounded-full border-2 border-white bg-primary-50 shadow-[0px_10px_18px_-2px_#10192812] flex items-center justify-center overflow-hidden'>
      <Image
        src='/assets/images/place-holder-image.jpg'
        alt='Profile avatar'
        width={180}
        height={180}
        className='w-full h-full object-cover'
      />
    </div>
  )
}

export default ProfileAvatar
