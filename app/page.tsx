"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function Home() {

const [images,setImages] = useState<string[]>([])
const [selected,setSelected] = useState<string | null>(null)
const [slide,setSlide] = useState(0)

async function loadImages(){

const { data } = await supabase
.storage
.from("photos")
.list("",{ limit:1000 })

if(!data) return

const urls = data.map(file =>
supabase.storage
.from("photos")
.getPublicUrl(file.name).data.publicUrl
)

setImages(urls.reverse())

}

useEffect(()=>{

loadImages()

const interval = setInterval(loadImages,5000)

return ()=>clearInterval(interval)

},[])

useEffect(()=>{

if(images.length===0) return

const timer=setInterval(()=>{
setSlide(s=> (s+1)%Math.min(images.length,10))
},3000)

return ()=>clearInterval(timer)

},[images])

async function upload(e:React.ChangeEvent<HTMLInputElement>){

const file=e.target.files?.[0]
if(!file) return

const name=Date.now()+"-"+file.name

await supabase.storage
.from("photos")
.upload(name,file)

loadImages()

}

async function downloadAll(){

const zip=new JSZip()

for(const url of images){

const res=await fetch(url)
const blob=await res.blob()

zip.file(url.split("/").pop() || "photo",blob)

}

const content=await zip.generateAsync({type:"blob"})
saveAs(content,"svadbene-fotografije.zip")

}

const slideshowImages = images.slice(0,10)

return(

<main>

<section className="hero">

<h1 className="names">

Emanuel
<span>&</span>
Marina

</h1>

<p className="date">
13.06.2026
</p>

<p className="welcome">
Podijelite s nama nezaboravne trenutke današnjeg dana
</p>

</section>


<div className="buttons">

<label className="goldBtn">

Dodaj fotografiju

<input
type="file"
accept="image/*"
onChange={upload}
/>

</label>

<button
className="goldBtn"
onClick={downloadAll}
>

Preuzmi fotografije

</button>

</div>


{slideshowImages.length>0 && (

<div className="slideshow">

<img src={slideshowImages[slide]} />

</div>

)}


<div className="gallery">

{images.map((img,i)=>(

<img
key={i}
src={img}
onClick={()=>setSelected(img)}
/>

))}

</div>


{selected && (

<div
className="fullscreen"
onClick={()=>setSelected(null)}
>

<img src={selected}/>

</div>

)}

</main>

)

}