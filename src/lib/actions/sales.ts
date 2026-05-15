'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateSaleRef } from '@/lib/utils'

export type CartItem = {
  product_id: number
  name: string
  quantity: number
  unit_price: number
}

export async function createSale({
  customer_name,
  customer_phone,
  payment_method,
  items,
  notes,
  discount = 0,
  amount_paid,
}: {
  customer_name?: string
  customer_phone?: string
  payment_method: string
  items: CartItem[]
  notes?: string
  discount?: number
  amount_paid?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
  const total = Math.max(0, subtotal - discount)
  const paid = amount_paid ?? total
  const status = paid >= total ? 'Completed' : paid > 0 ? 'Part-Payment' : 'Pending'
  const sale_ref = generateSaleRef()

  const { data: sale, error: saleErr } = await supabase
    .from('sales')
    .insert({
      sale_ref,
      customer_name: customer_name || 'Walk-in',
      customer_phone: customer_phone || null,
      total,
      discount,
      amount_paid: paid,
      payment_method,
      staff_id: user.id,
      notes: notes || null,
      status,
    })
    .select('id')
    .single()

  if (saleErr || !sale) return { error: saleErr?.message ?? 'Failed to create sale' }

  const lineItems = items.map(i => ({
    sale_id:      sale.id,
    product_name: i.name,
    quantity:     i.quantity,
    unit_price:   i.unit_price,
    line_total:   i.quantity * i.unit_price,
  }))

  const { error: itemsErr } = await supabase.from('sale_items').insert(lineItems)
  if (itemsErr) return { error: itemsErr.message }

  for (const item of items) {
    await supabase.rpc('decrement_inventory_stock', { p_id: item.product_id, p_qty: item.quantity })
      .then(async ({ error }) => {
        if (error) {
          const { data: inv } = await supabase.from('inventory').select('stock').eq('id', item.product_id).single()
          if (inv) {
            await supabase.from('inventory').update({ stock: Math.max(0, inv.stock - item.quantity) }).eq('id', item.product_id)
          }
        }
      })
  }

  return { success: true, sale_ref, status }
}

export async function getSales() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sales')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function updateSaleStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').update({ status }).eq('id', id)
  return error ? { error: error.message } : { success: true }
}

export async function updateSale(id: string, updates: {
  customer_name?: string
  customer_phone?: string
  payment_method?: string
  status?: string
  notes?: string
  discount?: number
  amount_paid?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').update(updates).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/sales')
  return { success: true }
}

export async function addPayment(sale_id: string, additional: number) {
  const supabase = await createClient()
  const { data: sale, error: fetchErr } = await supabase
    .from('sales')
    .select('total, amount_paid')
    .eq('id', sale_id)
    .single()
  if (fetchErr || !sale) return { error: fetchErr?.message ?? 'Sale not found' }

  const new_amount_paid = Math.min(Number(sale.amount_paid) + additional, Number(sale.total))
  const new_status = new_amount_paid >= Number(sale.total) ? 'Completed' : 'Part-Payment'

  const { error } = await supabase
    .from('sales')
    .update({ amount_paid: new_amount_paid, status: new_status })
    .eq('id', sale_id)
  if (error) return { error: error.message }
  revalidatePath('/admin/sales')
  return { success: true, new_amount_paid, new_status }
}

export async function deleteSale(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/sales')
  return { success: true }
}

export async function getSaleItems(sale_id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sale_items')
    .select('product_name, quantity, unit_price, line_total')
    .eq('sale_id', sale_id)
  return data ?? []
}
