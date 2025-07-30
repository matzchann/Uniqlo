"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import type { GameState } from "../types/game"
import { loadGameState } from "../utils/gameState"

export default function Dashboard() {
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    const loaded = loadGameState()
    if (loaded) {
      setGameState(loaded)
    }
  }, [])

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Data Dashboard</h1>
            <p className="text-gray-600">No game data found. Please play some weeks first.</p>
          </div>
        </div>
      </div>
    )
  }

  const getValuePriority = () => {
    const values = gameState.values
    const max = Math.max(values.truth, values.goodness, values.beauty)
    if (values.truth === max) return "Truth"
    if (values.goodness === max) return "Goodness"
    return "Beauty"
  }

  const getValueDistribution = () => {
    const total = gameState.values.truth + gameState.values.goodness + gameState.values.beauty
    if (total === 0) return { truth: 33, goodness: 33, beauty: 34 }

    return {
      truth: Math.round((gameState.values.truth / total) * 100),
      goodness: Math.round((gameState.values.goodness / total) * 100),
      beauty: Math.round((gameState.values.beauty / total) * 100),
    }
  }

  const distribution = getValueDistribution()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Data Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current KPI Values */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Current KPI Values</h2>
            <div className="space-y-4">
              {Object.entries(gameState.kpis).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${value}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Value Scores */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Value Scores</h2>
            <div className="space-y-4">
              {Object.entries(gameState.values).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{key}</span>
                  <span className="text-lg font-bold">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Value Distribution</h3>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${distribution.truth}%` }}
                  title={`Truth: ${distribution.truth}%`}
                ></div>
                <div
                  className="bg-green-500"
                  style={{ width: `${distribution.goodness}%` }}
                  title={`Goodness: ${distribution.goodness}%`}
                ></div>
                <div
                  className="bg-purple-500"
                  style={{ width: `${distribution.beauty}%` }}
                  title={`Beauty: ${distribution.beauty}%`}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Truth ({distribution.truth}%)</span>
                <span>Goodness ({distribution.goodness}%)</span>
                <span>Beauty ({distribution.beauty}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Primary Value</h3>
              <p className="text-2xl font-bold text-red-600">{getValuePriority()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Decisions Made</h3>
              <p className="text-2xl font-bold text-red-600">{gameState.events.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Current Week</h3>
              <p className="text-2xl font-bold text-red-600">{gameState.currentWeek}</p>
            </div>
          </div>
        </div>

        {/* Decision History */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Decision History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Week</th>
                  <th className="text-left py-2">Event Type</th>
                  <th className="text-left py-2">Choice</th>
                  <th className="text-left py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {gameState.events.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="py-2">{event.week}</td>
                    <td className="py-2 capitalize">{event.type.replace("-", " ")}</td>
                    <td className="py-2 capitalize">{event.choice.replace("-", " ")}</td>
                    <td className="py-2">{new Date(event.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Event Log */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Session Event Log (JSON)</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-xs">{JSON.stringify(gameState, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
