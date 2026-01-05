"use client"
import { KeyboardEventHandler, useEffect, useState } from "react"

interface TypingBoardProps {
  words: string[]
  setQuantity: (n: number) => void
}
const TypingBoard = ({ words, setQuantity }: TypingBoardProps) => {
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
    <div className="w-full h-full rounded-md p-4 overflow-y-auto space-y-6">
      <section className="text-center">
        <h1 className="text-3xl font-bold mb-4">Escribiendo</h1>
        <p>
          Escribe las palabras que aparecen a continuación. Presiona las teclas
          correspondientes para avanzar.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Configuracion:</h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="space-x-4">
            {/* Configurar tiempo */}
            <button
              onClick={() => {
                setCurrentTime(60)
                setTimer(60)
              }}
              className={`p-2 text-white rounded ${
                currentTime === 60 ? "bg-blue-600" : "bg-transparent"
              } hover:bg-blue-600`}
            >
              60 Segundos
            </button>

            <button
              onClick={() => {
                setCurrentTime(120)
                setTimer(120)
              }}
              className={`p-2 text-white rounded ${
                currentTime === 120 && "bg-blue-600"
              } hover:bg-blue-600`}
            >
              120 Segundos
            </button>

            <button
              onClick={() => {
                setCurrentTime(180)
                setTimer(180)
              }}
              className={`p-2 text-white rounded ${
                currentTime === 180 && "bg-blue-600"
              } hover:bg-blue-600`}
            >
              180 Segundos
            </button>
          </div>

          {/* Configurar palabras */}
          <div>
            <button
              onClick={() => setQuantity(25)}
              className={`p-2 text-white rounded ${
                words.length === 25 && "bg-blue-600"
              } hover:bg-blue-600`}
            >
              25 Palabras
            </button>

            <button
              onClick={() => setQuantity(60)}
              className={`p-2 text-white rounded ${
                words.length === 60 && "bg-blue-600"
              } hover:bg-blue-600`}
            >
              60 Palabras
            </button>

            <button
              onClick={() => setQuantity(100)}
              className={`p-2 text-white rounded ${
                words.length === 100 && "bg-blue-600"
              } hover:bg-blue-600`}
            >
              100 Palabras
            </button>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between w-full">
        <p>
          {currentCharIndex}/{words.join(" ").length}
        </p>

        <span>{formatTime(timer)}</span>

        {finished && (
          <span className="ml-4 text-green-500 font-semibold">
            {"Time's up!"}
          </span>
        )}
      </section>
      <div
        className="text-gray-200 text-2xl font-medium leading-relaxed ring-0 outline-none focus:ring-0 focus:outline-none rounded-xl p-2 border target-div"
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

                return (
                  <span
                    key={`${wordIndex}-${index}`}
                    className={`inline-block relative
                      ${
                        charGlobalIndex >= currentCharIndex
                          ? "text-gray-800"
                          : ""
                      }
                      ${
                        letterError && charGlobalIndex === currentCharIndex
                          ? "text-red-500"
                          : ""
                      }
                    `}
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
                  return (
                    <span
                      key={`space-${wordIndex}`}
                      className={`inline-block relative
                        ${spaceIndex >= currentCharIndex ? "text-gray-800" : ""}
                        ${
                          letterError && spaceIndex === currentCharIndex
                            ? "text-red-500"
                            : ""
                        }
                      `}
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
      {finished && (
        <div className="mt-4 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Resultados:</h3>
          <p>Total de caracteres escritos: {currentCharIndex}</p>
          <p>Número de errores: {numberOfErrors}</p>
          <p>
            Porcentaje de errores:{" "}
            {((numberOfErrors / currentCharIndex) * 100).toFixed(2)}%
          </p>
          <p>Tiempo restante: {formatTime(timer)}</p>
          {
            <p>
              Palabras por minuto:{" "}
              {((currentCharIndex / timer) * 60).toFixed(2)}
            </p>
          }
        </div>
      )}
    </div>
  )
}
export default TypingBoard
