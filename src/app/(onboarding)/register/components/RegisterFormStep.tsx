'use client'

import type { ChangeEvent, SyntheticEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import FormErrorAlert from '../../components/FormErrorAlert'
import SocialAuthButtons from '../../components/SocialAuthButtons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COUNTRIES } from '@/lib/constants/countries'

type RegisterFormStepProps = {
  firstName: string
  lastName: string
  email: string
  country: string
  gender: 'male' | 'female' | ''
  emailError: string
  error: string
  isLoading: boolean
  isFormValid: boolean
  onFirstNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onLastNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCountryChange: (country: string) => void
  onGenderChange: (gender: 'male' | 'female') => void
  onRegister: (event: SyntheticEvent) => void
  onDismissError: () => void
  onSocialRegister: (provider: 'google' | 'apple') => void
}

const RegisterFormStep = ({
  firstName,
  lastName,
  email,
  country,
  gender,
  emailError,
  error,
  isLoading,
  isFormValid,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onCountryChange,
  onGenderChange,
  onRegister,
  onDismissError,
  onSocialRegister,
}: RegisterFormStepProps) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
      key='register'
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-4 sm:gap-5 lg:gap-7 items-center w-full'
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='mb-2 flex flex-col items-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Create Your Account
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[100%]'>
          Please provide the following details
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='space-y-6 w-full max-w-[450px] mx-auto'
      >
        <AnimatePresence>
          {error && (
            <FormErrorAlert
              title='Registration Failed'
              message={error}
              onDismiss={onDismissError}
            />
          )}
        </AnimatePresence>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='firstName'
            className='text-sm font-medium leading-[145%] text-grey-900'
          >
            First Name
          </label>
          <input
            type='text'
            id='firstName'
            value={firstName}
            onChange={onFirstNameChange}
            placeholder='Enter your first name'
            className='w-full text-sm px-3 py-3.5 border border-grey-50 rounded-[12px] outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-blackish placeholder-grey-400'
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='lastName'
            className='text-sm font-medium leading-[145%] text-grey-900'
          >
            Last Name
          </label>
          <input
            type='text'
            id='lastName'
            value={lastName}
            onChange={onLastNameChange}
            placeholder='Enter your last name'
            className='w-full text-sm px-3 py-3.5 border border-grey-50 rounded-[12px] outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-blackish placeholder-grey-400'
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='email'
            className='text-sm font-medium leading-[145%] text-grey-900'
          >
            Enter Email Address
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={onEmailChange}
            placeholder='Enter your email address'
            className={`w-full text-sm px-3 py-3.5 border rounded-[12px] outline-none focus:ring-1 transition-all duration-200 text-blackish placeholder-grey-400 ${
              emailError
                ? 'border-error-500 focus:ring-error-500 focus:border-transparent'
                : 'border-grey-50 focus:ring-primary-500 focus:border-transparent'
            }`}
            required
          />
          <AnimatePresence>
            {emailError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='text-error-500 text-xs mt-1 overflow-hidden'
              >
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='country'
            className='text-sm font-medium leading-[145%] text-grey-900'
          >
            Country
          </label>
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger
              id='country'
              className='w-full border-grey-50 rounded-[12px] text-sm text-blackish font-medium h-[48px]! shadow-none! bg-white'
            >
              <SelectValue placeholder='Select your country' />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              {COUNTRIES.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium leading-[145%] text-grey-900'>
            Gender
          </label>
          <div className='flex gap-4'>
            <motion.button
              type='button'
              whileTap={{ scale: 0.98 }}
              onClick={() => onGenderChange('male')}
              className={`flex items-center space-x-2 cursor-pointer flex-1 px-4 py-3 border rounded-[12px] transition-all duration-200 ${
                gender === 'male'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-grey-200 hover:border-grey-300'
              }`}
            >
              <div
                className='relative w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center'
                style={{
                  borderColor: gender === 'male' ? '#97c6d3' : '#D1D5DB',
                }}
              >
                <AnimatePresence>
                  {gender === 'male' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className='w-2.5 h-2.5 rounded-full bg-primary-500'
                    />
                  )}
                </AnimatePresence>
              </div>
              <span className='text-sm text-grey-900'>Male</span>
            </motion.button>

            <motion.button
              type='button'
              whileTap={{ scale: 0.98 }}
              onClick={() => onGenderChange('female')}
              className={`flex items-center space-x-2 cursor-pointer flex-1 px-4 py-3 border rounded-[12px] transition-all duration-200 ${
                gender === 'female'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-grey-200 hover:border-grey-300'
              }`}
            >
              <div
                className='relative w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center'
                style={{
                  borderColor: gender === 'female' ? '#97c6d3' : '#D1D5DB',
                }}
              >
                <AnimatePresence>
                  {gender === 'female' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className='w-2.5 h-2.5 rounded-full bg-primary-500'
                    />
                  )}
                </AnimatePresence>
              </div>
              <span className='text-sm text-grey-900'>Female</span>
            </motion.button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: isFormValid && !isLoading ? 1.01 : 1 }}
          whileTap={{ scale: isFormValid && !isLoading ? 0.99 : 1 }}
          onClick={(event) => {
            event.preventDefault()
            onRegister(event)
          }}
          disabled={isLoading || !isFormValid}
          className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 disabled:from-primary-400/50 disabled:to-primary-600/50 disabled:border-none disabled:cursor-not-allowed transition-colors'
        >
          {isLoading ? (
            <div className='flex items-center justify-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='flex items-center justify-center w-full'
      >
        <span className='text-grey-600'>OR</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='flex flex-col gap-7 w-full max-w-[450px] mx-auto'
      >
        <SocialAuthButtons onSelect={onSocialRegister} />

        <p className='text-center text-grey-600 sm:text-xl font-medium mb-6'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-primary-400 font-semibold hover:text-primary-600 transition-colors duration-200 underline'
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default RegisterFormStep
