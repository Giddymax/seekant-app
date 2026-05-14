import { z } from 'zod'

export const quoteSchema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters'),
  email:        z.string().email('Please enter a valid email address'),
  phone:        z.string().optional(),
  service_type: z.string().min(1, 'Please select a service type'),
  quantity:     z.string().optional(),
  deadline:     z.string().optional(),
  details:      z.string().min(20, 'Please describe your project in at least 20 characters'),
})
export type QuoteFormData = z.infer<typeof quoteSchema>

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const serviceSchema = z.object({
  name:        z.string().min(1, 'Name is required'),
  category:    z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  image_url:   z.string().optional(),
  slug:        z.string().optional(),
})
export type ServiceFormData = z.infer<typeof serviceSchema>

export const blogSchema = z.object({
  title:        z.string().min(1, 'Title is required'),
  slug:         z.string().min(1, 'Slug is required'),
  category:     z.string().optional(),
  excerpt:      z.string().optional(),
  content:      z.string().optional(),
  cover_url:    z.string().optional(),
  status:       z.enum(['Draft', 'Published']),
  published_at: z.string().optional(),
})
export type BlogFormData = z.infer<typeof blogSchema>

export const inventorySchema = z.object({
  name:      z.string().min(1, 'Name is required'),
  category:  z.string().optional(),
  stock:     z.coerce.number().min(0),
  price:     z.coerce.number().min(0),
  threshold: z.coerce.number().min(0),
})
export type InventoryFormData = z.infer<typeof inventorySchema>

export const staffSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email:     z.string().email('Valid email required'),
  role:      z.enum(['admin', 'staff']),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
})
export type StaffFormData = z.infer<typeof staffSchema>
