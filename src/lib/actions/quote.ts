'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { quoteSchema, type QuoteFormData } from '@/lib/validations'
import QuoteConfirmation from '@/lib/email/QuoteConfirmation'
import QuoteNotification from '@/lib/email/QuoteNotification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitQuote(data: QuoteFormData) {
  const parsed = quoteSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error: dbError } = await supabase
    .from('quote_requests')
    .insert(parsed.data)

  if (dbError) return { error: 'Could not save your request. Please try again.' }

  try {
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL!,
      to:      parsed.data.email,
      subject: 'We received your quote request — Seekant Multimedia',
      react:   QuoteConfirmation({ data: parsed.data }),
    })

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL!,
      to:      process.env.NOTIFICATION_EMAIL!,
      replyTo: parsed.data.email,
      subject: `New Quote Request: ${parsed.data.service_type} from ${parsed.data.name}`,
      react:   QuoteNotification({ data: parsed.data }),
    })
  } catch {
    // Email failure is non-fatal — the request was saved
  }

  return { success: true }
}
