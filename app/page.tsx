/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState, useCallback } from "react"
import words from "../public/words.json"
import TypingBoard from "./_components/TypingBoard"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(25)
  const [wordsList, setWordsList] = useState<string[]>([])

  const changeWords = useCallback((n: number) => {
    const arr = words as string[]
    const len = arr.length
    const result: string[] = []
    const taken = new Set<number>()

    while (result.length < n) {
      const i = Math.floor(Math.random() * len)
      if (!taken.has(i)) {
        taken.add(i)
        result.push(arr[i])
      }
    }

    setWordsList(result)
  }, [])

  useEffect(() => {
    changeWords(quantity)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      changeWords(quantity)
    }
  }, [quantity, changeWords, loading])

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
      aria-busy={loading}
    >
      {loading || wordsList.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl text-slate-400">Cargando...</p>
        </div>
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
