'use client'

import type { CustomCommandVariable } from '@/types/custom-command-variable'

interface Props {
  content: string
  variables: CustomCommandVariable[]
}

export function CommandContentWithVariables({ content, variables }: Props) {
  const variableMap = new Map(variables.map((v) => [v.name, v.value]))

  const parts = content.split(/(\{[^}]+\})/g)

  return (
    <p className="truncate" title={content}>
      {parts.map((part, index) => {
        const match = part.match(/^\{([^}]+)\}$/)
        if (match) {
          const varName = match[1]
          const varValue = variableMap.get(varName)

          if (varValue !== undefined) {
            return (
              <span
                key={index}
                className="rounded bg-blue-100 px-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                title={`{${varName}} → ${varValue}`}
              >
                {part}
              </span>
            )
          }

          return (
            <span
              key={index}
              className="rounded bg-red-100 px-1 text-red-800 dark:bg-red-900 dark:text-red-200"
              title={`Undefined variable: {${varName}}`}
            >
              {part}
            </span>
          )
        }

        return <span key={index}>{part}</span>
      })}
    </p>
  )
}
