import { createClient } from '@/lib/supabase/server'
import ProductsClientPage from '@/components/public/ProductsClientPage'

export const metadata = { title: 'Products – Seekant Multimedia' }

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  return <ProductsClientPage products={products ?? []} />
}
