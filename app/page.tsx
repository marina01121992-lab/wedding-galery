"use client"

import { useEffect,useState } from "react"
import { supabase } from "../lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function Home(){

const [images,setImages] = useState<string[]>([])
const [selected,setSelected] = useState<string | null>(null)

async function loadImages(){

const { data } = await supabase
.storage
.from("photos")
.list("",{limit:1000})

if(!data) return

const urls = data.map(file =>
supabase
.storage
.from("photos")
.getPublicUrl(file.name).data.publicUrl
)

setImages(urls)

}

useEffect(()=>{

loadImages()

const interval = setInterval(loadImages,5000)

return ()=>clearInterval(interval)

},[])


async function upload(e:React.ChangeEvent<HTMLInputElement>){

const file = e.target.files?.[0]

if(!file) return

const name = Date.now()+"-"+file.name

await supabase.storage
.from("photos")
.upload(name,file)

loadImages()

}


async function downloadAll(){

const zip = new JSZip()

for(const url of images){

const res = await fetch(url)
const blob = await res.blob()

zip.file(url.split("/").pop() || "photo",blob)

}

const content = await zip.generateAsync({type:"blob"})

saveAs(content,"svadbene-fotografije.zip")

}


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