import type { Metadata } from 'next'
import './globals.css'
import JSquadBadge from './components/JSquadBadge'

export const metadata: Metadata = {
  title: 'Brain Graph - Neural Learning Platform | J-Squad',
  description: 'Brain Graph - Connect your knowledge with neural network-style learning. Advanced assessment platform with interactive visualizations.',
  keywords: 'brain graph, neural learning, knowledge graph, communication assessment, interactive learning, J-Squad',
  authors: [{ name: 'J-Squad' }],
  creator: 'J-Squad',
  publisher: 'J-Squad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <JSquadBadge />
      </body>
    </html>
  )
}
