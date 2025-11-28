/* eslint-disable react-hooks/purity */
"use client"

import { useState } from "react"
import words from "../public/words.json"
import TypingBoard from "./_components/TypingBoard"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [wordsList, setWordsList] = useState<string[]>(
    (words as string[]).sort(() => Math.random() - 0.5).slice(0, 10)
  )

  const sample = (arr: string[], n: number) => {
    const result: string[] = []
    const len = arr.length
    const taken = new Set<number>()
    while (result.length < n) {
      const i = Math.floor(Math.random() * len)
      if (!taken.has(i)) {
        taken.add(i)
        result.push(arr[i])
      }
    }
    return result
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main
        className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"
        aria-busy={loading}
      >
        {loading ? (
          <p className="text-2xl text-gray-500">Cargando...</p>
        ) : (
          <TypingBoard words={wordsList} />
        )}
        {/* Reiniciar el juego */}
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed hover:bg-blue-500" : ""
          }`}
          onClick={() => {
            setLoading(true)
            // calcular en otro tick para que React pinte el estado "loading"
            setTimeout(() => {
              setWordsList(sample(words as string[], 10))
              setLoading(false)
            }, 50)
          }}
          disabled={loading}
        >
          Reiniciar
        </button>
      </main>
    </div>
  )
}
