import "./globals.css"
import { Playfair_Display } from "next/font/google"

const font = Playfair_Display({
  subsets: ["latin"],
})

export const metadata = {
  title: "Emanuel & Marina",
  description: "Wedding Gallery"
}

export default function RootLayout({
  children,
}:{
  children:React.ReactNode
}){

  return(

<html lang="en">

<body className={font.className}>

<div className="glitter"></div>

{children}

</body>

</html>

  )
}