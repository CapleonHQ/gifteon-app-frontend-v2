export interface GiftPageData {
  media: {
    type: 'image' | 'video'
    url: string
    file?: File
  }
  title: {
    text: string
    font: string
    color: string
    alignment: 'left' | 'middle' | 'right'
    size: string
    bold: boolean
    italic: boolean
    underline: boolean
  }
  description: {
    text: string
    font: string
    color: string
    alignment: 'left' | 'middle' | 'right'
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
    facebook?: string
  }
}

export interface Recipient {
  name: string
  email: string
}
