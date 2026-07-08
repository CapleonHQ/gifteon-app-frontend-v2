import Link from 'next/link'

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    points: [
      'By accessing or using Giftseon, you agree to be bound by these Terms and Conditions.',
      'If you do not agree, you should discontinue use of the platform and related services.',
    ],
  },
  {
    title: '2. Eligibility and Accounts',
    points: [
      'You must provide accurate account information and keep your credentials secure.',
      'You are responsible for activities conducted through your account and for notifying us of unauthorized access.',
      'We may suspend or terminate accounts that violate these terms or applicable law.',
    ],
  },
  {
    title: '3. Platform Services',
    points: [
      'Giftseon enables users to create gift pages, receive contributions, and purchase from participating merchants.',
      'Service features may change over time as we improve performance, security, and user experience.',
    ],
  },
  {
    title: '4. Payments, Orders, and Refunds',
    points: [
      'Payments are processed through approved providers and are subject to provider terms and verification checks.',
      'Order fulfillment timelines, shipping details, and return conditions may vary by merchant.',
      'Refund and dispute decisions follow Giftseon policies and applicable legal requirements.',
    ],
  },
  {
    title: '5. Merchant Responsibilities',
    points: [
      'Merchants must provide accurate listings, pricing, inventory, and delivery commitments.',
      'Merchants are responsible for product quality, lawful operations, and customer fulfillment obligations.',
      'Giftseon may remove listings or restrict merchant access for policy or compliance violations.',
    ],
  },
  {
    title: '6. User Conduct',
    points: [
      'You must not misuse the platform, upload unlawful content, attempt fraud, or interfere with service operations.',
      'You must respect intellectual property rights and privacy rights of others.',
    ],
  },
  {
    title: '7. Intellectual Property',
    points: [
      'Giftseon brand assets, software, and site content are protected by intellectual property laws.',
      'You retain ownership of user content you submit, while granting us a limited license to operate and display it as needed for services.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    points: [
      'Giftseon provides services on an “as available” basis and does not guarantee uninterrupted availability.',
      'To the maximum extent permitted by law, Giftseon is not liable for indirect, incidental, or consequential damages.',
    ],
  },
  {
    title: '9. Indemnification',
    points: [
      'You agree to indemnify and hold Giftseon harmless from claims, losses, or damages arising from your misuse of the platform or breach of these terms.',
    ],
  },
  {
    title: '10. Termination',
    points: [
      'We may suspend or terminate access for violations, legal risk, fraud concerns, or operational reasons.',
      'Certain provisions survive termination, including payment obligations, liability limits, and dispute terms.',
    ],
  },
  {
    title: '11. Governing Law',
    points: [
      'These terms are governed by applicable laws in the jurisdiction where Giftseon operates, unless local mandatory law provides otherwise.',
    ],
  },
  {
    title: '12. Updates to These Terms',
    points: [
      'We may revise these Terms and Conditions from time to time.',
      'Continued use after updates constitutes acceptance of the revised terms.',
    ],
  },
]

export default function TermsContent() {
  return (
    <main className='bg-base-bg'>
      <section className='px-4 py-15 lg:px-20 lg:py-20'>
        <div className='mx-auto flex w-full max-w-[960px] flex-col items-center gap-2 text-center'>
          <div className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-[2px] border border-primary-50 bg-[#AEAEFD]' />
            <h4 className='font-bold lg:text-xl lg:leading-6'>
              Terms and Conditions
            </h4>
          </div>
          <h1 className='text-[34px] leading-10 text-grey-800 lg:text-[48px] lg:leading-[56px]'>
            Rules and responsibilities for using Giftseon
          </h1>
          <p className='mt-1 max-w-[72ch] text-base leading-7 text-grey-700 lg:text-lg'>
            Effective date: February 18, 2026
          </p>
        </div>
      </section>

      <section className='px-4 pb-15 lg:px-20 lg:pb-20'>
        <article className='mx-auto w-full max-w-[1100px] rounded-[20px] border border-grey-100 bg-white p-5 shadow-[0px_12px_30px_-18px_#1019282E] lg:p-8'>
          <p className='text-sm leading-6 text-grey-700 lg:text-base lg:leading-7'>
            These Terms and Conditions govern your use of Giftseon services.
            Please read them carefully before creating an account, receiving
            contributions, or placing merchant orders through the platform.
          </p>

          <div className='mt-6 space-y-6 lg:mt-8 lg:space-y-8'>
            {termsSections.map((section) => (
              <section key={section.title}>
                <h2 className='text-xl font-semibold leading-8 text-blackish lg:text-2xl'>
                  {section.title}
                </h2>
                <ul className='mt-2 space-y-2'>
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className='text-sm leading-6 text-grey-700 lg:text-base'
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section className='mt-8 rounded-[16px] border border-grey-100 bg-secondary-50 p-4 lg:p-5'>
            <h3 className='text-lg font-semibold leading-7 text-blackish'>
              Questions About These Terms
            </h3>
            <p className='mt-1 text-sm leading-6 text-grey-700 lg:text-base'>
              For legal or policy clarification, contact us at{' '}
              <Link
                href='mailto:support@giftseon.com'
                className='text-primary-500 hover:text-primary-600'
              >
                support@giftseon.com
              </Link>{' '}
              or through our{' '}
              <Link
                href='/contact-us'
                className='text-primary-500 hover:text-primary-600'
              >
                Contact page
              </Link>
              .
            </p>
          </section>
        </article>
      </section>
    </main>
  )
}
