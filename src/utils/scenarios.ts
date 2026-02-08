export type ScenarioState = {
  numChildren: number
  useStudentsByYear: boolean
  numChildrenYear1: number
  numChildrenYear2: number
  numChildrenYear3: number
  feePerTerm: number
  useFeePerTermByYear: boolean
  feePerTermYear1: number
  feePerTermYear2: number
  feePerTermYear3: number
  useFeeIncreaseByYear: boolean
  feeIncrease: number
  feeIncreaseYear1: number
  feeIncreaseYear2: number
  feeIncreaseYear3: number
  usePayIncreaseByYear: boolean
  payIncrease: number
  payIncreaseYear1: number
  payIncreaseYear2: number
  payIncreaseYear3: number
  currentSurplus: number
  numStaffChildren: number
  otherChildrenDiscount: number
  staffCostShare: number
  useDetailedStaffCosts: boolean
  useStaffByYear: boolean
  avgAnnualSalary: number
  avgAnnualSalaryYear1: number
  avgAnnualSalaryYear2: number
  avgAnnualSalaryYear3: number
  numTeachers: number
  numTeachersYear1: number
  numTeachersYear2: number
  numTeachersYear3: number
  avgSupportSalary: number
  avgSupportSalaryYear1: number
  avgSupportSalaryYear2: number
  avgSupportSalaryYear3: number
  numSupportStaff: number
  numSupportYear1: number
  numSupportYear2: number
  numSupportYear3: number
  inflationYear1: number
  inflationYear2: number
  inflationYear3: number
}

export type Scenario = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  version: number
  state: ScenarioState
}

const STORAGE_KEY = 'school-financial-analysis:scenarios'
const CURRENT_VERSION = 1

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const loadScenarios = (): Scenario[] => {
  if (typeof window === 'undefined') {
    return []
  }

  return safeJsonParse<Scenario[]>(window.localStorage.getItem(STORAGE_KEY), [])
    .filter((scenario) => scenario && scenario.state && scenario.version === CURRENT_VERSION)
}

export const saveScenarios = (scenarios: Scenario[]) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
}

export const createScenarioId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `scenario_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export const createScenario = (name: string, state: ScenarioState): Scenario => {
  const now = new Date().toISOString()

  return {
    id: createScenarioId(),
    name,
    createdAt: now,
    updatedAt: now,
    version: CURRENT_VERSION,
    state,
  }
}
