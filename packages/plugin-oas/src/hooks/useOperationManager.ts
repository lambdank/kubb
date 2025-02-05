import { useApp, useContext } from '@kubb/react'

import { Oas } from '../components/Oas.tsx'

import type { FileMetaBase, Plugin, ResolveNameParams } from '@kubb/core'

import type * as KubbFile from '@kubb/fs/types'
import type { ContentType, Operation, Operation as OperationType } from '@kubb/oas'
import type { OperationSchemas } from '../types.ts'

type FileMeta = FileMetaBase & {
  pluginKey: Plugin['key']
  name: string
  group?: {
    tag?: string
    path?: string
  }
}

export type SchemaNames = {
  request: string | undefined
  parameters: {
    path: string | undefined
    query: string | undefined
    header: string | undefined
  }
  responses: { default?: string } & Record<number | string, string>
  errors: Record<number | string, string>
}

type UseOperationManagerResult = {
  getName: (
    operation: OperationType,
    options: {
      prefix?: string
      suffix?: string
      pluginKey?: Plugin['key']
      type: ResolveNameParams['type']
    },
  ) => string
  getFile: (
    operation: OperationType,
    options?: {
      prefix?: string
      suffix?: string
      pluginKey?: Plugin['key']
      extname?: KubbFile.Extname
      group?: {
        tag?: string
        path?: string
      }
    },
  ) => KubbFile.File<FileMeta>
  groupSchemasByName: (
    operation: OperationType,
    options: {
      contentType?: ContentType
      pluginKey?: Plugin['key']
      type: ResolveNameParams['type']
    },
  ) => SchemaNames
  getSchemas: (operation: Operation, options?: { contentType?: ContentType; pluginKey?: Plugin['key']; type?: ResolveNameParams['type'] }) => OperationSchemas
  getGroup: (operation: Operation) => FileMeta['group'] | undefined
}

/**
 * `useOperationManager` will return some helper functions that can be used to get the operation file, get the operation name.
 */
export function useOperationManager(): UseOperationManagerResult {
  const { plugin, pluginManager } = useApp()
  const { generator } = useContext(Oas.Context)

  const getName: UseOperationManagerResult['getName'] = (operation, { prefix = '', suffix = '', pluginKey = plugin.key, type }) => {
    return pluginManager.resolveName({
      name: `${prefix} ${operation.getOperationId()} ${suffix}`,
      pluginKey,
      type,
    })
  }

  const getGroup: UseOperationManagerResult['getGroup'] = (operation) => {
    return {
      tag: operation.getTags().at(0)?.name,
      path: operation.path,
    }
  }

  const getSchemas: UseOperationManagerResult['getSchemas'] = (operation, options) => {
    if (!generator) {
      throw new Error(`'generator' is not defined`)
    }

    return generator.getSchemas(operation, options?.contentType || operation.getContentType(), {
      resolveName: (name) =>
        pluginManager.resolveName({
          name,
          pluginKey: options?.pluginKey,
          type: options?.type,
        }),
    })
  }

  const getFile: UseOperationManagerResult['getFile'] = (operation, { prefix, suffix, pluginKey = plugin.key, extname = '.ts' } = {}) => {
    const name = getName(operation, { type: 'file', pluginKey, prefix, suffix })
    const group = getGroup(operation)

    const file = pluginManager.getFile({
      name,
      extname,
      pluginKey,
      options: { type: 'file', pluginKey, group },
    })

    return {
      ...file,
      meta: {
        ...file.meta,
        name,
        pluginKey,
        group,
      },
    }
  }

  const groupSchemasByName: UseOperationManagerResult['groupSchemasByName'] = (operation, { contentType, pluginKey = plugin.key, type }) => {
    if (!generator) {
      throw new Error(`'generator' is not defined`)
    }

    const schemas = generator.getSchemas(operation, contentType || operation.getContentType())

    const errors = (schemas.errors || []).reduce(
      (prev, acc) => {
        if (!acc.statusCode) {
          return prev
        }

        prev[acc.statusCode] = pluginManager.resolveName({
          name: acc.name,
          pluginKey,
          type,
        })

        return prev
      },
      {} as Record<number, string>,
    )

    const responses = (schemas.responses || []).reduce(
      (prev, acc) => {
        if (!acc.statusCode) {
          return prev
        }

        prev[acc.statusCode] = pluginManager.resolveName({
          name: acc.name,
          pluginKey,
          type,
        })

        return prev
      },
      {} as Record<number, string>,
    )

    return {
      request: schemas.request?.name
        ? pluginManager.resolveName({
            name: schemas.request.name,
            pluginKey,
            type,
          })
        : undefined,
      parameters: {
        path: schemas.pathParams?.name
          ? pluginManager.resolveName({
              name: schemas.pathParams.name,
              pluginKey,
              type,
            })
          : undefined,
        query: schemas.queryParams?.name
          ? pluginManager.resolveName({
              name: schemas.queryParams.name,
              pluginKey,
              type,
            })
          : undefined,
        header: schemas.headerParams?.name
          ? pluginManager.resolveName({
              name: schemas.headerParams.name,
              pluginKey,
              type,
            })
          : undefined,
      },
      responses: {
        ...responses,
        ['default']: pluginManager.resolveName({
          name: schemas.response.name,
          pluginKey,
          type,
        }),
        ...errors,
      },
      errors,
    }
  }

  return {
    getName,
    getFile,
    getSchemas,
    groupSchemasByName,
    getGroup,
  }
}
