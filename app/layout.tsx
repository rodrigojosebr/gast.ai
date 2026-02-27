import './globals.css'
import AuthProvider from '../components/AuthProvider';

export const metadata = {
  title: 'Gast.ai',
  description: 'Seu assistente de finanças inteligente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
