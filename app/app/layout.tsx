import './globals.css'

export const metadata = {
  title: 'QuickServiceMatch',
  description: 'Connect with the best local services instantly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
