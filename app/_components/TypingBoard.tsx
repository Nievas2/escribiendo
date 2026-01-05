"use client"
import { KeyboardEventHandler, useEffect, useState } from "react"

interface TypingBoardProps {
  words: string[]
}
const TypingBoard = ({ words }: TypingBoardProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [letterError, setLetterError] = useState(false)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [timer, setTimer] = useState(60)

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (finished) return
    if (!started) setStarted(true)
    const allChars = words.join(" ").split("")
    console.log(e.key, allChars[currentCharIndex])
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
    } else {
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
      <style>{`
        @keyframes caret-blink {
          0%   { opacity: 1; }
          50%  { opacity: 0; }
          100% { opacity: 1; }
        }
        .typing-caret {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #60a5fa;
          bottom: 2px;
          animation: caret-blink 1s steps(1) infinite;
        }
      `}</style>

      <section className="text-center">
        <h1 className="text-3xl font-bold mb-4">Escribiendo</h1>
        <p>
          Escribe las palabras que aparecen a continuación. Presiona las teclas
          correspondientes para avanzar.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Configuracion:</h2>
        <div className="space-x-4">
          {/* Configurar tiempo */}
          <button
            onClick={() => setTimer(60)}
            className={`p-2 text-white rounded ${
              timer === 60 ? "bg-blue-600" : "bg-transparent"
            } hover:bg-blue-600`}
          >
            60 Segundos
          </button>
          <button
            onClick={() => setTimer(120)}
            className={`p-2 text-white rounded ${
              timer === 120 && "bg-blue-600"
            } hover:bg-blue-600`}
          >
            120 Segundos
          </button>

          <button
            onClick={() => setTimer(180)}
            className={`p-2 text-white rounded ${
              timer === 180 && "bg-blue-600"
            } hover:bg-blue-600`}
          >
            180 Segundos
          </button>
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
        className="text-gray-200 text-2xl font-medium leading-relaxed ring-0 outline-none focus:ring-0 focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {(() => {
          let globalIndex = 0
          return words.map((word: string, wordIndex: number) => (
            <div key={wordIndex} className="inline-block mr-2 mb-2">
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
                      <span aria-hidden="true" className="typing-caret" />
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
                        <span aria-hidden="true" className="typing-caret w-4" />
                      )}
                    </span>
                  )
                })()}
            </div>
          ))
        })()}
      </div>
    </div>
  )
}
export default TypingBoard
