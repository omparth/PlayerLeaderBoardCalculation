export interface Player {
  id: number
  name: string
}

export interface Event {
  playerId: number
  action: string
}

export interface PlayerScore extends Player {
  score: number
}

const SCORE_MAP: Record<string, number> = {
  TAKE_WICKET: 20,
  "50_RUNS_MILESTONE": 15,
  HIT_SIX: 2,
  HIT_FOUR: 1,
}

export function calculateMVPScores(players: Player[], events: Event[]): PlayerScore[] {
  const scoreMap = new Map<number, number>()

  players.forEach((player) => {
    scoreMap.set(player.id, 0)
  })

  events.forEach((event) => {
    const points = SCORE_MAP[event.action] || 0
    const currentScore = scoreMap.get(event.playerId) || 0
    scoreMap.set(event.playerId, currentScore + points)
  })

  const playerScores = players.map((player) => ({
    ...player,
    score: scoreMap.get(player.id) || 0,
  }))

  return playerScores.sort((a, b) => b.score - a.score)
}

export function filterTopPerformers(playerScores: PlayerScore[]): PlayerScore[] {
  return playerScores.filter((player) => player.score >= 20)
}
