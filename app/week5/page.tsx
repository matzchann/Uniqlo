"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import KPIBar from "../components/KPIBar"
import EventCard from "../components/EventCard"
import TelemetryPanel from "../components/TelemetryPanel"
import SummaryModal from "../components/SummaryModal"
import type { GameState, Event, KPIDeltas, ValueDeltas } from "../types/game"
import { initializeGameState, saveGameState, loadGameState } from "../utils/gameState"

export default function Week5() {
  const [gameState, setGameState] = useState<GameState>(initializeGameState())
  const [selectedFocus, setSelectedFocus] = useState<string>("")
  const [eventAnswers, setEventAnswers] = useState<Record<string, string>>({})
  const [orderQuantity, setOrderQuantity] = useState(600)
  const [deliveryMode, setDeliveryMode] = useState<"sea" | "air">("sea")
  const [previewKPIs, setPreviewKPIs] = useState(gameState.kpis)
  const [showSummary, setShowSummary] = useState(false)
  const [weekSummary, setWeekSummary] = useState<any>(null)

  useEffect(() => {
    const loaded = loadGameState()
    if (loaded) {
      setGameState(loaded)
      setPreviewKPIs(loaded.kpis)
    }
  }, [])

  useEffect(() => {
    updatePreview()
  }, [selectedFocus, orderQuantity, deliveryMode, gameState.kpis])

  const updatePreview = () => {
    const newKPIs = { ...gameState.kpis }

    // Apply focus preview
    if (selectedFocus === "CONVERSION") newKPIs.conversion = Math.min(100, gameState.kpis.conversion + 2)
    if (selectedFocus === "NPS") newKPIs.nps = Math.min(100, gameState.kpis.nps + 2)
    if (selectedFocus === "SUSTAINABILITY") newKPIs.sustainability = Math.min(100, gameState.kpis.sustainability + 2)

    // Apply bulk order effects
    if (orderQuantity > 600) {
      const surplus = orderQuantity - 600
      newKPIs.margin = Math.max(0, newKPIs.margin - Math.min(0.8, surplus / 1000))
    } else if (orderQuantity < 600) {
      const shortfall = 600 - orderQuantity
      newKPIs.conversion = Math.max(0, newKPIs.conversion - Math.min(2, shortfall / 200))
    }

    // Apply delivery mode effects
    if (deliveryMode === "sea") {
      newKPIs.margin = Math.min(100, newKPIs.margin + 0.2)
      newKPIs.sustainability = Math.min(100, newKPIs.sustainability + 0.8)
    } else {
      newKPIs.margin = Math.max(0, newKPIs.margin - 0.8)
      newKPIs.conversion = Math.min(100, newKPIs.conversion + 0.6)
    }

    setPreviewKPIs(newKPIs)
  }

  const handleFocusSelect = (focus: string) => {
    setSelectedFocus(focus)
  }

  const handleEventAnswer = (eventId: string, option: string) => {
    setEventAnswers((prev) => ({ ...prev, [eventId]: option }))
  }

  const canEndWeek = () => {
    return selectedFocus && Object.keys(eventAnswers).length === 3
  }

  const endWeek = () => {
    const kpiDeltas: KPIDeltas = { conversion: 0, nps: 0, sustainability: 0, margin: 0 }
    const valueDeltas: ValueDeltas = { truth: 0, goodness: 0, beauty: 0 }
    const events: Event[] = []

    // Apply focus
    if (selectedFocus === "CONVERSION") kpiDeltas.conversion += 2
    if (selectedFocus === "NPS") kpiDeltas.nps += 2
    if (selectedFocus === "SUSTAINABILITY") kpiDeltas.sustainability += 2

    // Apply bulk order effects
    if (orderQuantity > 600) {
      const surplus = orderQuantity - 600
      kpiDeltas.margin -= Math.min(0.8, surplus / 1000)
    } else if (orderQuantity < 600) {
      const shortfall = 600 - orderQuantity
      kpiDeltas.conversion -= Math.min(2, shortfall / 200)
    }

    // Apply delivery mode effects
    if (deliveryMode === "sea") {
      kpiDeltas.margin += 0.2
      kpiDeltas.sustainability += 0.8
    } else {
      kpiDeltas.margin -= 0.8
      kpiDeltas.conversion += 0.6
    }

    events.push({
      id: `focus-${Date.now()}`,
      type: "focus",
      week: 5,
      timestamp: Date.now(),
      choice: selectedFocus,
      kpisBefore: { ...gameState.kpis },
      kpisAfter: { ...gameState.kpis },
      valuesBefore: { ...gameState.values },
      valuesAfter: { ...gameState.values },
    })

    // Apply event answers
    Object.entries(eventAnswers).forEach(([eventId, option]) => {
      if (eventId === "supplier-delay") {
        if (option === "air-freight") {
          kpiDeltas.margin -= 0.7
          kpiDeltas.conversion += 0.8
        } else if (option === "risk-stockout") {
          kpiDeltas.margin += 0.2
          kpiDeltas.conversion -= 0.8
        }
      }

      if (eventId === "staff-vacation") {
        if (option === "deny") {
          kpiDeltas.nps -= 0.5
          kpiDeltas.margin += 0.2
        } else if (option === "close-bay") {
          kpiDeltas.conversion -= 0.5
          kpiDeltas.nps += 0.5
        }
      }

      if (eventId === "sustainability-dilemma") {
        if (option === "ship-air") {
          kpiDeltas.conversion += 1.2
          kpiDeltas.sustainability -= 1
          valueDeltas.truth += 1
        } else if (option === "split-ship") {
          kpiDeltas.conversion += 0.6
          kpiDeltas.sustainability -= 0.5
          kpiDeltas.margin -= 0.2
          valueDeltas.beauty += 1
        } else if (option === "wait-sea") {
          kpiDeltas.conversion -= 1
          kpiDeltas.sustainability += 1
          valueDeltas.goodness += 1
        }
      }

      events.push({
        id: `${eventId}-${Date.now()}`,
        type: eventId,
        week: 5,
        timestamp: Date.now(),
        choice: option,
        kpisBefore: { ...gameState.kpis },
        kpisAfter: { ...gameState.kpis },
        valuesBefore: { ...gameState.values },
        valuesAfter: { ...gameState.values },
      })
    })

    // Apply all deltas
    const newKPIs = {
      conversion: Math.max(0, Math.min(100, gameState.kpis.conversion + kpiDeltas.conversion)),
      nps: Math.max(0, Math.min(100, gameState.kpis.nps + kpiDeltas.nps)),
      sustainability: Math.max(0, Math.min(100, gameState.kpis.sustainability + kpiDeltas.sustainability)),
      margin: Math.max(0, Math.min(100, gameState.kpis.margin + kpiDeltas.margin)),
    }

    const newValues = {
      truth: gameState.values.truth + valueDeltas.truth,
      goodness: gameState.values.goodness + valueDeltas.goodness,
      beauty: gameState.values.beauty + valueDeltas.beauty,
    }

    const newGameState = {
      ...gameState,
      kpis: newKPIs,
      values: newValues,
      events: [...gameState.events, ...events],
      currentWeek: 5,
    }

    setGameState(newGameState)
    saveGameState(newGameState)

    // Show summary
    setWeekSummary({
      week: 5,
      focus: selectedFocus,
      choices: { ...eventAnswers, orderQuantity, deliveryMode },
      kpiChanges: kpiDeltas,
      valueChanges: valueDeltas,
      finalKPIs: newKPIs,
      finalValues: newValues,
    })
    setShowSummary(true)
  }

  const eventCards = [
    {
      id: "supplier-delay",
      title: "Supplier Delay Warning",
      description: "Bulk shipment may be delayed.",
      options: [
        { id: "air-freight", label: "Pay Air-Freight Premium", effect: "−Margin, +Conversion" },
        { id: "risk-stockout", label: "Risk Stock-Out", effect: "+Margin, −Conversion" },
      ],
    },
    {
      id: "staff-vacation",
      title: "Staff Vacation Clash",
      description: "Several key staff request leave at once.",
      options: [
        { id: "deny", label: "Deny Requests", effect: "−NPS, +Margin" },
        { id: "close-bay", label: "Close One Fitting Room Bay", effect: "−Conversion, +NPS" },
      ],
    },
    {
      id: "sustainability-dilemma",
      title: "Sustainability vs. Speed Dilemma",
      description:
        "A last-minute influencer campaign causes a run on AIRism stock. Air shipping can meet demand, but increases CO₂ footprint and costs. How do you respond?",
      options: [
        { id: "ship-air", label: "Ship by Air to Meet All Demand", effect: "+Conversion, −Sustainability, +Truth" },
        {
          id: "split-ship",
          label: "Split Ship: Air for Top Stores, Sea for Rest",
          effect: "+Beauty, −Margin (minor), −Sustainability (minor), +Conversion (minor)",
        },
        {
          id: "wait-sea",
          label: "Wait for Sea Freight, Accept Stockouts",
          effect: "+Sustainability, −Conversion, +Goodness",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <KPIBar kpis={previewKPIs} values={gameState.values} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Week 5 — Peak Season Forecast</h1>
              <p className="text-gray-600 mb-8">Inventory, risk & empathy trade-offs</p>

              {/* Bulk Buy Order Panel */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-black mb-4">Bulk Buy Order Panel</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Quantity: {orderQuantity}
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="900"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>300</span>
                    <span>600 (default)</span>
                    <span>900</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Mode</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDeliveryMode("sea")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        deliveryMode === "sea" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Sea (Eco, Slow)
                    </button>
                    <button
                      onClick={() => setDeliveryMode("air")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        deliveryMode === "air" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Air (Fast, Costly)
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Projected Effects:</strong>
                  </p>
                  <p>Quantity: {orderQuantity > 600 ? "−Margin" : orderQuantity < 600 ? "−Conversion" : "Neutral"}</p>
                  <p>Delivery: {deliveryMode === "sea" ? "+Margin, +Sustainability" : "−Margin, +Conversion"}</p>
                </div>
              </div>

              {/* Weekly Focus */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-black mb-4">Focus this week</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["CONVERSION", "NPS", "SUSTAINABILITY"].map((focus) => (
                    <button
                      key={focus}
                      onClick={() => handleFocusSelect(focus)}
                      className={`p-4 rounded-lg font-semibold transition-colors ${
                        selectedFocus === focus ? "bg-red-600 text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Cards */}
              <div className="space-y-6">
                {eventCards.map((card) => (
                  <EventCard
                    key={card.id}
                    {...card}
                    selectedOption={eventAnswers[card.id]}
                    onOptionSelect={(option) => handleEventAnswer(card.id, option)}
                  />
                ))}
              </div>

              {/* End Week Button */}
              <div className="mt-8">
                <button
                  onClick={endWeek}
                  disabled={!canEndWeek()}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                    canEndWeek()
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  End Week 5
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <TelemetryPanel gameState={gameState} />
          </div>
        </div>
      </div>

      {showSummary && weekSummary && <SummaryModal summary={weekSummary} onClose={() => setShowSummary(false)} />}
    </div>
  )
}
