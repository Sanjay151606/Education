import Navigation from '../components/Navigation'
import { AuthProvider } from './lib/context/AuthContext'

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Navigation />
      {children}
    </AuthProvider>
  )
}
