import localFont from 'next/font/local'

const georgia = localFont({
  src: [
    // Regular - 400
    {
      path: '../../../public/assets/fonts/Georgia/georgia.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Georgia/georgiai.ttf',
      weight: '400',
      style: 'italic',
    },

    // Bold - 700
    {
      path: '../../../public/assets/fonts/Georgia/georgiab.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Georgia/georgiaz.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-georgia',
  display: 'swap',
})

export default georgia
