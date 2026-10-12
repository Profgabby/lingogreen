import { notFound } from 'next/navigation'
import EnglishHubPage from '@/app/hub/en/page'

export default function EnglishPreviewDashboard() {
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) notFound()
  return <EnglishHubPage previewMode />
}
