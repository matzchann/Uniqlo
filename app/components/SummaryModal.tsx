"use client"

interface SummaryModalProps {
  summary: any
  onClose: () => void
}

export default function SummaryModal({ summary, onClose }: SummaryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-black mb-4">Week {summary.week} Summary</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Your Choices:</h3>
            <p>
              <strong>Focus:</strong> {summary.focus}
            </p>
            {Object.entries(summary.choices).map(([key, value]) => (
              <p key={key}>
                <strong>{key.replace("-", " ")}:</strong> {String(value).replace("-", " ")}
              </p>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">KPI Changes:</h3>
            {Object.entries(summary.kpiChanges).map(([key, value]) => (
              <p key={key} className={Number(value) >= 0 ? "text-green-600" : "text-red-600"}>
                {key}: {Number(value) >= 0 ? "+" : ""}
                {Number(value).toFixed(1)}
              </p>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Value Changes:</h3>
            {Object.entries(summary.valueChanges).map(([key, value]) => (
              <p key={key} className={Number(value) >= 0 ? "text-green-600" : "text-red-600"}>
                {key}: {Number(value) >= 0 ? "+" : ""}
                {Number(value)}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
