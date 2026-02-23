import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/types/Common'
import type { AvailableBank, AvailableBanksData } from '@/types/Banks'

export const runtime = 'nodejs'
export const revalidate = 60 * 60 * 12

const PAYSTACK_BANKS_URL = 'https://api.paystack.co/bank'
const PAYSTACK_TIMEOUT_MS = 8000

type PaystackBank = {
  id: number
  name: string
  slug: string
  code: string
  country: string
  currency: string
  type: string
  supports_transfer: boolean
  active: boolean
  is_deleted: boolean
}

type PaystackBanksResponse = {
  status: boolean
  message: string
  data?: PaystackBank[]
}

const normalizeBank = (bank: PaystackBank): AvailableBank => ({
  id: String(bank.id),
  name: bank.name,
  code: bank.code,
  slug: bank.slug,
  country: bank.country,
  currency: bank.currency,
  type: bank.type,
  supportsTransfer: bank.supports_transfer,
})

const buildSuccessPayload = (
  banks: AvailableBank[]
): ApiResponse<AvailableBanksData> => ({
  status: 'success',
  message: 'Banks retrieved',
  data: {
    banks,
    total: banks.length,
  },
})

const buildErrorPayload = (
  message: string
): ApiResponse<AvailableBanksData> => ({
  status: 'error',
  message,
})

export async function GET(request: NextRequest) {
  const country =
    request.nextUrl.searchParams.get('country')?.trim() || 'nigeria'
  const currency = request.nextUrl.searchParams.get('currency')?.trim() || 'NGN'
  const type = request.nextUrl.searchParams.get('type')?.trim() || 'nuban'
  const endpoint = `${PAYSTACK_BANKS_URL}?country=${encodeURIComponent(
    country
  )}&currency=${encodeURIComponent(currency)}&type=${encodeURIComponent(type)}`

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(PAYSTACK_TIMEOUT_MS),
      next: { revalidate },
    })

    if (!response.ok) {
      return NextResponse.json(
        buildErrorPayload('Unable to fetch banks from provider.'),
        { status: 502 }
      )
    }

    const payload = (await response.json()) as PaystackBanksResponse
    const rawBanks = payload.data ?? []
    const banks = rawBanks
      .filter(
        (bank) => bank.active && !bank.is_deleted && bank.supports_transfer
      )
      .map(normalizeBank)
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(buildSuccessPayload(banks), { status: 200 })
  } catch (error) {
    const isTimeoutError =
      error instanceof Error && error.name === 'TimeoutError'

    return NextResponse.json(
      buildErrorPayload(
        isTimeoutError
          ? 'Bank lookup timed out. Please try again.'
          : 'Unable to fetch banks at the moment.'
      ),
      { status: isTimeoutError ? 504 : 500 }
    )
  }
}
