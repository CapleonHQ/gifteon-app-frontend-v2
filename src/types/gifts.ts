export interface GiftPageData {
  media: {
    type: 'image' | 'video'
    url: string
  }
  title: {
    text: string
    font: string
    color: string
    alignment: 'left' | 'center' | 'right'
    size: string
    bold: boolean
    italic: boolean
    underline: boolean
  }
  description: {
    text: string
    font: string
    color: string
    alignment: 'left' | 'center' | 'right'
    size: string
    bold: boolean
    italic: boolean
    underline: boolean
  }
  button: {
    label: string
    backgroundColor: string
    textColor: string
  }
  socialLinks: {
    instagram?: string
    twitter?: string
    linkedin?: string
  }
}

export interface Recipient {
  name: string
  email: string
}
