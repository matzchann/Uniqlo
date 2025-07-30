import type { GameState } from "../types/game"

export function initializeGameState(): GameState {
  return {
    kpis: {
      conversion: 42,
      nps: 55,
      sustainability: 63,
      margin: 50,
    },
    values: {
      truth: 0,
      goodness: 0,
      beauty: 0,
    },
    events: [],
    currentWeek: 0,
  }
}

export function saveGameState(gameState: GameState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("uniqlo-game-state", JSON.stringify(gameState))
  }
}

export function loadGameState(): GameState | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("uniqlo-game-state")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error loading game state:", error)
        return null
      }
    }
  }
  return null
}
