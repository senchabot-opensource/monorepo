'use client'

import { useFormStatus } from 'react-dom'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/components/ui/link'
import { Switch } from '@/components/ui/switch'

import { createEntityCommand } from '@/data-layer/actions/command'

interface Props {
  platform: Platform
  platformEntityId: string
  afterSubmission: () => void
}

export function CreateCommandForm({
  platform,
  platformEntityId,
  afterSubmission,
}: Props) {
  return (
    <form
      action={(formData) => {
        // set platform fields
        formData.append('platform', platform)
        formData.append('platformEntityId', platformEntityId)

        const dispatch = createEntityCommand(formData)

        toast.promise(dispatch, {
          loading: 'Loading...',
          success: ({ success, message }) => {
            if (!success) {
              throw new Error(message)
            }
            afterSubmission()
            return message
          },
          error: ({ message }) => {
            return message
          },
        })
      }}
    >
      <div className="space-y-4 *:space-y-1">
        <div>
          <Label htmlFor="command_name">Name</Label>
          <Input
            type="text"
            id="command_name"
            name="command_name"
            placeholder=""
            required
          />
        </div>
        <div>
          <Label htmlFor="command_content">Content</Label>
          <Input
            type="text"
            id="command_content"
            name="command_content"
            placeholder=""
            required
          />
          <p className="text-sm text-muted-foreground">
            See our{' '}
            <Link href="/docs" target="_blank" prefetch={false}>
              docs
            </Link>{' '}
            for more variables.
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <Switch id="status" name="status" defaultChecked />
          <Label htmlFor="status">Enabled</Label>
        </div>
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <div className="flex justify-end">
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? <LoaderIcon /> : 'Submit'}
      </Button>
    </div>
  )
}
