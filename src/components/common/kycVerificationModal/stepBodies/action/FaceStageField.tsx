import { useEffect, useMemo } from 'react'
import type { ChangeEvent, RefObject } from 'react'
import Image from 'next/image'
import FaceScanIcon from '@/assets/icons/FaceScanIcon'
import type { FaceCaptureStage } from './types'

type FaceStageFieldProps = {
  faceFile: File | null
  faceInputRef: RefObject<HTMLInputElement | null>
  faceCaptureStage: FaceCaptureStage
  faceScanProgress: number
  onFaceFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
}

const FaceStageField = ({
  faceFile,
  faceInputRef,
  faceCaptureStage,
  faceScanProgress,
  onFaceFileSelect,
}: FaceStageFieldProps) => {
  const facePreviewUrl = useMemo(() => {
    if (!faceFile) return ''
    return URL.createObjectURL(faceFile)
  }, [faceFile])

  useEffect(() => {
    return () => {
      if (facePreviewUrl) URL.revokeObjectURL(facePreviewUrl)
    }
  }, [facePreviewUrl])

  return (
    <div className='space-y-5'>
      <input
        ref={faceInputRef}
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={onFaceFileSelect}
        className='hidden'
      />

      <div className='mt-4 lg:mt-0 flex flex-col items-center justify-center gap-8'>
        {faceCaptureStage === 'idle' ? (
          <>
            <div className='lg:h-[250px] flex justify-center items-center'>
              <div className='w-[100px] h-[100px] flex items-center justify-center bg-primary-50 rounded-full'>
                <div className='w-20 h-20 flex items-center justify-center rounded-full bg-primary-100'>
                  <div className='w-15 h-15 rounded-full bg-primary-400 flex items-center justify-center'>
                    <span className='w-6 h-6 rounded-full text-white flex items-center justify-center'>
                      <FaceScanIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className='text-center text-grey-600 text-sm'>
              Scan your face to verify your identity
            </p>
          </>
        ) : (
          <>
            <div className='relative'>
              <div className='rounded-[20px] border border-dashed border-primary-100 overflow-hidden bg-grey-50'>
                {facePreviewUrl ? (
                  <div className='w-full h-[320px]'>
                    <Image
                      src={facePreviewUrl}
                      alt='Face preview'
                      width={800}
                      height={620}
                      unoptimized
                      className='w-full h-full object-cover'
                    />
                  </div>
                ) : (
                  <div className='h-[310px] flex items-center justify-center text-grey-500 text-sm'>
                    Face image not available
                  </div>
                )}
              </div>
              {faceCaptureStage === 'scanning' ? (
                <div className='absolute inset-0 pointer-events-none'>
                  <div className='absolute inset-0 bg-black/10' />
                  <div className='absolute inset-x-6 top-6 bottom-6 border border-white/60 rounded-[14px]' />
                </div>
              ) : null}
            </div>

            {faceCaptureStage === 'preview' ? (
              <p className='text-center text-grey-600 text-sm'>
                Please look into the camera and hold still
              </p>
            ) : null}

            {faceCaptureStage === 'scanning' || faceCaptureStage === 'ready' ? (
              <div className='space-y-2'>
                <p className='text-center text-3xl text-blackish font-medium'>
                  {faceCaptureStage === 'ready' ? 'Scan Complete' : 'Scanning...'}
                </p>
                <div className='h-3 rounded-full bg-grey-100 overflow-hidden'>
                  <div
                    className='h-full bg-primary-500 transition-all duration-300'
                    style={{
                      width: `${faceCaptureStage === 'ready' ? 100 : faceScanProgress}%`,
                    }}
                  />
                </div>
                <p className='text-center text-grey-600 text-sm'>
                  {faceCaptureStage === 'ready'
                    ? 'Your face has been captured successfully.'
                    : 'Please keep your face centered so we can capture your face.'}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export default FaceStageField
