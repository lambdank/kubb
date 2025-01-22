/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type { DeletePetMutationResponse, DeletePetPathParams, DeletePetHeaderParams, DeletePet400 } from '../../../models/ts/petController/DeletePet.js'

export function getDeletePetUrl({ petId }: { petId: DeletePetPathParams['petId'] }) {
  return `/pet/${petId}` as const
}

/**
 * @description delete a pet
 * @summary Deletes a pet
 * {@link /pet/:petId}
 */
export async function deletePet({ petId }: { petId: DeletePetPathParams['petId'] }, headers?: DeletePetHeaderParams, config: Partial<RequestConfig> = {}) {
  const res = await client<DeletePetMutationResponse, ResponseErrorConfig<DeletePet400>, unknown>({
    method: 'DELETE',
    url: getDeletePetUrl({ petId }).toString(),
    headers: { ...headers, ...config.headers },
    ...config,
  })
  return res.data
}
