/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type {
  GetUserByNameQueryResponse,
  GetUserByNamePathParams,
  GetUserByName400,
  GetUserByName404,
} from '../../../models/ts/userController/GetUserByName.js'

export function getGetUserByNameUrl({ username }: { username: GetUserByNamePathParams['username'] }) {
  return `/user/${username}` as const
}

/**
 * @summary Get user by user name
 * {@link /user/:username}
 */
export async function getUserByName({ username }: { username: GetUserByNamePathParams['username'] }, config: Partial<RequestConfig> = {}) {
  const res = await client<GetUserByNameQueryResponse, ResponseErrorConfig<GetUserByName400 | GetUserByName404>, unknown>({
    method: 'GET',
    url: getGetUserByNameUrl({ username }).toString(),
    ...config,
  })
  return res.data
}
