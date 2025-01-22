/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type {
  UpdatePetWithFormMutationResponse,
  UpdatePetWithFormPathParams,
  UpdatePetWithFormQueryParams,
  UpdatePetWithForm405,
} from '../../../models/ts/petController/UpdatePetWithForm.js'

export function getUpdatePetWithFormUrl({ petId }: { petId: UpdatePetWithFormPathParams['petId'] }) {
  return `/pet/${petId}` as const
}

/**
 * @summary Updates a pet in the store with form data
 * {@link /pet/:petId}
 */
export async function updatePetWithForm(
  { petId }: { petId: UpdatePetWithFormPathParams['petId'] },
  params?: UpdatePetWithFormQueryParams,
  config: Partial<RequestConfig> = {},
) {
  const res = await client<UpdatePetWithFormMutationResponse, ResponseErrorConfig<UpdatePetWithForm405>, unknown>({
    method: 'POST',
    url: getUpdatePetWithFormUrl({ petId }).toString(),
    params,
    ...config,
  })
  return res.data
}
