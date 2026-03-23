import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter Subscription Confirmed',
  description:
    'Thank you for subscribing to our newsletter. Stay updated with the latest insights on habits, self-improvement, and personal growth.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ConfirmLayout({ children }: { children: React.ReactNode }) {
  return children
}
