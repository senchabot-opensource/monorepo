import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { UpdateCommandForm } from './update-command-form'

interface Props {
  command: EntityCommand
}

export function UpdateCommand({ command }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="submit" variant="secondary" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Command</DialogTitle>
        </DialogHeader>
        <UpdateCommandForm command={command} />
      </DialogContent>
    </Dialog>
  )
}
