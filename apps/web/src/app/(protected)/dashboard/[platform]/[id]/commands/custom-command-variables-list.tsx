'use client'

import { useMemo, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

import type { CustomCommandVariable } from '@/types/custom-command-variable'

import { CreateCustomCommandVariable } from './create-custom-command-variable-dialog'
import { DeleteCustomCommandVariable } from './delete-custom-command-variable-button'
import { UpdateCustomCommandVariable } from './update-custom-command-variable-dialog'

interface Props {
  variables: CustomCommandVariable[]
  platform: string
  entityId: string
}

export function CustomCommandVariablesList({
  variables,
  platform,
  entityId,
}: Props) {
  const [search, setSearch] = useState('')

  const filteredVariables = useMemo(() => {
    if (!search.trim()) return variables

    const query = search.toLowerCase()
    return variables.filter(
      (v) => v.name.toLowerCase().includes(query) || v.value.toLowerCase().includes(query),
    )
  }, [variables, search])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <CreateCustomCommandVariable
          platform={platform as 'twitch' | 'discord'}
          entityId={entityId}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredVariables.length} variable
        {filteredVariables.length !== 1 ? 's' : ' '}
        {search && `found for "${search}"`}
        {!search && 'available'}
      </div>

      {filteredVariables.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search ? 'No variables match your search.' : 'No variables found. Add one to use in your commands!'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <span className="break-all font-mono text-sm">
                      {`{${item.name}}`}
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="truncate" title={item.value}>
                      {item.value}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <UpdateCustomCommandVariable variable={item} />
                      <DeleteCustomCommandVariable
                        id={item.id}
                        platform={item.platform}
                        platformEntityId={item.platform_entity_id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
