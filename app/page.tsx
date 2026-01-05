/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import words from "../public/words.json"
import TypingBoard from "./_components/TypingBoard"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(25)
  const [wordsList, setWordsList] = useState<string[]>([])

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
      className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
      aria-busy={loading}
    >
      {loading || wordsList.length == 0 ? (
        <p className="text-2xl text-slate-400">Cargando...</p>
      ) : (
        <TypingBoard
          words={wordsList}
          setQuantity={setQuantity}
          loading={loading}
          quantity={quantity}
          changeWords={changeWords}
        />
      )}
    </main>
  )
}
