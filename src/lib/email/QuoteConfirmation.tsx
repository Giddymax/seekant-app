import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column,
} from '@react-email/components'
import type { QuoteFormData } from '@/lib/validations'

export default function QuoteConfirmation({ data }: { data: QuoteFormData }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', background: '#f7f8fa', margin: 0, padding: 0 }}>
        {/* Header */}
        <Section style={{ background: '#ddb837', padding: '20px 40px' }}>
          <Text style={{ fontSize: 20, fontWeight: 900, color: '#1a181d', margin: 0 }}>
            SM &nbsp;|&nbsp; Seekant Multimedia
          </Text>
          <Text style={{ fontSize: 11, color: '#1a181d', margin: 0, letterSpacing: 2 }}>
            DESIGN · PRINT · BRAND
          </Text>
        </Section>

        <Container style={{ background: '#fff', padding: '40px', maxWidth: 560 }}>
          <Heading style={{ fontSize: 22, fontWeight: 800, color: '#1a181d', marginBottom: 8 }}>
            Thank you, {data.name}!
          </Heading>
          <Text style={{ color: '#737a80', lineHeight: 1.7, marginBottom: 24 }}>
            We&apos;ve received your quote request and will get back to you within 24 hours.
            Here&apos;s a summary of what you submitted:
          </Text>

          <Section style={{ background: '#f7f8fa', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
            <Row style={{ marginBottom: 12 }}>
              <Column style={{ width: 140, color: '#737a80', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Service</Column>
              <Column style={{ color: '#1a181d', fontSize: 13 }}>{data.service_type}</Column>
            </Row>
            {data.quantity && (
              <Row style={{ marginBottom: 12 }}>
                <Column style={{ width: 140, color: '#737a80', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Quantity</Column>
                <Column style={{ color: '#1a181d', fontSize: 13 }}>{data.quantity}</Column>
              </Row>
            )}
            {data.deadline && (
              <Row style={{ marginBottom: 12 }}>
                <Column style={{ width: 140, color: '#737a80', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Deadline</Column>
                <Column style={{ color: '#1a181d', fontSize: 13 }}>{data.deadline}</Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: 140, color: '#737a80', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Details</Column>
              <Column style={{ color: '#1a181d', fontSize: 13 }}>{data.details}</Column>
            </Row>
          </Section>

          <Text style={{ color: '#737a80', fontSize: 13, lineHeight: 1.7 }}>
            Our team will review your request and reach out to {data.email}
            {data.phone ? ` or ${data.phone}` : ''} shortly.
          </Text>
        </Container>

        <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />

        <Container style={{ padding: '20px 40px', maxWidth: 560 }}>
          <Text style={{ fontSize: 11, color: '#aaa', lineHeight: 1.8, margin: 0 }}>
            Seekant Multimedia · Main Street, City Centre, Accra, Ghana<br />
            +233 XX XXX XXXX · info@seekantmultimedia.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
