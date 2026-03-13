"use client"

import { useEffect,useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home(){

const [images,setImages] = useState<string[]>([])
const [slide,setSlide] = useState(0)
const [selected,setSelected] = useState<string|null>(null)

async function loadImages(){

const { data,error } = await supabase.storage
.from("photos")
.list("",{
limit:100,
sortBy:{column:"created_at",order:"desc"}
})

if(error){
console.log(error)
return
}

const urls = data.map(file=>{

const { data:publicUrl } = supabase.storage
.from("photos")
.getPublicUrl(file.name)

return publicUrl.publicUrl

})

setImages(urls)

}

useEffect(()=>{

loadImages()

const refresh = setInterval(loadImages,4000)

return ()=>clearInterval(refresh)

},[])

useEffect(()=>{

if(images.length===0) return

const timer = setInterval(()=>{

setSlide(s=>(s+1)%Math.min(images.length,10))

},3000)

return ()=>clearInterval(timer)

},[images])

async function upload(e:React.ChangeEvent<HTMLInputElement>){

const file = e.target.files?.[0]

if(!file) return

const name = Date.now()+"-"+file.name

const {error} = await supabase.storage
.from("photos")
.upload(name,file)

if(error){
alert("Upload error")
console.log(error)
}

loadImages()

}

const slideshow = images.slice(0,10)

return(

<main>

<section className="hero">

<h1>

<span>Emanuel</span>

<span className="and">&</span>

<span>Marina</span>

</h1>

<p className="date">

13.06.2026

</p>

<p className="welcome">

Podijelite s nama nezaboravne trenutke današnjeg dana

</p>

</section>


<label className="uploadBtn">

Dodaj fotografiju

<input
type="file"
accept="image/*"
onChange={upload}
/>

</label>


{slideshow.length>0 && (

<div className="slideshow">

<img src={slideshow[slide]} />

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


{selected &&(

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