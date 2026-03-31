"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [images, setImages] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  async function loadImages() {
    const { data, error } = await supabase.storage
      .from("photos")
      .list("", {
        limit: 50,
        sortBy: { column: "created_at", order: "desc" }
      })

    if (error) {
      console.log(error)
      return
    }

    const urls = data.map((file) => {
      const { data: urlData } = supabase
        .storage
        .from("photos")
        .getPublicUrl(file.name)

      return urlData.publicUrl
    })

    setImages(urls)
  }

  useEffect(() => {
    loadImages()
  }, [])

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const fileName = Date.now() + "-" + file.name

    const { error } = await supabase.storage
      .from("photos")
      .upload(fileName, file)

    if (error) {
      alert("Greška pri uploadu")
      return
    }

    loadImages()
  }

  return (
    <main>
      <h1 className="title">Emanuel & Marina</h1>

      <p className="subtitle">
        Podijelite s nama nezaboravne trenutke 💖
      </p>

      <label className="uploadBtn">
        Dodaj fotografiju
        <input type="file" accept="image/*" onChange={upload} />
      </label>

      <div className="gallery">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            onClick={() => setSelected(img)}
          />
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected} alt="" />
        </div>
      )}
    </main>
  )
}