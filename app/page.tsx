"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import GlitterCanvas from "../components/GlitterCanvas"

export default function Home() {
  const [images, setImages] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  // 📸 LOAD IMAGES
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

    const urls = data
      .filter((file) => file.name) // zaštita
      .map((file) => {
        const { data } = supabase.storage
          .from("photos")
          .getPublicUrl(file.name)

        return data.publicUrl
      })

    setImages(urls)
  }

  useEffect(() => {
    loadImages()
  }, [])

  // 📤 UPLOAD + ❤️ HEART EFFECT
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

    createHearts()
    loadImages()
  }

  // ❤️ FLOATING HEARTS
  function createHearts() {
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement("div")
      heart.className = "heart"
      heart.style.left = Math.random() * 100 + "vw"
      heart.style.animationDuration = 2 + Math.random() * 3 + "s"
      document.body.appendChild(heart)

      setTimeout(() => heart.remove(), 4000)
    }
  }

  return (
    <main>
      {/* ✨ GLITTER BACKGROUND */}
      <GlitterCanvas />

      {/* 💎 HEADER */}
      <h1 className="title">Emanuel & Marina</h1>

      <p className="subtitle">
        Podijelite s nama nezaboravne trenutke 💖
      </p>

      {/* 📤 UPLOAD */}
      <label className="uploadBtn">
        Dodaj fotografiju
        <input type="file" accept="image/*" onChange={upload} />
      </label>

      {/* 📭 EMPTY STATE */}
      {images.length === 0 && (
        <p className="empty">Još nema fotografija 📸</p>
      )}

      {/* 📸 INSTAGRAM GRID */}
      <div className="gallery">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="slika"
            onClick={() => setSelected(img)}
          />
        ))}
      </div>

      {/* 🔍 FULLSCREEN VIEW */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected} alt="fullscreen" />
        </div>
      )}
    </main>
  )
}