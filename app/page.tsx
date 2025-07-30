"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [hasGameData, setHasGameData] = useState(false)

  useEffect(() => {
    const gameState = localStorage.getItem("uniqlo-game-state")
    setHasGameData(!!gameState)
  }, [])

  const resetGame = () => {
    localStorage.removeItem("uniqlo-game-state")
    setHasGameData(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">UNIQLO UMC Simulation</h1>
          <p className="text-gray-600 text-lg">Management Challenge Simulation Game</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Game Progress</h2>

            <div className="space-y-4">
              <Link
                href="/week1"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Week 1: First Shift - Get the Keys
              </Link>

              <Link
                href="/week5"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Week 5: Peak Season Forecast
              </Link>

              <Link
                href="/dashboard"
                className="block w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Data Dashboard
              </Link>
            </div>

            {hasGameData && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={resetGame}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Reset Game Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
