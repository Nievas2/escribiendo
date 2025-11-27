"client"

import words from "../public/words.json"
import TypingBoard from "./_components/TypingBoard"

export default function Home() {


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <TypingBoard words={(words as string[]).sort(() => Math.random() - 0.5).slice(0, 50)} />
      </main>
    </div>
  )
}
