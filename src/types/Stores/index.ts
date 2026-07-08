export interface CreateStoreRequestBody {
  name: string
  street: string
  city: string
  country: string
  addressCode: string
}

export interface UpdateStoreRequestBody extends Partial<CreateStoreRequestBody> {}
