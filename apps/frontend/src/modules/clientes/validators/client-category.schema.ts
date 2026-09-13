import { z } from 'zod'

export const clientCategorySchema = z.object({
  name: z.string().min(1, 'Informe o nome da categoria'),
  description: z.string().optional(),
  color: z.string(),
})

export type ClientCategoryFormValues = z.infer<typeof clientCategorySchema>
