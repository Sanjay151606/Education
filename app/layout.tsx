import type { Metadata } from 'next'
import './globals.css'
import ChatBot from './components/ChatBot'

export const metadata: Metadata = {
  title: 'Brain Graph - Neural Learning Platform',
  description: 'Brain Graph - Connect your knowledge with neural network-style learning. Advanced assessment platform with interactive visualizations.',
  keywords: 'brain graph, neural learning, knowledge graph, communication assessment, interactive learning',
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
        <ChatBot />
      </body>
    </html>
  )
}
