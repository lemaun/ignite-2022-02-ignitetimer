import { HandPalm, Play } from "phosphor-react"

import { 
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton, 
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import { FormProvider, useForm } from "react-hook-form"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CyclesContext } from "../../contexts/CyclesContext";
import { useContext } from "react";



const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5, 'O ciclo precisa ser no mínimo 5 minutos.').max(60, 'O ciclo precisa ser no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> //infere os tipos extraindo das configurações do objeto zod

export function Home() {

  const {activeCycle, CreateNewCycle, InterruptCurrentCycle } = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    CreateNewCycle(data)
    reset()
  }
  
  const task = watch('task')
  const isSubmitDisabled = !task  

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle 
        ?
          <StopCountdownButton onClick={InterruptCurrentCycle} type="button">
            <HandPalm size={24}/>
            Interromper
          </StopCountdownButton> 
        : 
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24}/>
            Começar
          </StartCountdownButton>
        }
        
      </form>
    </HomeContainer>
  )
}