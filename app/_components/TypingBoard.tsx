"use client"
import { KeyboardEventHandler, useState } from "react"

interface TypingBoardProps {
  words: string[]
}
const TypingBoard = ({ words }: TypingBoardProps) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [letterError, setLetterError] = useState(false)
  
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    const allChars = words.join("").split("")
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
      // Incorrect key pressed
      // You can add some feedback for incorrect key press here if needed
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
        {currentCharIndex}/{words.join("").length}
      </p>
      <div
        className="text-gray-200 text-2xl font-medium leading-relaxed ring-0 outline-none focus:ring-0 focus:outline-none"
        tabIndex={0}
        onKeyDown={(e) => {
          console.log(e.key)

          return handleKeyDown(e)
        }}
      >
        {words.map((word: string) => (
          <div key={crypto.randomUUID()} className="inline-block mr-2 mb-2">
            {word.split("").map((char: string, index: number) => {
              const charGlobalIndex =
                index + words.slice(0, words.indexOf(word)).join("").length
              const isCurrent = charGlobalIndex === currentCharIndex

              return (
                <span
                  key={crypto.randomUUID()}
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
          </div>
        ))}
      </div>
    </div>
  )
}
export default TypingBoard
// ...existing code...