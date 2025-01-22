/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type { LoginUserQueryResponse, LoginUserQueryParams, LoginUser400 } from '../../../models/ts/userController/LoginUser.js'

export function getLoginUserUrl() {
  return '/user/login' as const
}

/**
 * @summary Logs user into the system
 * {@link /user/login}
 */
export async function loginUser(params?: LoginUserQueryParams, config: Partial<RequestConfig> = {}) {
  const res = await client<LoginUserQueryResponse, ResponseErrorConfig<LoginUser400>, unknown>({
    method: 'GET',
    url: getLoginUserUrl().toString(),
    params,
    ...config,
  })
  return res.data
}
