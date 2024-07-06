'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import type { UserEntity } from '@/services/users/type'

interface Props {
  entities: UserEntity[]
}

export function EntitiesDropdown({ entities }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const params = useParams<{ id: string }>()

  const selectedEntity = useMemo(() => {
    return entities.find((item) => item.platform_entity_id === params.id)
  }, [entities, params])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between space-x-2"
        >
          {selectedEntity ? (
            <div className="flex items-center space-x-2">
              <Avatar className="size-4 rounded">
                <AvatarImage src={selectedEntity.entity_icon} />
                <AvatarFallback>
                  {selectedEntity.entity_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-36 truncate">
                {selectedEntity.entity_name}
              </span>
            </div>
          ) : (
            <span>Select Server</span>
          )}
          <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search Server" />
          <CommandEmpty>No server found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {entities?.map((item) => (
                <Link
                  href={`/dashboard/${item.platform}/${item.platform_entity_id}`}
                  key={item.platform_entity_id}
                >
                  <CommandItem
                    className="justify-between space-x-2"
                    value={item.platform_entity_id}
                    onSelect={() => setOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="size-4 rounded">
                        <AvatarImage src={item.entity_icon} />
                        <AvatarFallback>
                          {item.entity_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-36 truncate">
                        {item.entity_name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        'size-4',
                        item.platform_entity_id ===
                          selectedEntity?.platform_entity_id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Link href="/dashboard/settings/servers">
                <CommandItem onSelect={() => setOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <PlusIcon className="size-4" />
                    <span>Get Senchabot</span>
                  </div>
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function EntitiesDropdownPlaceholder() {
  return (
    <div className="inline-flex h-9 w-full items-center space-x-2 rounded-md border px-4 py-2">
      <Skeleton className="size-4 shrink-0 rounded" />
      <Skeleton className="h-4 w-full rounded" />
    </div>
  )
}
