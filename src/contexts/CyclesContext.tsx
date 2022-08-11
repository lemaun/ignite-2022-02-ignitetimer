import { createContext, ReactNode, useState } from "react";

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  CreateNewCycle: (data: CreateCycleData) => void
  InterruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}


export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles(
      state => state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      })
    )
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function CreateNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle:Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles(state => [...cycles, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }



  function InterruptCurrentCycle() {
    setCycles(
      state => state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      })
    )

    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider value={
      {
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed, 
        setSecondsPassed, 
        InterruptCurrentCycle, 
        CreateNewCycle,
        cycles
      }
    }>
      {children}
    </CyclesContext.Provider>
  )
}