import localFont from 'next/font/local'

const degular = localFont({
  src: [
    // Thin - 100
    {
      path: '../../../public/assets/fonts/Degular/Degular-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    // Light - 300
    {
      path: '../../../public/assets/fonts/Degular/Degular-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    // Regular - 400
    {
      path: '../../../public/assets/fonts/Degular/Degular-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    // Medium - 500
    {
      path: '../../../public/assets/fonts/Degular/Degular-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    // Semibold - 600
    {
      path: '../../../public/assets/fonts/Degular/Degular-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-SemiboldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    // Bold - 700
    {
      path: '../../../public/assets/fonts/Degular/Degular-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    // Black - 900
    {
      path: '../../../public/assets/fonts/Degular/Degular-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Degular/Degular-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-degular',
  display: 'swap',
})

export default degular
