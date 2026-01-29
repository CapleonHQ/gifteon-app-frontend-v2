import React from 'react'
import { motion, type Variants } from 'framer-motion'

const confettiContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.08 },
  },
}

const confettiPiece = {
  hidden: { opacity: 0, y: 6, rotate: -12, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
} satisfies Variants

const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 22, delay: 0.05 },
  },
}

// Your approach is fine. If your FM typings still complain about string easings,
// switch to the cubic-bezier array below (it always type-checks).
const checkDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.18,
    },
  },
} satisfies Variants

const SuccessConfetti = () => {
  return (
    <motion.svg
      width='110'
      height='110'
      viewBox='0 0 110 110'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      initial='hidden'
      animate='show'
    >
      {/* Confetti (everything outside the center badge) */}
      <motion.g variants={confettiContainer}>
        <mask
          id='mask0_878_43358'
          style={{ maskType: 'luminance' }}
          maskUnits='userSpaceOnUse'
          x='-15'
          y='-15'
          width='140'
          height='140'
        >
          <path
            d='M-14.3359 -14.3359H124.331V124.331H-14.3359V-14.3359Z'
            fill='white'
          />
        </mask>

        <g mask='url(#mask0_878_43358)'>
          <mask
            id='mask1_878_43358'
            style={{ maskType: 'luminance' }}
            maskUnits='userSpaceOnUse'
            x='-15'
            y='-15'
            width='140'
            height='140'
          >
            <path
              d='M-14.3359 -14.3359H124.331V124.331H-14.3359V-14.3359Z'
              fill='white'
            />
          </mask>

          <g mask='url(#mask1_878_43358)'>
            <motion.path
              d='M12.7541 39.2734C13.4355 39.2734 13.9887 39.9331 13.9887 40.7457C13.9887 41.5582 13.4355 42.2179 12.7541 42.2179C12.0728 42.2179 11.5195 41.5582 11.5195 40.7457C11.5195 39.9331 12.0728 39.2734 12.7541 39.2734Z'
              fill='#FFD03B'
              variants={confettiPiece}
            />
            <motion.path
              d='M71.3509 31.1299L68.2859 30.8662L60.9017 30.2735L63.9667 30.5372L71.3509 31.1299Z'
              fill='#FFB43B'
              variants={confettiPiece}
            />
            <motion.path
              d='M66.7137 68.2795L65.4867 70.3236L63.0445 68.9461L64.2714 66.9021L66.7137 68.2795Z'
              fill='#70E182'
              variants={confettiPiece}
            />
            <motion.path
              d='M10.0028 92.1675L8.19384 93.3566L4.15702 92.2935L5.96602 91.1044L10.0028 92.1675Z'
              fill='#FFC23B'
              variants={confettiPiece}
            />
            <motion.path
              d='M30.4311 33.1953L28.1162 33.6156L22.6872 32.8394L25.0021 32.4191L30.4311 33.1953Z'
              fill='#FFAE3B'
              variants={confettiPiece}
            />
            <motion.path
              d='M91.3349 55.8996L89.5748 57.5199L85.758 56.2398L87.5181 54.6195L91.3349 55.8996Z'
              fill='#FFCA3B'
              variants={confettiPiece}
            />
            <motion.path
              d='M37.7963 56.4984L36.1987 57.975L32.7354 56.8099L34.3331 55.3333L37.7963 56.4984Z'
              fill='#FF533B'
              variants={confettiPiece}
            />
            <motion.path
              d='M91.1573 27.7898L93.6596 26.5784L93.4309 29.3895L91.1573 27.7898Z'
              fill='#FF6F3B'
              variants={confettiPiece}
            />
            <motion.path
              d='M22.4468 51.9901L25.1577 50.8873L24.9438 53.5165L22.4468 51.9901Z'
              fill='#FF613B'
              variants={confettiPiece}
            />
            <motion.path
              d='M80.028 81.3879L81.847 80.4635L81.6737 82.594L80.028 81.3879Z'
              fill='#FF6F3B'
              variants={confettiPiece}
            />
            <motion.path
              d='M29.3183 13.5736L28.125 14.6142L25.5232 13.777L26.7165 12.7365L29.3183 13.5736Z'
              fill='#70E182'
              variants={confettiPiece}
            />
            <motion.path
              d='M86.8186 27.4347L85.7315 28.5686L83.4059 27.7073L84.4929 26.5734L86.8186 27.4347Z'
              fill='#FFCA3B'
              variants={confettiPiece}
            />
            <motion.path
              d='M16.7537 60.5581L19.7253 58.8687L19.4133 62.7056L16.7537 60.5581Z'
              fill='#FBC752'
              variants={confettiPiece}
            />
            <motion.path
              d='M85.0548 100.003L87.8753 98.4421L87.586 101.999L85.0548 100.003Z'
              fill='#FBCD52'
              variants={confettiPiece}
            />
            <motion.path
              d='M57.6286 27.0797L60.31 25.5614L60.0294 29.0114L57.6286 27.0797Z'
              fill='#FBCD52'
              variants={confettiPiece}
            />
            <motion.path
              d='M30.3527 87.7343L33.3542 86.5628L33.1254 89.3755L30.3527 87.7343Z'
              fill='#FBB552'
              variants={confettiPiece}
            />
            <motion.path
              d='M73.9196 39.8078L76.864 38.7214L76.6498 41.3558L73.9196 39.8078Z'
              fill='#FBB552'
              variants={confettiPiece}
            />
            <motion.path
              d='M81.5556 18.0844C81.4676 16.3513 81.5267 14.5565 81.7146 12.8438'
              stroke='#FBD452'
              strokeWidth='6.5562'
              variants={confettiPiece}
            />
            <motion.path
              d='M62.8083 85.417C64.2119 85.5855 65.6218 85.7576 66.8828 86.1016'
              stroke='#70E182'
              strokeWidth='4.14096'
              variants={confettiPiece}
            />
            <motion.path
              d='M38.5068 25.5908C36.0304 25.7201 33.6967 25.46 31.7266 24.0859'
              stroke='#FBA352'
              strokeWidth='3.92033'
              variants={confettiPiece}
            />
            <motion.path
              d='M73.6242 60.0418C74.5998 58.8991 75.6414 57.9618 77.0312 57.6484'
              stroke='#FFAE3B'
              strokeWidth='0.509671'
              variants={confettiPiece}
            />
            <motion.path
              d='M13.8696 85.0826C14.7445 86.0855 15.0885 87.8936 15.0586 89.8984'
              stroke='#FBB552'
              strokeWidth='3.72058'
              variants={confettiPiece}
            />
            <motion.path
              d='M13.0533 13.8086C10.7065 14.0197 8.88512 15.4066 7.15625 16.7109'
              stroke='#FFAE3B'
              strokeWidth='2.19252'
              variants={confettiPiece}
            />
          </g>

          <mask
            id='mask2_878_43358'
            style={{ maskType: 'luminance' }}
            maskUnits='userSpaceOnUse'
            x='-15'
            y='-15'
            width='140'
            height='140'
          >
            <path
              d='M124.332 124.336H-14.3346V-14.3307H124.332V124.336Z'
              fill='white'
            />
          </mask>

          <g mask='url(#mask2_878_43358)'>
            <motion.path
              d='M83.1451 64.8281C82.4017 64.8281 81.7981 64.29 81.7981 63.6273C81.7981 62.9645 82.4017 62.4264 83.1451 62.4264C83.8886 62.4264 84.4922 62.9645 84.4922 63.6273C84.4922 64.29 83.8886 64.8281 83.1451 64.8281Z'
              fill='#FFAB23'
              variants={confettiPiece}
            />

            <g opacity='0.207346'>
              <motion.path
                d='M51.5126 56.8391L50.1066 56.5623L50.3793 54.8914L51.7853 55.1683L51.5126 56.8391Z'
                fill='#70E182'
                variants={confettiPiece}
              />
            </g>

            <motion.path
              d='M92.607 31.6417L91.4017 31.3636L91.6046 29.8415L92.8099 30.1196L92.607 31.6417Z'
              fill='#FF9C23'
              variants={confettiPiece}
            />
            <motion.path
              d='M25.6418 59.4362L23.7354 58.6552L23.7988 55.4969L25.7052 56.2779L25.6418 59.4362Z'
              fill='#FF9C23'
              variants={confettiPiece}
            />
            <motion.path
              d='M70.6254 62.5134L69.1416 61.8261L69.131 59.1932L70.6148 59.8805L70.6254 62.5134Z'
              fill='#70E182'
              variants={confettiPiece}
            />

            <g opacity='0.96806'>
              <motion.path
                d='M63.2968 69.545L65.4853 71.917L62.626 72.7019L63.2968 69.545Z'
                fill='#70E182'
                variants={confettiPiece}
              />
            </g>

            <motion.path
              d='M30.1636 38.9724L32.5698 41.4357L29.3521 42.3189L30.1636 38.9724Z'
              fill='#FFB423'
              variants={confettiPiece}
            />
            <motion.path
              d='M14.0983 24.4635C14.1288 23.5896 14.6906 22.8989 15.3521 22.922C16.0136 22.9451 16.5259 23.6733 16.4954 24.5472C16.4649 25.4211 15.9031 26.1118 15.2416 26.0887C14.5801 26.0656 14.0677 25.3374 14.0983 24.4635Z'
              fill='#FFA323'
              variants={confettiPiece}
            />

            <g opacity='0.96806'>
              <motion.path
                d='M58.2793 66.4432L56.6327 65.2369L56.2859 61.3388L57.9326 62.5451L58.2793 66.4432Z'
                fill='#70E182'
                variants={confettiPiece}
              />
            </g>

            <motion.path
              d='M27.7525 76.7526L25.9231 75.7532L25.7952 72.1723L27.6246 73.1718L27.7525 76.7526Z'
              fill='#70E182'
              variants={confettiPiece}
            />
            <motion.path
              d='M51.753 19.8819L49.9529 19.1626L50.0265 16.2204L51.8265 16.9397L51.753 19.8819Z'
              fill='#FBC252'
              variants={confettiPiece}
            />
            <motion.path
              d='M45.0978 14.2901L47.2425 16.655L44.461 17.4185L45.0978 14.2901Z'
              fill='#FBB052'
              variants={confettiPiece}
            />
            <motion.path
              d='M45.1281 80.9497L47.1372 82.5334L44.2091 83.3372L45.1281 80.9497Z'
              fill='#70E182'
              variants={confettiPiece}
            />
            <motion.path
              d='M59.4721 27.2984L62.2344 28.6866L57.8058 29.9023L59.4721 27.2984Z'
              fill='#FBAA52'
              variants={confettiPiece}
            />
            <motion.path
              d='M47.3613 67.6144L49.7165 69.5756L46.3376 70.5032L47.3613 67.6144Z'
              fill='#70E182'
              variants={confettiPiece}
            />

            <g opacity='0.342023'>
              <motion.path
                d='M54.7266 54.4574C54.7266 54.4574 50.6375 54.953 46.8177 58.375'
                stroke='#FFB900'
                strokeWidth='3.89513'
                variants={confettiPiece}
              />
            </g>

            <motion.path
              d='M48.7468 39.896C50.9974 41.1264 55.6512 39.5345 55.6669 32.5165'
              stroke='#70E182'
              strokeWidth='5.54807'
              variants={confettiPiece}
            />
            <motion.path
              d='M40.7476 54.045C40.6978 54.396 40.7787 54.7578 41.0197 55.0926C42.5349 57.1977 48.5253 49.6301 47.9306 45.8794'
              stroke='#70E182'
              strokeWidth='2.89908'
              variants={confettiPiece}
            />

            <g opacity='0.489506'>
              <motion.path
                d='M87.2765 82.5188C87.2765 82.5188 92.6974 77.0307 93.3616 81.373C93.3814 81.5026 93.4023 81.63 93.4242 81.7554'
                stroke='#70E182'
                strokeWidth='2.19629'
                variants={confettiPiece}
              />
            </g>
          </g>
        </g>
      </motion.g>

      {/* Center badge + check */}
      <motion.g variants={badgePop} style={{ transformOrigin: '55px 55px' }}>
        <mask
          id='mask3_878_43358'
          style={{ maskType: 'luminance' }}
          maskUnits='userSpaceOnUse'
          x='24'
          y='24'
          width='62'
          height='62'
        >
          <path
            d='M24.957 24.9609H85.0459V85.0498H24.957V24.9609Z'
            fill='white'
          />
        </mask>

        <g mask='url(#mask3_878_43358)'>
          <g opacity='0.396681'>
            <path
              d='M54.881 27.9609C69.501 27.9609 81.3713 39.8313 81.3713 54.4513C81.3713 69.0713 69.501 80.9417 54.881 80.9417C40.261 80.9417 28.3906 69.0713 28.3906 54.4513C28.3906 39.8313 40.261 27.9609 54.881 27.9609Z'
              fill='#3AA75F'
            />
          </g>

          <g opacity='0.6961'>
            <path
              d='M54.8808 33.7109C66.4071 33.7109 75.7656 43.0694 75.7656 54.5957C75.7656 66.122 66.4071 75.4804 54.8808 75.4804C43.3545 75.4804 33.9961 66.122 33.9961 54.5957C33.9961 43.0694 43.3545 33.7109 54.8808 33.7109Z'
              fill='#3AA75F'
            />
          </g>

          <path
            d='M54.8802 33.6797C66.4212 33.6797 75.7916 43.0501 75.7916 54.5911C75.7916 66.1321 66.4212 75.5025 54.8802 75.5025C43.3391 75.5025 33.9688 66.1321 33.9688 54.5911C33.9688 43.0501 43.3391 33.6797 54.8802 33.6797Z'
            fill='#3AA75F'
          />

          <motion.path
            d='M45.3203 55.5333L51.3644 61.4601L63.57 48.8438'
            stroke='white'
            strokeWidth='3.52083'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            variants={checkDraw}
          />
        </g>
      </motion.g>
    </motion.svg>
  )
}

export default SuccessConfetti
