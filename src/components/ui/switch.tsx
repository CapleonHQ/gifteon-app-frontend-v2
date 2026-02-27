'use client'

import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      data-size={size}
      className={cn(
        'data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:data-unchecked:bg-input/80 shrink-0 rounded-full border border-transparent focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-6 data-[size=default]:w-10 data-[size=sm]:h-5 data-[size=sm]:w-8 peer relative inline-flex items-center p-0.5 transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        data-size={size}
        className='bg-white border border-grey-100 shadow-[0px_1px_2px_0px_#1019281A] rounded-full data-[size=default]:size-5 data-[size=sm]:size-4 pointer-events-none block ring-0 transition-transform duration-200 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[size=sm]:data-[state=checked]:translate-x-3'
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
