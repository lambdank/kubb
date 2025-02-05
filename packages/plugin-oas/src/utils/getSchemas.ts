import type { Oas, OasTypes } from '@kubb/oas'
import { getSchemaName } from './getSchemaName.ts'

type Mode = 'schemas' | 'responses' | 'requestBodies'

export type GetSchemasProps = {
  oas: Oas
  includes?: Mode[]
}

export function getSchemas({ oas, includes = ['schemas', 'requestBodies', 'responses'] }: GetSchemasProps): Record<string, OasTypes.SchemaObject> {
  const components = oas.getDefinition().components

  let schemas: Record<string, OasTypes.SchemaObject> = {}

  if (includes.includes('schemas')) {
    schemas = {
      ...schemas,
      ...((components?.schemas as Record<string, OasTypes.SchemaObject>) || {}),
    }
  }

  const requestBodies = components?.requestBodies || {}
  if (includes.includes('responses')) {
    const responses = components?.responses || {}

    Object.entries(responses).forEach(([name, response]: [string, OasTypes.ResponseObject]) => {
      if (response.content) {
        Object.keys(response.content).forEach((contentType) => {
          const schemaName = getSchemaName(name, contentType)
          if (!schemas[schemaName]) {
            schemas[schemaName] = response.content?.[contentType]?.schema as OasTypes.SchemaObject
          }
        })
      }
    })
  }

  if (includes.includes('requestBodies')) {
    Object.entries(requestBodies).forEach(([name, request]: [string, OasTypes.RequestBodyObject]) => {
      if (request.content) {
        Object.keys(request.content).forEach((contentType) => {
          const schemaName = getSchemaName(name, contentType)
          if (!schemas[schemaName]) {
            schemas[schemaName] = request.content?.[contentType]?.schema as OasTypes.SchemaObject
          }
        })
      }
    })
  }

  return schemas
}
