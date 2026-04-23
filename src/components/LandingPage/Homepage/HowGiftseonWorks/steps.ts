import CollectAndCelebrateIcon from '@/assets/icons/diagrams/CollectAndCelebrateIcon'
import CreateYourPageIcon from '@/assets/icons/diagrams/CreateYourPageIcon'
import ShareAndInviteIcon from '@/assets/icons/diagrams/ShareAndInviteIcon'

export const UserSteps = [
  {
    number: '1',
    title: 'Create Your Page',
    description:
      'Choose from beautiful templates and personalize with photos, stories, and gift preferences. Set up takes just minutes.',
    icon: CreateYourPageIcon,
  },
  {
    number: '2',
    title: 'Share & Invite',
    description:
      'Share your celebration page across social media, messaging apps, or generate QR codes for easy access.',
    icon: ShareAndInviteIcon,
  },
  {
    number: '3',
    title: 'Collect & Celebrate',
    description:
      'Receive gifts, messages, and well-wishes in real-time. Track progress and thank contributors personally.',
    icon: CollectAndCelebrateIcon,
  },
]
export const MerchantSteps = [
  {
    number: '1',
    title: 'List your products',
    description:
      'Upload the items you want to sell on Giftseon, add descriptions, and set your prices.',
    icon: CreateYourPageIcon,
  },
  {
    number: '2',
    title: 'Get Discovered by Gift Creators',
    description:
      'Everyday, the items you have listed will be added to Giftseon users gift pages.',
    icon: ShareAndInviteIcon,
  },
  {
    number: '3',
    title: 'Fulfil Order',
    description:
      "Once a gift item is funded, you will be notified and prompted to fulfil the customer's order.",
    icon: CollectAndCelebrateIcon,
  },
]

export type StepType = typeof UserSteps
