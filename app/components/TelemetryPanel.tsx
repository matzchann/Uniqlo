import type { GameState } from "../types/game"

interface TelemetryPanelProps {
  gameState: GameState
}

export default function TelemetryPanel({ gameState }: TelemetryPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-black mb-4">Telemetry Panel</h3>
      <div className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-96">
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      </div>
    </div>
  )
}
