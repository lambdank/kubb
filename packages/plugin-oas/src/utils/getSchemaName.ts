import { pascalCase } from '@kubb/core/transformers'
import type { ContentType } from '@kubb/oas'
const contentTypeMapper: Record<ContentType, string> = {
  'application/json': '',
  'application/xml': 'XML',
  'multipart/form-data': 'Form',
  'application/x-www-form-urlencoded': 'EncodedForm',
  'text/plain': 'Text',
}

export function getSchemaName(name: string, contentType: ContentType) {
  const trimmedContentType = contentType.toLowerCase().trim()
  if (contentTypeMapper[trimmedContentType] !== undefined) {
    return `${name}${contentTypeMapper[trimmedContentType]}`
  }

  return `${name}${pascalCase(contentType)}`
}
