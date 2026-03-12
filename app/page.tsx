"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function Home(){

const [images,setImages] = useState<string[]>([])
const [selected,setSelected] = useState<string | null>(null)

async function loadImages(){

const {data} = await supabase
.storage
.from("wedding-gallery")
.list("",{limit:100})

if(!data) return

const urls = data.map((file)=>
supabase
.storage
.from("wedding-gallery")
.getPublicUrl(file.name).data.publicUrl
)

setImages(urls)

}

async function uploadImage(e:any){

const file = e.target.files[0]

if(!file) return

await supabase
.storage
.from("wedding-gallery")
.upload(file.name,file)

loadImages()

}

async function downloadAll(){

const zip = new JSZip()

for(let i=0;i<images.length;i++){

const res = await fetch(images[i])
const blob = await res.blob()

zip.file(`photo-${i}.jpg`,blob)

}

const content = await zip.generateAsync({type:"blob"})
saveAs(content,"wedding-photos.zip")

}

useEffect(()=>{

loadImages()

/* AUTO REFRESH */

const interval=setInterval(()=>{
loadImages()
},8000)

/* GLITTER */

const glitter=document.querySelector(".glitter")

if(glitter){

for(let i=0;i<60;i++){

const spark=document.createElement("div")

spark.className="sparkle"

spark.style.left=Math.random()*100+"%"
spark.style.animationDuration=6+Math.random()*10+"s"
spark.style.animationDelay=Math.random()*5+"s"

glitter.appendChild(spark)

}

}

return ()=>clearInterval(interval)

},[])

return(

<main>

<section className="hero">

<h1 className="hero-names">
Emanuel & Marina
</h1>

<p className="hero-date">
13.06.2026
</p>

<div>

<label className="gold-btn">
Dodaj fotografiju
<input
type="file"
onChange={uploadImage}
style={{display:"none"}}
/>
</label>

<button
className="gold-btn"
onClick={downloadAll}
>
Preuzmi fotografije
</button>

</div>

</section>

<div className="gallery">

{images.map((url,index)=>(

<img
key={index}
src={url}
onClick={()=>setSelected(url)}
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