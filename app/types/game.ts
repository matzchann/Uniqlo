export interface KPIs {
  conversion: number
  nps: number
  sustainability: number
  margin: number
}

export interface Values {
  truth: number
  goodness: number
  beauty: number
}

export interface KPIDeltas {
  conversion: number
  nps: number
  sustainability: number
  margin: number
}

export interface ValueDeltas {
  truth: number
  goodness: number
  beauty: number
}

export interface Event {
  id: string
  type: string
  week: number
  timestamp: number
  choice: string
  kpisBefore: KPIs
  kpisAfter: KPIs
  valuesBefore: Values
  valuesAfter: Values
}

export interface GameState {
  kpis: KPIs
  values: Values
  events: Event[]
  currentWeek: number
}
