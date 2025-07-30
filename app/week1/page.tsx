"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import KPIBar from "../components/KPIBar"
import EventCard from "../components/EventCard"
import TelemetryPanel from "../components/TelemetryPanel"
import SummaryModal from "../components/SummaryModal"
import type { GameState, Event, KPIDeltas, ValueDeltas } from "../types/game"
import { initializeGameState, saveGameState, loadGameState } from "../utils/gameState"

export default function Week1() {
  const [gameState, setGameState] = useState<GameState>(initializeGameState())
  const [selectedFocus, setSelectedFocus] = useState<string>("")
  const [eventAnswers, setEventAnswers] = useState<Record<string, string>>({})
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

  const handleFocusSelect = (focus: string) => {
    setSelectedFocus(focus)
    const newKPIs = { ...gameState.kpis }

    // Reset preview
    setPreviewKPIs(gameState.kpis)

    // Apply focus preview
    if (focus === "CONVERSION") newKPIs.conversion = Math.min(100, gameState.kpis.conversion + 2)
    if (focus === "NPS") newKPIs.nps = Math.min(100, gameState.kpis.nps + 2)
    if (focus === "SUSTAINABILITY") newKPIs.sustainability = Math.min(100, gameState.kpis.sustainability + 2)

    setPreviewKPIs(newKPIs)
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

    events.push({
      id: `focus-${Date.now()}`,
      type: "focus",
      week: 1,
      timestamp: Date.now(),
      choice: selectedFocus,
      kpisBefore: { ...gameState.kpis },
      kpisAfter: { ...gameState.kpis },
      valuesBefore: { ...gameState.values },
      valuesAfter: { ...gameState.values },
    })

    // Apply event answers
    Object.entries(eventAnswers).forEach(([eventId, option]) => {
      const eventBefore = { ...gameState.kpis }

      if (eventId === "meet-greet") {
        if (option === "huddle") {
          kpiDeltas.nps += 1
          kpiDeltas.conversion += 0.5
        } else if (option === "one-on-one") {
          kpiDeltas.nps += 1.5
        }
      }

      if (eventId === "late-truck") {
        if (option === "partial") {
          kpiDeltas.conversion += 1
          kpiDeltas.margin -= 0.2
        } else if (option === "wait") {
          kpiDeltas.conversion -= 0.5
          kpiDeltas.margin += 0.3
        }
      }

      if (eventId === "values-dilemma") {
        if (option === "policy") {
          valueDeltas.truth += 1
          kpiDeltas.nps -= 1
        } else if (option === "refund") {
          valueDeltas.goodness += 1
          kpiDeltas.nps += 1
          kpiDeltas.margin -= 0.5
        } else if (option === "credit") {
          valueDeltas.beauty += 1
          kpiDeltas.nps -= 0.3
          kpiDeltas.margin -= 0.2
        }
      }

      events.push({
        id: `${eventId}-${Date.now()}`,
        type: eventId,
        week: 1,
        timestamp: Date.now(),
        choice: option,
        kpisBefore: eventBefore,
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
      currentWeek: 1,
    }

    setGameState(newGameState)
    saveGameState(newGameState)

    // Show summary
    setWeekSummary({
      week: 1,
      focus: selectedFocus,
      choices: eventAnswers,
      kpiChanges: kpiDeltas,
      valueChanges: valueDeltas,
      finalKPIs: newKPIs,
      finalValues: newValues,
    })
    setShowSummary(true)
  }

  const eventCards = [
    {
      id: "meet-greet",
      title: "Meet-and-Greet with Team",
      description: "Choose your kickoff style.",
      options: [
        { id: "huddle", label: "30-min All-hands Huddle", effect: "+NPS, +Conversion (minor)" },
        { id: "one-on-one", label: "1-on-1 Speed Chats", effect: "+NPS (strong)" },
      ],
    },
    {
      id: "late-truck",
      title: "Late Truck Arrival",
      description: "Only 60% of stock is on time.",
      options: [
        { id: "partial", label: "Accept Partial Delivery", effect: "+Conversion, −Margin" },
        { id: "wait", label: "Wait for Full Stock", effect: "−Conversion (minor), +Margin" },
      ],
    },
    {
      id: "values-dilemma",
      title: "A Customer Returns a Worn HEATTECH",
      description:
        "A customer asks for a refund on a clearly worn HEATTECH shirt. Store policy says no, but she says it was uncomfortable and threatens a bad review.",
      options: [
        { id: "policy", label: "Follow Policy Firmly", effect: "+Truth, −NPS" },
        { id: "refund", label: "Make Exception, Refund Anyway", effect: "+Goodness, −Margin, +NPS" },
        { id: "credit", label: "Offer Store Credit Only", effect: "+Beauty, −NPS (minor), −Margin (minor)" },
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
              <h1 className="text-3xl font-bold text-black mb-2">Week 1 — First Shift: Get the Keys</h1>
              <p className="text-gray-600 mb-8">Build trust & learn the dashboard</p>

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
                  End Week 1
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
