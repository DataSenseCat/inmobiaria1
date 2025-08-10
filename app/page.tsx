import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the Builder-managed catch-all route
  redirect('/inicio')
}
