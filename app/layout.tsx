export const metadata = {
  title: 'ELEOS',
  description: 'AI Spatial Awareness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'black' }}>{children}</body>
    </html>
  )
}
