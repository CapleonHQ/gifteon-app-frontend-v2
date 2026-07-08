import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import TimePickerField from '@/components/Gifts/CreateNewGiftPage/Components/TimePickerField'

type GiftOptionsFieldsProps = {
  sendAsGift: boolean
  setSendAsGift: Dispatch<SetStateAction<boolean>>
  senderNote: string
  setSenderNote: Dispatch<SetStateAction<string>>
  isAnonymous: boolean
  setIsAnonymous: Dispatch<SetStateAction<boolean>>
  scheduledModeActive: boolean
  setScheduleGift: Dispatch<SetStateAction<boolean>>
  setRepeatGift: Dispatch<SetStateAction<boolean>>
  scheduledDate: Date | undefined
  setScheduledDate: Dispatch<SetStateAction<Date | undefined>>
  scheduledTime: string
  setScheduledTime: Dispatch<SetStateAction<string>>
  repeatGift: boolean
  recurringModeActive: boolean
  recurringFrequency: string
  setRecurringFrequency: Dispatch<SetStateAction<string>>
  recurringEndDate: Date | undefined
  setRecurringEndDate: Dispatch<SetStateAction<Date | undefined>>
  recurringMaxRuns: string
  setRecurringMaxRuns: Dispatch<SetStateAction<string>>
  recurringCronExpression: string
  setRecurringCronExpression: Dispatch<SetStateAction<string>>
}

const GiftField = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className='space-y-1.5'>
    <p className='text-xs font-medium text-grey-700'>{label}</p>
    {children}
  </div>
)

const GiftOptionsFields = ({
  sendAsGift,
  setSendAsGift,
  senderNote,
  setSenderNote,
  isAnonymous,
  setIsAnonymous,
  scheduledModeActive,
  setScheduleGift,
  setRepeatGift,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  repeatGift,
  recurringModeActive,
  recurringFrequency,
  setRecurringFrequency,
  recurringEndDate,
  setRecurringEndDate,
  recurringMaxRuns,
  setRecurringMaxRuns,
  recurringCronExpression,
  setRecurringCronExpression,
}: GiftOptionsFieldsProps) => {
  return (
    <div className='mt-4 border-t border-grey-100 pt-4 space-y-3'>
      <div className='flex items-center justify-between gap-3 rounded-xl border border-grey-100 bg-grey-50/30 p-3'>
        <div>
          <h3 className='text-sm font-semibold text-grey-900'>Send as gift</h3>
          <p className='text-xs text-grey-600'>
            This uses the bill details in this form and sends it to a recipient.
          </p>
        </div>
        <Switch
          checked={sendAsGift}
          onCheckedChange={setSendAsGift}
          className='data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-grey-200'
        />
      </div>

      {sendAsGift ? (
        <>
          <GiftField label='Sender Note (optional)'>
            <textarea
              value={senderNote}
              onChange={(event) => setSenderNote(event.target.value)}
              className='w-full min-h-[90px] px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 resize-none'
              placeholder='Add a message...'
            />
          </GiftField>

          <div className='flex items-center gap-2'>
            <Checkbox
              id='send-anonymous'
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(Boolean(checked))}
            />
            <label htmlFor='send-anonymous' className='text-sm text-grey-700 cursor-pointer'>
              Send anonymously
            </label>
          </div>

          <div className='flex items-center justify-between gap-3 rounded-xl border border-grey-100 bg-white p-3'>
            <div>
              <p className='text-sm font-medium text-grey-900'>Schedule this gift</p>
              <p className='text-xs text-grey-600'>Set when the recipient gets it.</p>
            </div>
            <Switch
              checked={scheduledModeActive}
              className='data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-grey-200'
              onCheckedChange={(checked) => {
                setScheduleGift(checked)
                if (!checked) {
                  setRepeatGift(false)
                }
              }}
            />
          </div>

          {scheduledModeActive ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <DatePickerField
                label='Schedule date'
                value={scheduledDate}
                onChange={setScheduledDate}
                minDate={new Date()}
              />
              <TimePickerField
                label='Schedule time'
                value={scheduledTime}
                onChange={setScheduledTime}
              />
            </div>
          ) : null}

          {scheduledModeActive ? (
            <div className='flex items-center gap-2'>
              <Checkbox
                id='repeat-gift'
                checked={repeatGift}
                onCheckedChange={(checked) => {
                  const next = Boolean(checked)
                  setRepeatGift(next)
                  if (next) {
                    setScheduleGift(true)
                  }
                }}
              />
              <label htmlFor='repeat-gift' className='text-sm text-grey-700 cursor-pointer'>
                Repeat this gift
              </label>
            </div>
          ) : null}

          {recurringModeActive ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <GiftField label='Frequency'>
                <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                  <SelectTrigger className='w-full h-12 rounded-xl border-grey-50'>
                    <SelectValue placeholder='Select frequency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='daily'>Daily</SelectItem>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                    <SelectItem value='custom'>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </GiftField>

              <DatePickerField
                label='End date (optional)'
                value={recurringEndDate}
                onChange={setRecurringEndDate}
                minDate={scheduledDate ?? new Date()}
              />

              <GiftField label='Max Runs (optional)'>
                <input
                  type='text'
                  value={recurringMaxRuns}
                  onChange={(event) => setRecurringMaxRuns(event.target.value)}
                  placeholder='e.g. 12'
                  inputMode='numeric'
                  className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                />
              </GiftField>

              {recurringFrequency === 'custom' ? (
                <GiftField label='Cron Expression'>
                  <input
                    type='text'
                    value={recurringCronExpression}
                    onChange={(event) => setRecurringCronExpression(event.target.value)}
                    placeholder='e.g. 0 9 1 * *'
                    className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                  />
                </GiftField>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default GiftOptionsFields
