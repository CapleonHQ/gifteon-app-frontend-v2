import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  LifeBuoy,
  MessageSquare,
  Shield,
} from 'lucide-react'
import { faqItems } from '@/components/LandingPage/Homepage/faqItems'

const helpCategories = [
  {
    title: 'Getting Started',
    description:
      'Learn how to create a gift page, invite contributors, and set up your first celebration.',
    items: [
      'Create and customize a gift page',
      'Share your page with family and friends',
      'Manage contributions and updates',
    ],
    icon: BookOpen,
  },
  {
    title: 'Payments & Orders',
    description:
      'Understand payments, order flow, merchant fulfillment, and refunds.',
    items: [
      'Supported payment methods',
      'Tracking order and delivery status',
      'Refund and dispute timelines',
    ],
    icon: Shield,
  },
  {
    title: 'Account & Security',
    description:
      'Manage profile settings, login access, and account protection best practices.',
    items: [
      'Update profile and account details',
      'Reset password and secure access',
      'Report suspicious activity',
    ],
    icon: LifeBuoy,
  },
]

const quickAnswers = [
  {
    question: 'How fast does support respond?',
    answer:
      'Most requests receive a response within 24 hours on business days.',
  },
  {
    question: 'Can I edit my gift page after publishing?',
    answer:
      'Yes. You can update text, media, and gifting details from your dashboard.',
  },
  {
    question: 'How do merchant payouts work?',
    answer:
      'Payout timelines depend on order status, delivery completion, and policy checks.',
  },
  {
    question: 'Where can I raise a dispute?',
    answer:
      'Use the support flow in-app or contact us directly through the Contact page.',
  },
]

export default function HelpCenterContent() {
  return (
    <main className='bg-base-bg'>
      <section className='px-4 py-15 lg:px-20 lg:py-20'>
        <div className='mx-auto flex w-full max-w-[960px] flex-col items-center gap-2 text-center'>
          <div className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-[2px] border border-primary-50 bg-[#AEAEFD]' />
            <h4 className='font-bold lg:text-xl lg:leading-6'>Help Center</h4>
          </div>
          <h1 className='text-[34px] leading-10 text-grey-800 lg:text-[48px] lg:leading-[56px]'>
            Get quick answers and support guidance
          </h1>
          <p className='mt-1 max-w-[72ch] text-base leading-7 text-grey-700 lg:text-lg'>
            Find step-by-step help for creating gift pages, managing orders,
            handling payments, and resolving account issues.
          </p>
        </div>
      </section>

      <section className='px-4 pb-10 lg:px-20 lg:pb-14'>
        <div className='mx-auto grid w-full max-w-[1320px] gap-4 lg:grid-cols-3 lg:gap-5'>
          {helpCategories.map((category) => {
            const Icon = category.icon
            return (
              <article
                key={category.title}
                className='rounded-[16px] border border-grey-100 bg-white p-5 shadow-[0px_10px_24px_-18px_#10192826]'
              >
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500'>
                  <Icon className='h-5 w-5' />
                </span>
                <h2 className='mt-3 text-xl font-semibold leading-8 text-blackish'>
                  {category.title}
                </h2>
                <p className='mt-1 text-sm leading-6 text-grey-700'>
                  {category.description}
                </p>
                <ul className='mt-3 space-y-1.5'>
                  {category.items.map((item) => (
                    <li key={item} className='text-sm leading-6 text-grey-700'>
                      • {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section className='px-4 pb-15 lg:px-20 lg:pb-20'>
        <div className='mx-auto grid w-full max-w-[1320px] gap-6 lg:grid-cols-[560fr_420fr] lg:gap-8'>
          <article className='rounded-[20px] border border-grey-100 bg-white p-5 shadow-[0px_12px_30px_-18px_#1019282E] lg:p-7'>
            <h2 className='text-[28px] font-semibold leading-9 text-blackish lg:text-[32px] lg:leading-10'>
              Quick Answers
            </h2>
            <div className='mt-4 space-y-3'>
              {quickAnswers.map((item) => (
                <div
                  key={item.question}
                  className='rounded-[12px] border border-grey-100 bg-secondary-50 p-4'
                >
                  <h3 className='text-base font-semibold leading-6 text-blackish'>
                    {item.question}
                  </h3>
                  <p className='mt-1 text-sm leading-6 text-grey-700 lg:text-base'>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className='rounded-[20px] border border-grey-100 bg-white p-5 shadow-[0px_12px_30px_-18px_#1019282E] lg:p-7'>
            <h2 className='text-[24px] font-semibold leading-8 text-blackish lg:text-[28px] lg:leading-9'>
              Need More Help?
            </h2>
            <p className='mt-2 text-sm leading-6 text-grey-700 lg:text-base'>
              If you still need support, our team is available to help with
              account issues, payment concerns, merchant questions, and urgent
              order matters.
            </p>

            <div className='mt-5 space-y-3'>
              <Link
                href='/contact-us'
                className='inline-flex h-[52px] w-full items-center justify-center rounded-[12px] border border-primary-500 bg-linear-to-b from-primary-400 from-17% to-primary-600 px-6 text-base font-medium text-white transition-colors duration-300 hover:from-primary-500 hover:to-primary-700'
              >
                Contact Support
              </Link>
              <Link
                href='mailto:support@giftseon.com'
                className='inline-flex h-[52px] w-full items-center justify-center rounded-[12px] border border-primary-500 bg-primary-50/70 px-6 text-base font-medium text-primary-500 transition-colors duration-300 hover:bg-primary-50'
              >
                Email Us Directly
              </Link>
            </div>

            <div className='mt-6 rounded-[14px] border border-grey-100 bg-secondary-50 p-4'>
              <p className='text-sm leading-6 text-grey-700'>
                For policy details, visit our{' '}
                <Link
                  href='/legal/privacy-policy'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href='/legal/terms-and-conditions'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Terms & Conditions
                </Link>
                .
              </p>
              <Link
                href='/contact-us#contact-form'
                className='mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600'
              >
                Start a support request
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>

            <div className='mt-4 inline-flex items-center gap-2 text-grey-700'>
              <MessageSquare className='h-4 w-4 text-primary-500' />
              <span className='text-sm leading-6'>
                Average first response: within 24 hours
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className='px-4 pb-15 lg:px-20 lg:pb-20'>
        <div className='mx-auto w-full max-w-[1320px] rounded-[20px] border border-grey-100 bg-white p-5 shadow-[0px_12px_30px_-18px_#1019282E] lg:p-7'>
          <h2 className='text-[28px] font-semibold leading-9 text-blackish lg:text-[32px] lg:leading-10'>
            Frequently Asked Questions
          </h2>
          <p className='mt-1 text-sm leading-6 text-grey-700 lg:text-base'>
            Common questions from gifters, contributors, and merchants.
          </p>

          <div className='mt-5 divide-y divide-grey-100 rounded-[14px] border border-grey-100 bg-secondary-50'>
            {faqItems.map((item) => (
              <details key={item.question} className='group px-4 py-4 lg:px-5'>
                <summary className='flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold leading-7 text-blackish marker:content-none'>
                  <span>{item.question}</span>
                  <ChevronDown className='h-5 w-5 shrink-0 text-primary-500 transition-transform duration-200 group-open:rotate-180' />
                </summary>
                <p className='mt-2 whitespace-pre-line text-sm leading-6 text-grey-700 lg:text-base'>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
