/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import words from "../public/words.json"
import TypingBoard from "./_components/TypingBoard"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(25)
  const [wordsList, setWordsList] = useState<string[]>(
    (words as string[]).slice(0, 10)
  )

  const changeWords = (n: number) => {
    const result: string[] = []
    const arr = words as string[]
    const len = arr.length
    const taken = new Set<number>()
    while (result.length < n) {
      const i = Math.floor(Math.random() * len)
      if (!taken.has(i)) {
        taken.add(i)
        result.push(arr[i])
      }
    }
    setWordsList(result)
  }

  useEffect(() => {
    setLoading(true)
    const arr = [...(words as string[])]
    setWordsList(arr.sort(() => Math.random() - 0.5).slice(0, 10))
    changeWords(quantity)
    setLoading(false)
  }, [quantity])

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center bg-white dark:bg-black"
      aria-busy={loading}
    >
      {loading ? (
        <p className="text-2xl text-gray-500">Cargando...</p>
      ) : (
        <TypingBoard words={wordsList} setQuantity={setQuantity} />
      )}
      {/* Reiniciar el juego */}
      <div>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed hover:bg-blue-500" : ""
          }`}
          onClick={() => {
            changeWords(quantity)
          }}
          disabled={loading}
        >
          Reiniciar
        </button>
      </div>
    </main>
  )
}
