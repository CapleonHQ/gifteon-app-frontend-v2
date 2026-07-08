import Link from 'next/link'
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Clock3,
  ArrowRight,
} from 'lucide-react'

const supportChannels = [
  {
    title: 'Email Support',
    description: 'Best for account issues and order support.',
    value: 'support@giftseon.com',
    href: 'mailto:support@giftseon.com',
    icon: Mail,
  },
  {
    title: 'Phone Support',
    description: 'Talk to our team during business hours.',
    value: '+234 700 123 4567',
    href: 'tel:+2347001234567',
    icon: Phone,
  },
  {
    title: 'Live Chat',
    description: 'Quick help from our support agents.',
    value: 'Start a chat session',
    href: '/contact-us#contact-form',
    icon: MessageSquare,
  },
]

const quickFaq = [
  'How long do refunds and disputes take?',
  'How do I track order and delivery updates?',
  'Can merchants onboard and list products for free?',
]

export default function ContactContent() {
  return (
    <main className='bg-base-bg'>
      <section className='px-4 py-15 lg:px-20 lg:py-20'>
        <div className='mx-auto flex w-full max-w-[960px] flex-col items-center gap-2 text-center'>
          <div className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-[2px] border border-primary-50 bg-[#AEAEFD]' />
            <h4 className='font-bold lg:text-xl lg:leading-6'>Contact Us</h4>
          </div>
          <h1 className='text-[34px] leading-10 text-grey-800 lg:text-[48px] lg:leading-[56px]'>
            We are here to help you celebrate confidently
          </h1>
          <p className='mt-1 max-w-[72ch] text-base leading-7 text-grey-700 lg:text-lg'>
            Reach out for support, partnerships, or product questions. Our team
            typically responds within 24 hours.
          </p>
        </div>
      </section>

      <section className='px-4 pb-15 lg:px-20 lg:pb-20'>
        <div className='mx-auto grid w-full max-w-[1320px] gap-6 lg:grid-cols-[420fr_560fr] lg:gap-8'>
          <div className='flex flex-col gap-4'>
            {supportChannels.map((channel) => {
              const Icon = channel.icon
              return (
                <article
                  key={channel.title}
                  className='rounded-[16px] border border-grey-100 bg-white p-5 shadow-[0px_10px_24px_-18px_#10192826]'
                >
                  <div className='flex items-start gap-3'>
                    <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500'>
                      <Icon className='h-5 w-5' />
                    </span>
                    <div>
                      <h2 className='text-lg font-semibold leading-7 text-blackish'>
                        {channel.title}
                      </h2>
                      <p className='mt-1 text-sm leading-6 text-grey-700'>
                        {channel.description}
                      </p>
                      <Link
                        href={channel.href}
                        className='mt-2 inline-flex items-center gap-1 text-base font-medium leading-6 text-primary-500 hover:text-primary-600'
                      >
                        {channel.value}
                        <ArrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}

            <article className='rounded-[16px] border border-grey-100 bg-white p-5 shadow-[0px_10px_24px_-18px_#10192826]'>
              <h3 className='text-lg font-semibold leading-7 text-blackish'>
                Office & Hours
              </h3>
              <div className='mt-3 flex items-start gap-2 text-grey-700'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-primary-500' />
                <p className='text-sm leading-6'>
                  Victoria Island, Lagos, Nigeria.
                </p>
              </div>
              <div className='mt-2 flex items-start gap-2 text-grey-700'>
                <Clock3 className='mt-0.5 h-4 w-4 shrink-0 text-primary-500' />
                <p className='text-sm leading-6'>
                  Monday - Friday, 9:00 AM - 6:00 PM (WAT)
                </p>
              </div>
            </article>

            <article className='rounded-[16px] border border-grey-100 bg-white p-5 shadow-[0px_10px_24px_-18px_#10192826]'>
              <h3 className='text-lg font-semibold leading-7 text-blackish'>
                Popular Questions
              </h3>
              <ul className='mt-3 space-y-2'>
                {quickFaq.map((question) => (
                  <li
                    key={question}
                    className='text-sm leading-6 text-grey-700'
                  >
                    • {question}
                  </li>
                ))}
              </ul>
              <Link
                href='/#faqs'
                className='mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600'
              >
                View all FAQs
                <ArrowRight className='h-4 w-4' />
              </Link>
            </article>
          </div>

          <section
            id='contact-form'
            className='rounded-[20px] border border-grey-100 bg-white p-5 shadow-[0px_12px_30px_-18px_#1019282E] lg:p-7'
          >
            <h2 className='text-[28px] font-semibold leading-9 text-blackish lg:text-[32px] lg:leading-10'>
              Send us a message
            </h2>
            <p className='mt-1 text-sm leading-6 text-grey-700 lg:text-base'>
              Fill in your details and a support specialist will get back to
              you.
            </p>

            <form
              className='mt-6 grid gap-4'
              method='post'
              action='mailto:support@giftseon.com'
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='grid gap-1.5'>
                  <span className='text-sm font-medium text-grey-800'>
                    First Name
                  </span>
                  <input
                    name='firstName'
                    type='text'
                    required
                    className='h-[52px] rounded-[12px] border border-grey-200 bg-white px-4 text-base text-blackish outline-none transition-colors placeholder:text-grey-400 focus:border-primary-300'
                    placeholder='Adenike'
                  />
                </label>
                <label className='grid gap-1.5'>
                  <span className='text-sm font-medium text-grey-800'>
                    Last Name
                  </span>
                  <input
                    name='lastName'
                    type='text'
                    required
                    className='h-[52px] rounded-[12px] border border-grey-200 bg-white px-4 text-base text-blackish outline-none transition-colors placeholder:text-grey-400 focus:border-primary-300'
                    placeholder='Abioye'
                  />
                </label>
              </div>

              <label className='grid gap-1.5'>
                <span className='text-sm font-medium text-grey-800'>
                  Email Address
                </span>
                <input
                  name='email'
                  type='email'
                  required
                  className='h-[52px] rounded-[12px] border border-grey-200 bg-white px-4 text-base text-blackish outline-none transition-colors placeholder:text-grey-400 focus:border-primary-300'
                  placeholder='you@example.com'
                />
              </label>

              <label className='grid gap-1.5'>
                <span className='text-sm font-medium text-grey-800'>
                  Subject
                </span>
                <input
                  name='subject'
                  type='text'
                  required
                  className='h-[52px] rounded-[12px] border border-grey-200 bg-white px-4 text-base text-blackish outline-none transition-colors placeholder:text-grey-400 focus:border-primary-300'
                  placeholder='How can we help you?'
                />
              </label>

              <label className='grid gap-1.5'>
                <span className='text-sm font-medium text-grey-800'>
                  Message
                </span>
                <textarea
                  name='message'
                  required
                  rows={6}
                  className='rounded-[12px] border border-grey-200 bg-white px-4 py-3 text-base text-blackish outline-none transition-colors placeholder:text-grey-400 focus:border-primary-300'
                  placeholder='Tell us what you need support with...'
                />
              </label>

              <div className='mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <p className='text-xs leading-5 text-grey-600'>
                  By submitting, you agree to our response and support policy.
                </p>
                <button
                  type='submit'
                  className='inline-flex h-[52px] items-center justify-center rounded-[12px] border border-primary-500 bg-linear-to-b from-primary-400 from-17% to-primary-600 px-6 text-base font-medium text-white transition-colors duration-300 hover:from-primary-500 hover:to-primary-700'
                >
                  Send Message
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  )
}
