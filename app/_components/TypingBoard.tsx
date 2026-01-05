"use client"
import { KeyboardEventHandler, useEffect, useState } from "react"

interface TypingBoardProps {
  words: string[]
  setQuantity: (n: number) => void
  loading: boolean
  quantity: number
  changeWords: (n: number) => void
}
const TypingBoard = ({
  words,
  setQuantity,
  loading,
  quantity,
  changeWords,
}: TypingBoardProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(60)
  const [numberOfErrors, setNumberOfErrors] = useState(0)
  const [letterError, setLetterError] = useState(false)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [timer, setTimer] = useState(currentTime)

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (finished) return
    if (!started) setStarted(true)
    const allChars = words.join(" ").split("")
    if (
      e.key === "Shift" ||
      e.key === "CapsLock" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "Control"
    )
      return

    if (e.key === allChars[currentCharIndex]) {
      setCurrentCharIndex(currentCharIndex + 1)
      if (letterError) setLetterError(false)
      if (currentCharIndex === allChars.length - 1) {
        setFinished(true)
      }
    } else {
      setNumberOfErrors((prev) => prev + 1)
      setLetterError(true)
    }
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (timer > 0 && !finished && started) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer, finished, started])

  const formatTime = (seconds: number) => {
    return seconds < 10 ? `0${seconds}` : seconds
  }

  return (
    <div className="w-full max-w-5xl h-full p-6 space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
          Escribiendo
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Escribe las palabras que aparecen a continuación. Presiona las teclas
          correspondientes para avanzar.
        </p>
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Configuración
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCurrentTime(60)
                setTimer(60)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTime === 60
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              60s
            </button>

            <button
              onClick={() => {
                setCurrentTime(120)
                setTimer(120)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTime === 120
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              120s
            </button>

            <button
              onClick={() => {
                setCurrentTime(180)
                setTimer(180)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTime === 180
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              180s
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQuantity(25)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                words.length === 25
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              25 palabras
            </button>

            <button
              onClick={() => setQuantity(60)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                words.length === 60
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              60 palabras
            </button>

            <button
              onClick={() => setQuantity(100)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                words.length === 100
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              100 palabras
            </button>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
        <p>
          {currentCharIndex}/{words.join(" ").length}
        </p>

        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          {formatTime(timer)}
        </span>

        {finished && (
          <span className="text-green-600 dark:text-green-400 font-semibold">
            ¡Terminado!
          </span>
        )}
      </section>

      <div
        className="bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 text-2xl font-medium leading-relaxed outline-none rounded-xl p-6 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 transition-colors shadow-sm target-div"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {(() => {
          let globalIndex = 0
          return words.map((word: string, wordIndex: number) => (
            <div key={wordIndex} className="inline-block mb-0.5">
              {word.split("").map((char: string, index: number) => {
                const charGlobalIndex = globalIndex++
                const isCurrent = charGlobalIndex === currentCharIndex

                const colorClass =
                  letterError && charGlobalIndex === currentCharIndex
                    ? "text-red-500"
                    : charGlobalIndex >= currentCharIndex
                    ? "text-slate-300 dark:text-slate-600"
                    : "text-slate-800 dark:text-slate-200"

                return (
                  <span
                    key={`${wordIndex}-${index}`}
                    className={`inline-block relative ${colorClass}`}
                  >
                    {char}
                    {isCurrent && (
                      <span aria-hidden="true" className="typing-caret w-12" />
                    )}
                  </span>
                )
              })}

              {wordIndex < words.length - 1 &&
                (() => {
                  const spaceIndex = globalIndex++
                  const isSpaceCurrent = spaceIndex === currentCharIndex

                  const spaceColorClass =
                    letterError && spaceIndex === currentCharIndex
                      ? "text-red-500"
                      : spaceIndex >= currentCharIndex
                      ? "text-slate-300 dark:text-slate-600"
                      : "text-slate-800 dark:text-slate-200"

                  return (
                    <span
                      key={`space-${wordIndex}`}
                      className={`inline-block relative ${spaceColorClass}`}
                    >
                      &nbsp;
                      {isSpaceCurrent && (
                        <span
                          aria-hidden="true"
                          className="typing-caret w-full"
                        />
                      )}
                    </span>
                  )
                })()}
            </div>
          ))
        })()}
      </div>

      <div className="pb-8">
        <button
          className={`bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2.5 px-6 rounded-lg transition-colors ${
            loading ? "opacity-50 cursor-not-allowed hover:bg-blue-600" : ""
          }`}
          onClick={() => {
            changeWords(quantity)
            setFinished(false)
            setCurrentCharIndex(0)
            setNumberOfErrors(0)
            setLetterError(false)
            setStarted(false)
            setTimer(currentTime)
          }}
          disabled={loading}
        >
          Reiniciar
        </button>
      </div>

      {finished && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Resultados
          </h3>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <p>
              Total de caracteres escritos:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentCharIndex}
              </span>
            </p>
            <p>
              Número de errores:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {numberOfErrors}
              </span>
            </p>
            <p>
              Porcentaje de errores:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {((numberOfErrors / currentCharIndex) * 100).toFixed(2)}%
              </span>
            </p>
            <p>
              Tiempo restante:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatTime(timer)}
              </span>
            </p>
            <p>
              Palabras por minuto:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                {((currentCharIndex / 5 / (currentTime - timer)) * 60).toFixed(
                  2
                )}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
export default TypingBoard
