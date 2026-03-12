import "./globals.css"
import { Playfair_Display, Great_Vibes } from "next/font/google"

const namesFont = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-names"
})

const bodyFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400","500","600"],
  variable: "--font-body"
})

export const metadata = {
  title: "Emanuel & Marina",
  description: "Wedding gallery"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={`${namesFont.variable} ${bodyFont.variable}`}>
      <body>

        <div className="glitter"></div>

        {children}

      </body>
    </html>
  )
}