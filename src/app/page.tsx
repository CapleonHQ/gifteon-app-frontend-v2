import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col bg-white'>
      {/* ── Top compliance bar ── */}
      <div className='bg-[#1a1abc] py-2 text-center text-xs font-medium text-white/90 tracking-wide'>
        Giftseon is a product of&nbsp;
        <span className='font-semibold text-white'>
          Capleon International Concept Limited
        </span>
        &nbsp;· Registered &amp; Regulated Business Entity
      </div>

      {/* ── Navigation ── */}
      <header className='sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <div className='flex flex-col'>
            <span className='text-2xl font-bold tracking-tight text-[#1a1abc]'>
              Giftseon
            </span>
            <span className='text-[10px] font-medium text-gray-400 -mt-0.5 leading-tight'>
              by Capleon International Concept Limited
            </span>
          </div>
          <nav className='hidden items-center gap-8 md:flex'>
            <a href='#features' className='text-sm font-medium text-gray-600 hover:text-[#1a1abc] transition-colors'>
              Features
            </a>
            <a href='#how-it-works' className='text-sm font-medium text-gray-600 hover:text-[#1a1abc] transition-colors'>
              How It Works
            </a>
            <a href='#about' className='text-sm font-medium text-gray-600 hover:text-[#1a1abc] transition-colors'>
              About
            </a>
            <Link
              href='/login'
              className='text-sm font-medium text-gray-600 hover:text-[#1a1abc] transition-colors'
            >
              Sign In
            </Link>
            <Link
              href='/register'
              className='rounded-full bg-[#1a1abc] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1212a0] transition-colors'
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      <main className='flex flex-1 flex-col'>
        {/* ── Hero ── */}
        <section className='relative overflow-hidden bg-gradient-to-br from-[#f5f5ff] via-white to-[#eaf6fb] px-6 py-24 text-center md:py-36'>
          <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#d0d0f8_0%,_transparent_60%)]' />
          <div className='mx-auto max-w-3xl'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a1abc]/20 bg-[#1a1abc]/5 px-4 py-1.5 text-xs font-semibold text-[#1a1abc] uppercase tracking-widest'>
              Trusted Gift Collection Platform
            </div>
            <h1 className='mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl'>
              Make Every Celebration{' '}
              <span className='text-[#1a1abc]'>Truly Unforgettable</span>
            </h1>
            <p className='mb-10 text-lg leading-relaxed text-gray-600 md:text-xl'>
              Create elegant gift collections, gather heartfelt contributions from
              loved ones, and celebrate life's most special moments — birthdays,
              weddings, graduations and beyond.
            </p>
            <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
              <Link
                href='/register'
                className='w-full rounded-full bg-[#1a1abc] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#1a1abc]/25 hover:bg-[#1212a0] transition-all sm:w-auto'
              >
                Start Celebrating — It&apos;s Free
              </Link>
              <a
                href='#how-it-works'
                className='w-full rounded-full border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:border-[#1a1abc] hover:text-[#1a1abc] transition-all sm:w-auto'
              >
                See How It Works
              </a>
            </div>
            {/* Trust micro-copy */}
            <p className='mt-6 text-xs text-gray-400'>
              Operated by{' '}
              <span className='font-semibold text-gray-500'>
                Capleon International Concept Limited
              </span>{' '}
              · 200,000+ happy users worldwide
            </p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className='border-y border-gray-100 bg-white px-6 py-10'>
          <div className='mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4'>
            {[
              { value: '200K+', label: 'Registered Users' },
              { value: '50K+', label: 'Gift Collections Created' },
              { value: '₦2B+', label: 'Gifts Facilitated' },
              { value: '4.9★', label: 'Average User Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className='text-3xl font-extrabold text-[#1a1abc]'>{stat.value}</p>
                <p className='mt-1 text-sm text-gray-500'>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id='features' className='bg-[#f7f7ff] px-6 py-24'>
          <div className='mx-auto max-w-6xl'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-extrabold text-gray-900 md:text-4xl'>
                Everything You Need to Celebrate in Style
              </h2>
              <p className='mt-4 text-gray-500 md:text-lg'>
                Giftseon puts the joy back into gifting — simple, beautiful, and
                completely free to start.
              </p>
            </div>
            <div className='grid gap-8 md:grid-cols-3'>
              {[
                {
                  icon: '🎁',
                  title: 'Beautiful Gift Collections',
                  desc: 'Design personalised gift pages that reflect the occasion — choose themes, add photos, and write heartfelt messages.',
                },
                {
                  icon: '👥',
                  title: 'Group Contributions',
                  desc: 'Invite friends and family to contribute any amount. No pressure, no awkward asks — just seamless giving.',
                },
                {
                  icon: '🔒',
                  title: 'Secure & Trusted',
                  desc: 'Every transaction is protected. Giftseon is operated by Capleon International Concept Limited, a duly registered business.',
                },
                {
                  icon: '📱',
                  title: 'Share Instantly',
                  desc: 'Share your gift collection via WhatsApp, Instagram, Facebook, or a simple link in seconds.',
                },
                {
                  icon: '🎉',
                  title: 'All Occasions',
                  desc: 'Birthdays, weddings, baby showers, graduations, burials — if it deserves celebrating, Giftseon handles it.',
                },
                {
                  icon: '💸',
                  title: 'Fast Payouts',
                  desc: 'Receive collected funds directly to your bank account quickly and without hidden fees.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow'
                >
                  <span className='text-4xl'>{f.icon}</span>
                  <h3 className='mt-4 text-lg font-bold text-gray-900'>{f.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-gray-500'>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id='how-it-works' className='bg-white px-6 py-24'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='text-3xl font-extrabold text-gray-900 md:text-4xl'>
              Up and Running in 3 Simple Steps
            </h2>
            <p className='mt-4 text-gray-500 md:text-lg'>
              No tech skills needed. If you can share a link, you can use Giftseon.
            </p>
            <div className='mt-16 grid gap-10 md:grid-cols-3'>
              {[
                {
                  step: '01',
                  title: 'Create Your Collection',
                  desc: 'Sign up free and build a beautiful, personalised gift page for any occasion in minutes.',
                },
                {
                  step: '02',
                  title: 'Invite Your People',
                  desc: 'Share the link via WhatsApp, social media, or email. Contributors give any amount they choose.',
                },
                {
                  step: '03',
                  title: 'Receive & Celebrate',
                  desc: 'Funds are sent directly to your account. Focus on the celebration — we handle the rest.',
                },
              ].map((s) => (
                <div key={s.step} className='flex flex-col items-center text-center'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1abc] text-xl font-extrabold text-white shadow-lg shadow-[#1a1abc]/25'>
                    {s.step}
                  </div>
                  <h3 className='mt-5 text-lg font-bold text-gray-900'>{s.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-gray-500'>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About / Compliance trust section ── */}
        <section id='about' className='bg-[#1a1abc] px-6 py-20 text-white'>
          <div className='mx-auto max-w-5xl'>
            <div className='grid items-center gap-12 md:grid-cols-2'>
              <div>
                <div className='mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest'>
                  About Giftseon
                </div>
                <h2 className='text-3xl font-extrabold leading-snug md:text-4xl'>
                  A Platform Built on Trust and Integrity
                </h2>
                <p className='mt-5 text-base leading-relaxed text-white/80'>
                  Giftseon is proudly a product of{' '}
                  <strong className='text-white'>
                    Capleon International Concept Limited
                  </strong>
                  , a registered and duly incorporated business entity committed to
                  building technology solutions that empower communities across
                  Africa and beyond.
                </p>
                <p className='mt-4 text-base leading-relaxed text-white/80'>
                  Our mission is simple: use technology to make human connections
                  more meaningful — one celebration at a time. Every feature we
                  build is guided by our values of transparency, security, and
                  genuine care for our users.
                </p>
              </div>
              <div className='flex flex-col gap-5'>
                {[
                  {
                    icon: '🏢',
                    title: 'Registered Business',
                    desc: 'Giftseon operates under Capleon International Concept Limited — a fully registered corporate entity.',
                  },
                  {
                    icon: '🛡️',
                    title: 'Compliance-First',
                    desc: 'We adhere to applicable data protection, financial, and platform policies including Meta/Facebook guidelines.',
                  },
                  {
                    icon: '🌍',
                    title: 'Pan-African Vision',
                    desc: 'Built in Africa for Africa — with a global outlook and 200K+ users already celebrating on our platform.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className='flex gap-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm'
                  >
                    <span className='mt-0.5 text-2xl'>{item.icon}</span>
                    <div>
                      <p className='font-bold'>{item.title}</p>
                      <p className='mt-1 text-sm text-white/75'>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className='bg-white px-6 py-24 text-center'>
          <div className='mx-auto max-w-2xl'>
            <h2 className='text-3xl font-extrabold text-gray-900 md:text-4xl'>
              Ready to Create Your First Gift Collection?
            </h2>
            <p className='mt-4 text-gray-500 md:text-lg'>
              Join over 200,000 people who already celebrate their loved ones with
              Giftseon — completely free to start.
            </p>
            <Link
              href='/register'
              className='mt-10 inline-block rounded-full bg-[#1a1abc] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#1a1abc]/30 hover:bg-[#1212a0] transition-colors'
            >
              Create Your Free Account
            </Link>
            <p className='mt-5 text-xs text-gray-400'>
              No credit card required · Free forever for basic use
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className='border-t border-gray-100 bg-gray-50 px-6 py-14'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid gap-10 md:grid-cols-4'>
            {/* Brand */}
            <div className='md:col-span-2'>
              <p className='text-2xl font-bold text-[#1a1abc]'>Giftseon</p>
              <p className='mt-1 text-xs font-semibold text-gray-400 uppercase tracking-widest'>
                A product of Capleon International Concept Limited
              </p>
              <p className='mt-4 max-w-sm text-sm leading-relaxed text-gray-500'>
                The leading gift collection and celebration platform in Africa.
                Trusted by individuals, families, and organisations for every
                special occasion.
              </p>
            </div>
            {/* Links */}
            <div>
              <p className='mb-4 text-xs font-bold uppercase tracking-widest text-gray-400'>
                Platform
              </p>
              <ul className='space-y-2.5 text-sm text-gray-500'>
                <li>
                  <Link href='/register' className='hover:text-[#1a1abc] transition-colors'>
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href='/login' className='hover:text-[#1a1abc] transition-colors'>
                    Sign In
                  </Link>
                </li>
                <li>
                  <a href='#features' className='hover:text-[#1a1abc] transition-colors'>
                    Features
                  </a>
                </li>
                <li>
                  <a href='#how-it-works' className='hover:text-[#1a1abc] transition-colors'>
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className='mb-4 text-xs font-bold uppercase tracking-widest text-gray-400'>
                Legal
              </p>
              <ul className='space-y-2.5 text-sm text-gray-500'>
                <li>
                  <a href='#' className='hover:text-[#1a1abc] transition-colors'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#1a1abc] transition-colors'>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#1a1abc] transition-colors'>
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href='#about' className='hover:text-[#1a1abc] transition-colors'>
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 border-t border-gray-200 pt-8'>
            <div className='flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left'>
              <p className='text-sm text-gray-400'>
                &copy; {new Date().getFullYear()}{' '}
                <span className='font-semibold text-gray-600'>
                  Capleon International Concept Limited
                </span>
                . All rights reserved.
              </p>
              <p className='text-sm text-gray-400'>
                <span className='font-semibold text-gray-600'>Giftseon</span> is a
                registered product and trademark of Capleon International Concept
                Limited.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
