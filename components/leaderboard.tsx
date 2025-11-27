"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  calculateMVPScores,
  filterTopPerformers,
  type Player,
  type Event,
  type PlayerScore,
} from "@/lib/calculate-mvp"

interface LeaderboardProps {
  players: Player[]
  events: Event[]
}

export default function Leaderboard({ players, events }: LeaderboardProps) {
  const [allScores, setAllScores] = useState<PlayerScore[]>([])
  const [displayedScores, setDisplayedScores] = useState<PlayerScore[]>([])
  const [isFiltered, setIsFiltered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const scores = calculateMVPScores(players, events)
    setAllScores(scores)
    setDisplayedScores(scores)
    setIsLoading(false)
  }, [players, events])

  const topCount = useMemo(() => filterTopPerformers(allScores).length, [allScores])

  const handleToggleFilter = () => {
    if (isFiltered) {
      setDisplayedScores(allScores)
      setIsFiltered(false)
    } else {
      const topPerformers = filterTopPerformers(allScores)
      setDisplayedScores(topPerformers)
      setIsFiltered(true)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4">

      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/background.png')`,
          filter: "brightness(0.8) contrast(1.1)"
        }}
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-20 w-full max-w-3xl mx-auto">
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl overflow-hidden">

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
                  MVP Leaderboard
                </h1>
                <p className="mt-1 text-sm md:text-base text-white/80">
                  Player rankings based on match performance
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end">
                <div className="text-sm text-white/70">Total players</div>
                <div className="mt-1 text-2xl font-bold text-white">{allScores.length}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <Button
                type="button"
                onClick={handleToggleFilter}
                variant={isFiltered ? "default" : "outline"}
                className="col-span-1 md:col-span-2 w-full"
                aria-pressed={isFiltered}
              >
                {isFiltered ? "Showing Top Performers (20+ points)" : "Toggle Top Performers"}
              </Button>

              <p className="text-sm text-white/80 text-center md:text-right">
                Showing <span className="font-semibold text-white">{displayedScores.length}</span> of{" "}
                <span className="font-semibold text-white">{allScores.length}</span>
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {displayedScores.length > 0 ? (
              displayedScores.map((player, index) => {
                const rank = index + 1
                const isTopThree = rank <= 3

                return (
                  <Card
                    key={player.id}
                    className={`p-4 md:p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex justify-between items-center shadow-md ${
                      isTopThree ? "border-l-4 border-yellow-400" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isTopThree ? "bg-yellow-400 text-black" : "bg-white/20 text-white"
                        }`}
                      >
                        {rank}
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-white">{player.name}</p>
                        <p className="text-sm text-white/60">ID: {player.id}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-white">{player.score}</p>
                      <p className="text-xs text-white/60">MVP Points</p>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="p-8 text-center bg-white/10 text-white/70">
                No players found matching the criteria.
              </Card>
            )}
          </div>

          {isFiltered && (
            <div className="p-4 md:p-5 bg-white/10 border-t border-white/20 text-sm text-white/80">
              Showing {displayedScores.length} of {allScores.length} players with 20+ points — top{" "}
              <span className="font-semibold text-white">{topCount}</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
