import Link from 'next/link'

const policySections = [
  {
    title: '1. Information We Collect',
    points: [
      'Account details such as your name, email address, phone number, and profile information when you sign up.',
      'Transaction and order information, including gift contributions, merchant purchases, payouts, and refunds.',
      'Content you provide, such as messages, media uploads, and event details added to gift pages.',
      'Technical and usage data like device information, browser type, IP address, and in-app activity logs.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    points: [
      'To operate and improve Giftseon services, including gift-page creation, payments, order management, and merchant onboarding.',
      'To verify accounts, prevent fraud, detect abuse, and maintain platform security.',
      'To send service communications such as confirmations, status updates, support notices, and policy updates.',
      'To provide customer support and resolve disputes, refunds, and compliance requests.',
    ],
  },
  {
    title: '3. Sharing and Disclosure',
    points: [
      'We share limited information with payment processors, logistics partners, and service providers strictly to fulfill platform functions.',
      'We may disclose information where required by law, regulation, legal process, or government request.',
      'We may share data during business transfers (e.g., merger, acquisition, restructuring), subject to confidentiality safeguards.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    title: '4. Data Retention',
    points: [
      'We retain information only for as long as needed to provide services, meet legal obligations, resolve disputes, and enforce agreements.',
      'Retention periods vary by data type, transaction history, and local compliance requirements.',
    ],
  },
  {
    title: '5. Your Privacy Choices',
    points: [
      'You can update account information and communication preferences from your profile settings.',
      'You may request access, correction, or deletion of your personal data, subject to legal and security requirements.',
      'You can opt out of marketing emails at any time using the unsubscribe link.',
    ],
  },
  {
    title: '6. Security Measures',
    points: [
      'We implement administrative, technical, and organizational safeguards to protect data.',
      'No internet transmission or storage system is absolutely secure, but we continuously improve our controls and monitoring.',
    ],
  },
  {
    title: '7. Children’s Privacy',
    points: [
      'Giftseon is not intended for children under 13, and we do not knowingly collect personal data from children under 13.',
      'If you believe a child has provided personal data, contact us and we will investigate and take appropriate action.',
    ],
  },
  {
    title: '8. International Transfers',
    points: [
      'Your information may be processed in locations outside your country of residence where Giftseon or its providers operate.',
      'Where required, we apply appropriate safeguards for cross-border data transfers.',
    ],
  },
  {
    title: '9. Updates to This Policy',
    points: [
      'We may update this Privacy Policy periodically to reflect legal, technical, or business changes.',
      'When we make material changes, we will provide notice through the platform or contact channels where appropriate.',
    ],
  },
]

export default function PrivacyContent() {
  return (
    <main className='bg-base-bg'>
      <section className='px-4 py-15 lg:px-20 lg:py-20'>
        <div className='mx-auto flex w-full max-w-[960px] flex-col items-center gap-2 text-center'>
          <div className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-[2px] border border-primary-50 bg-[#AEAEFD]' />
            <h4 className='font-bold lg:text-xl lg:leading-6'>
              Privacy Policy
            </h4>
          </div>
          <h1 className='text-[34px] leading-10 text-grey-800 lg:text-[48px] lg:leading-[56px]'>
            How Giftseon collects, uses, and protects your information
          </h1>
          <p className='mt-1 max-w-[72ch] text-base leading-7 text-grey-700 lg:text-lg'>
            Effective date: February 18, 2026
          </p>
        </div>
      </section>

      <section className='px-4 pb-15 lg:px-20 lg:pb-20'>
        <article className='mx-auto w-full max-w-[1100px] rounded-[20px] border border-grey-100 bg-white p-5 shadow-[0px_12px_30px_-18px_#1019282E] lg:p-8'>
          <p className='text-sm leading-6 text-grey-700 lg:text-base lg:leading-7'>
            This Privacy Policy explains how Giftseon processes personal data
            when you use our website, products, and related services. By using
            Giftseon, you acknowledge the practices described below.
          </p>

          <div className='mt-6 space-y-6 lg:mt-8 lg:space-y-8'>
            {policySections.map((section) => (
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
              Contact Us About Privacy
            </h3>
            <p className='mt-1 text-sm leading-6 text-grey-700 lg:text-base'>
              For privacy requests, data access/deletion inquiries, or
              compliance questions, contact us at{' '}
              <Link
                href='mailto:support@giftseon.com'
                className='text-primary-500 hover:text-primary-600'
              >
                support@giftseon.com
              </Link>{' '}
              or visit our{' '}
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
