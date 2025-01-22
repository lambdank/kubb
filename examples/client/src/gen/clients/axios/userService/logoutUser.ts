/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type { LogoutUserQueryResponse } from '../../../models/ts/userController/LogoutUser.js'

export function getLogoutUserUrl() {
  return '/user/logout' as const
}

/**
 * @summary Logs out current logged in user session
 * {@link /user/logout}
 */
export async function logoutUser(config: Partial<RequestConfig> = {}) {
  const res = await client<LogoutUserQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: getLogoutUserUrl().toString(), ...config })
  return res.data
}
