"use client"
import { KeyboardEventHandler, useState } from "react"

interface TypingBoardProps {
  words: string[]
}
const TypingBoard = ({ words }: TypingBoardProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [letterError, setLetterError] = useState(false)

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    const allChars = words.join(" ").split("") // <-- ahora con espacios entre palabras
    console.log(e.key, allChars[currentCharIndex])
    if (
      e.key === "Shift" ||
      e.key === "CapsLock" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "Control"
    )
      return // Ignore modifier keys

    if (e.key === allChars[currentCharIndex]) {
      setCurrentCharIndex(currentCharIndex + 1)
      if (letterError) setLetterError(false)
    } else {
      setLetterError(true)
    }
  }

  return (
    <div className="w-full h-full rounded-md p-4 overflow-y-auto ">
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

      <p>
        {currentCharIndex}/{words.join(" ").length}
      </p>
      <div
        className="text-gray-200 text-2xl font-medium leading-relaxed ring-0 outline-none focus:ring-0 focus:outline-none"
        tabIndex={0}
        onKeyDown={(e) => {
          console.log(e.key)

          return handleKeyDown(e)
        }}
        onFocus={(e) => console.log(e)}
      >
        {(() => {
          let globalIndex = 0 // contador global de caracteres (incluye espacios)
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
              {/* añadir el espacio entre palabras (salvo la última) */}
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
