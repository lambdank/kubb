/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type { GetPetByIdQueryResponse, GetPetByIdPathParams, GetPetById400, GetPetById404 } from '../../../models/ts/petController/GetPetById.js'

export function getGetPetByIdUrl({ petId }: { petId: GetPetByIdPathParams['petId'] }) {
  return `/pet/${petId}` as const
}

/**
 * @description Returns a single pet
 * @summary Find pet by ID
 * {@link /pet/:petId}
 */
export async function getPetById({ petId }: { petId: GetPetByIdPathParams['petId'] }, config: Partial<RequestConfig> = {}) {
  const res = await client<GetPetByIdQueryResponse, ResponseErrorConfig<GetPetById400 | GetPetById404>, unknown>({
    method: 'GET',
    url: getGetPetByIdUrl({ petId }).toString(),
    ...config,
  })
  return res.data
}
