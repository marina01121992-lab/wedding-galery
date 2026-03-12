"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {

const [images,setImages] = useState<string[]>([])
const [selected,setSelected] = useState<string | null>(null)

async function loadImages(){
const { data } = await supabase.storage
.from("photos")
.list("",{ limit:100 })

if(!data) return

const urls = data.map(file =>
supabase.storage
.from("photos")
.getPublicUrl(file.name).data.publicUrl
)

setImages(urls)
}

useEffect(()=>{
loadImages()
},[])

return(

<main>

<section className="hero">

<h1 className="names">
<span>Marina</span>
<span className="and">&</span>
<span>Emanuel</span>
</h1>

<p className="date">
13.06.2026
</p>

<p className="welcome">
Podijelite s nama nezaboravne trenutke ovog posebnog dana
i pomozite nam sačuvati uspomene koje ćemo zauvijek nositi u srcu ✨
</p>

</section>


<section className="gallery">

{images.map((img,i)=>(
<img
key={i}
src={img}
onClick={()=>setSelected(img)}
/>
))}

</section>

{selected && (
<div className="fullscreen" onClick={()=>setSelected(null)}>
<img src={selected}/>
</div>
)}

</main>

)
}
