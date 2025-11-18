import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Tasks } from '@/features/tasks'

const statusValues = ['backlog', 'todo', 'in progress', 'done', 'canceled'] as const
const priorityValues = ['low', 'medium', 'high', 'critical'] as const

const taskSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(statusValues))
    .optional()
    .catch([]),
  priority: z
    .array(z.enum(priorityValues))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/tasks/')({
  validateSearch: taskSearchSchema,
  component: Tasks,
})
