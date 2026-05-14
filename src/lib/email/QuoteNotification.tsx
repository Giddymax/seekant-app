import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column,
} from '@react-email/components'
import type { QuoteFormData } from '@/lib/validations'

export default function QuoteNotification({ data }: { data: QuoteFormData }) {
  const fields = [
    { label: 'Name',         value: data.name },
    { label: 'Email',        value: data.email },
    { label: 'Phone',        value: data.phone ?? '—' },
    { label: 'Service',      value: data.service_type },
    { label: 'Quantity',     value: data.quantity ?? '—' },
    { label: 'Deadline',     value: data.deadline ?? '—' },
    { label: 'Details',      value: data.details },
  ]

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', background: '#f7f8fa', margin: 0 }}>
        <Section style={{ background: '#15212c', padding: '20px 40px' }}>
          <Text style={{ fontSize: 14, fontWeight: 900, color: '#ddb837', margin: 0 }}>
            NEW QUOTE REQUEST
          </Text>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Seekant Multimedia CMS
          </Text>
        </Section>

        <Container style={{ background: '#fff', padding: '40px', maxWidth: 560 }}>
          <Heading style={{ fontSize: 20, fontWeight: 800, color: '#1a181d', marginBottom: 8 }}>
            {data.service_type} — from {data.name}
          </Heading>
          <Text style={{ color: '#737a80', marginBottom: 24 }}>
            A new quote request has been submitted. Reply to this email to contact the customer directly.
          </Text>

          <Section style={{ background: '#f7f8fa', borderRadius: 8, padding: '20px 24px' }}>
            {fields.map(f => (
              <Row key={f.label} style={{ marginBottom: 10 }}>
                <Column style={{ width: 120, color: '#737a80', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {f.label}
                </Column>
                <Column style={{ color: '#1a181d', fontSize: 13 }}>{f.value}</Column>
              </Row>
            ))}
          </Section>
        </Container>

        <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />
        <Container style={{ padding: '20px 40px', maxWidth: 560 }}>
          <Text style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
            This notification was sent automatically by Seekant Multimedia CMS.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
