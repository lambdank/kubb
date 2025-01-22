/* eslint-disable no-alert, no-console */
import client from '../client.js'
import type { RequestConfig, ResponseErrorConfig } from '../client.js'
import type {
  UploadFileMutationRequest,
  UploadFileMutationResponse,
  UploadFilePathParams,
  UploadFileQueryParams,
} from '../../../models/ts/petController/UploadFile.js'

export function getUploadFileUrl({ petId }: { petId: UploadFilePathParams['petId'] }) {
  return `/pet/${petId}/uploadImage` as const
}

/**
 * @summary uploads an image
 * {@link /pet/:petId/uploadImage}
 */
export async function uploadFile(
  { petId }: { petId: UploadFilePathParams['petId'] },
  data: UploadFileMutationRequest,
  params?: UploadFileQueryParams,
  config: Partial<RequestConfig<UploadFileMutationRequest>> = {},
) {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof typeof data]
      if (typeof key === 'string' && (typeof value === 'string' || value instanceof Blob)) {
        formData.append(key, value)
      }
    })
  }
  const res = await client<UploadFileMutationResponse, ResponseErrorConfig<Error>, UploadFileMutationRequest>({
    method: 'POST',
    url: getUploadFileUrl({ petId }).toString(),
    params,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data', ...config.headers },
    ...config,
  })
  return res.data
}
