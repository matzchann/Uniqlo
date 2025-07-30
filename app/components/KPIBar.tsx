import type { KPIs, Values } from "../types/game"

interface KPIBarProps {
  kpis: KPIs
  values?: Values
}

export default function KPIBar({ kpis, values }: KPIBarProps) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* KPI Bars */}
          {Object.entries(kpis).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                <span className="text-sm font-bold text-black">{value.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                ></div>
              </div>
            </div>
          ))}

          {/* Value Scores */}
          {values &&
            Object.entries(values).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <span className="text-sm font-bold text-black">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, (value + 5) * 10))}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
