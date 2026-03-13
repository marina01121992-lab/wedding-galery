import "./globals.css"

export const metadata = {
title: "Emanuel & Marina",
description: "Wedding gallery"
}

export default function RootLayout({
children
}:{children:React.ReactNode}){

return(

<html lang="hr">

<head>

<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet"/>

</head>

<body>

{children}

</body>

</html>

)

}