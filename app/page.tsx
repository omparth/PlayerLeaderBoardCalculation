// app/page.tsx

import Leaderboard from "@/components/leaderboard"
import type { Player, Event } from "@/lib/calculate-mvp"
import { promises as fs } from "fs"
import path from "path"

async function fetchData() {
  try {
    const publicDir = path.join(process.cwd(), "public")
    const playersJson = await fs.readFile(path.join(publicDir, "players.json"), "utf8")
    const eventsJson = await fs.readFile(path.join(publicDir, "events.json"), "utf8")

    const players: Player[] = JSON.parse(playersJson)
    const events: Event[] = JSON.parse(eventsJson)

    return { players, events }
  } catch (error) {
    // more descriptive log
    console.error("Error fetching (reading) data from public/*.json:", error)
    return { players: [], events: [] }
  }
}

export default async function Home() {
  const { players, events } = await fetchData()

  return (
    <main className="min-h-screen bg-background py-12">
      <Leaderboard players={players} events={events} />
    </main>
  )
}
