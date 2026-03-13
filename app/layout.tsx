import "./globals.css"
import { Playfair_Display, Great_Vibes } from "next/font/google"

const serif = Playfair_Display({ subsets: ["latin"] })
const script = Great_Vibes({ weight: "400", subsets: ["latin"] })

export const metadata = {
  title: "Emanuel & Marina",
  description: "Wedding gallery",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr">
      <body className={serif.className}>
        <div className="sparkle-container"></div>
        {children}
      </body>
    </html>
  )
}