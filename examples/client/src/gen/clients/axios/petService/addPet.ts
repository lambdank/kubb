/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type { AddPetMutationRequest, AddPetMutationResponse, AddPet405 } from '../../../models/ts/petController/AddPet.js'

export function getAddPetUrl() {
  return '/pet' as const
}

/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * {@link /pet}
 */
export async function addPet(data: AddPetMutationRequest, config: Partial<RequestConfig<AddPetMutationRequest>> = {}) {
  const res = await client<AddPetMutationResponse, ResponseErrorConfig<AddPet405>, AddPetMutationRequest>({
    method: 'POST',
    url: getAddPetUrl().toString(),
    data,
    ...config,
  })
  return res.data
}
