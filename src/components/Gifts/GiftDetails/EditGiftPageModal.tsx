'use client'

import { useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import RadioField from '@/components/Gifts/CreateNewGiftPage/Components/RadioField'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'

type EditGiftPageModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const EditGiftPageModal = ({
  isOpen,
  onClose,
  onSuccess,
}: EditGiftPageModalProps) => {
  const [privacy, setPrivacy] = useState('shareable')
  const [enableWishes, setEnableWishes] = useState('yes')
  const [allowAnonymous, setAllowAnonymous] = useState('yes')
  const [notifyGift, setNotifyGift] = useState('yes')
  const [notifyWish, setNotifyWish] = useState('yes')

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-30 lg:z-50'>
      <div
        className='hidden lg:block absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />

      <div className='hidden lg:flex items-center justify-center px-4 h-full'>
        <div className='relative w-full max-w-[540px] max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col'>
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

          <div className='flex flex-col flex-1 min-h-0'>
            <div className='px-6 sm:px-10 pt-6 sm:pt-10 pb-4'>
              <h3 className='text-[28px] font-medium text-blackish text-center'>
                Edit Gift Page
              </h3>
            </div>

            <div className='px-6 sm:px-10 pb-6 overflow-y-auto flex-1 min-h-0'>
              <div className='space-y-4'>
                <div>
                  <RadioField
                    label='Gift Page Privacy Control'
                    value={privacy}
                    onChange={setPrivacy}
                    options={[
                      { value: 'public', label: 'Public' },
                      { value: 'shareable', label: 'Shareable' },
                      { value: 'private', label: 'Private' },
                    ]}
                    grid='grid-cols-3'
                  />
                  <div className='text-xs text-grey-500 mt-1'>
                    <p>
                      Public: Visible to everyone on Giftseon and shareable
                      anywhere.
                    </p>
                    <p>
                      Shareable: Visible to anyone with the link and QR code.
                    </p>
                    <p>
                      Private: Visible only to people you add as recipients.
                    </p>
                  </div>
                </div>

                <RadioField
                  label='Enable Wishes'
                  value={enableWishes}
                  onChange={setEnableWishes}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />

                <RadioField
                  label='Allow Anonymous Gift'
                  value={allowAnonymous}
                  onChange={setAllowAnonymous}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />

                <RadioField
                  label='Notify me when someone sends a gift'
                  value={notifyGift}
                  onChange={setNotifyGift}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />

                <RadioField
                  label='Notify me for each new wish'
                  value={notifyWish}
                  onChange={setNotifyWish}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
              </div>
            </div>

            <div className='px-6 sm:px-10 pb-6 sm:pb-10'>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={() => {
                    onClose()
                    onSuccess()
                  }}
                  className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='lg:hidden fixed inset-x-0 bottom-0 top-[72.5px] bg-white flex flex-col'>
        <div className='px-4 pt-10 pb-4 flex items-center gap-1'>
          <button
            type='button'
            onClick={onClose}
            className='w-6 h-6'
            aria-label='Go back'
          >
            <span className='text-blackish hover:text-black/70 flex'>
              <BackLeftIcon />
            </span>
          </button>

          <h3 className='text-2xl font-semibold text-blackish'>Edit Page</h3>
        </div>
        <div className='flex-1 overflow-y-auto px-4 pb-4 space-y-4'>
          <div>
            <RadioField
              label='Gift Page Privacy Control'
              value={privacy}
              onChange={setPrivacy}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'shareable', label: 'Shareable' },
                { value: 'private', label: 'Private' },
              ]}
              grid='grid-cols-3'
            />
            <div className='text-xs text-grey-500 mt-1'>
              <p>
                Public: Visible to everyone on Giftseon and shareable anywhere.
              </p>
              <p>Shareable: Visible to anyone with the link and QR code.</p>
              <p>Private: Visible only to people you add as recipients.</p>
            </div>
          </div>

          <RadioField
            label='Enable Wishes'
            value={enableWishes}
            onChange={setEnableWishes}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          <RadioField
            label='Allow Anonymous Gift'
            value={allowAnonymous}
            onChange={setAllowAnonymous}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          <RadioField
            label='Notify me when someone sends a gift'
            value={notifyGift}
            onChange={setNotifyGift}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          <RadioField
            label='Notify me for each new wish'
            value={notifyWish}
            onChange={setNotifyWish}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </div>
        <div className='px-4 pb-4 pt-2 bg-white border-t border-grey-50 flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={() => {
              onClose()
              onSuccess()
            }}
            className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditGiftPageModal
