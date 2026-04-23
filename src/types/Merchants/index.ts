export interface CreateMerchantRequestBody {
  businessName: string
  businessType: string
  taxId: string
  registrationNumber: string
  email: string
  phoneNumber: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  description?: string
  website?: string
}

export interface UpdateMerchantRequestBody extends Partial<CreateMerchantRequestBody> {}
