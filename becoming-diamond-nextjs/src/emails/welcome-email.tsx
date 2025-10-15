import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
  unsubscribeUrl: string;
}

export function WelcomeEmail({ email, unsubscribeUrl }: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <Html>
      <Head />
      <Preview>Your Diamond Sprint materials are ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>Becoming Diamond</Heading>
          </Section>

          {/* Main Content */}
          <Heading style={h1}>Welcome to the Diamond Sprint 💎</Heading>

          <Text style={text}>Hi there!</Text>

          <Text style={text}>
            Thanks for joining the 30-Day Diamond Sprint. Your transformation materials are ready to access.
          </Text>

          {/* Primary CTA */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/app/sprint`}>
              Access Your Sprint Materials →
            </Button>
          </Section>

          {/* What You'll Learn */}
          <Text style={text}>
            Over the next 30 days, you'll learn to:
          </Text>

          <ul style={list}>
            <li style={listItem}>Master presence under pressure</li>
            <li style={listItem}>Regulate your nervous system</li>
            <li style={listItem}>Rewire your identity for unshakable clarity</li>
            <li style={listItem}>Lead with confidence even when everything is unraveling</li>
          </ul>

          {/* Testimonial Box */}
          <Section style={testimonialBox}>
            <Text style={testimonialText}>
              "This program fundamentally changed how I show up in high-stakes situations.
              I'm no longer reactive—I'm present."
            </Text>
            <Text style={testimonialAuthor}>— Sarah K., Executive Coach</Text>
          </Section>

          {/* Secondary CTA */}
          <Text style={text}>
            Want the complete program? Get the full Becoming Diamond book:
          </Text>

          <Section style={buttonContainer}>
            <Button style={secondaryButton} href={`${baseUrl}/book`}>
              View the Book
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you signed up for the Diamond Sprint at{' '}
              <Link href={baseUrl} style={link}>becomingdiamond.com</Link>
            </Text>
            <Text style={footerText}>
              <Link href={`${baseUrl}/privacy`} style={link}>
                Privacy Policy
              </Link>
              {' • '}
              <Link href={`${baseUrl}/terms`} style={link}>
                Terms
              </Link>
              {' • '}
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={footerCopyright}>
              © 2025 Becoming Diamond. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#4fc3f7',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  lineHeight: '1.3',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const list = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.8',
  paddingLeft: '20px',
  marginBottom: '24px',
};

const listItem = {
  marginBottom: '8px',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#4fc3f7',
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  cursor: 'pointer',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#4fc3f7',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  border: '2px solid #4fc3f7',
  cursor: 'pointer',
};

const testimonialBox = {
  backgroundColor: 'rgba(79, 195, 247, 0.1)',
  border: '1px solid rgba(79, 195, 247, 0.3)',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const testimonialText = {
  color: '#ffffff',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  marginBottom: '12px',
};

const testimonialAuthor = {
  color: '#4fc3f7',
  fontSize: '14px',
  marginBottom: '0',
};

const footer = {
  marginTop: '48px',
  paddingTop: '24px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginBottom: '8px',
};

const footerCopyright = {
  color: '#6b7280',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '16px',
};

const link = {
  color: '#4fc3f7',
  textDecoration: 'underline',
};

// Default export for preview
export default WelcomeEmail;
