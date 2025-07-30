"use client"

interface EventCardProps {
  id: string
  title: string
  description: string
  options: Array<{
    id: string
    label: string
    effect: string
  }>
  selectedOption?: string
  onOptionSelect: (option: string) => void
}

export default function EventCard({ title, description, options, selectedOption, onOptionSelect }: EventCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionSelect(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
              selectedOption === option.id
                ? "border-red-600 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-black mb-1">{option.label}</div>
            <div className="text-sm text-gray-500">{option.effect}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
