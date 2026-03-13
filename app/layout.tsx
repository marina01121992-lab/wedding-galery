import "./globals.css"

export const metadata = {
  title: "Emanuel & Marina",
  description: "Wedding Gallery"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr">
      <body>
        {children}
      </body>
    </html>
  )
}