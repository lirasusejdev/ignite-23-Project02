import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmoutInput,
  StopCountdownButton
} from './styles'
import { differenceInSeconds } from 'date-fns'
import internal from 'stream'
import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'
/**
 *
 * function register(name: string){
 * return {
 * retorna métodos para trabalhar com inputs no javascript, exemplos (monitorar os valores dos inputs):
 * onChange: () => void,
 * onBlur: () => void,
 * onFocus: () => void,
 *
 * }
 * }
 */

const newCycleFormValidationsSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser no mínimo de 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo de 60 minutos')
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationsSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  isActive: boolean
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationsSchema),

    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const activeCycle = cycles.find(cycle => cycle.id == activeCycleId)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        )
        // proposta de ciclo completo >> porem nao funciona a contagem
        // const secondsDifference = differenceInSeconds(
        //   new Date(),
        //   activeCycle.startDate
        // )
        // if (secondsDifference >= totalSeconds) {
        //   setCycles(state =>
        //     state.map(cycle => {
        //       if (cycle.id === activeCycleId) {
        //         return { ...cycle, finishedDate: new Date() }
        //       } else {
        //         return cycle
        //       }
        //     })
        //   )
        //   clearInterval(interval)
        // } else {
        //   setAmountSecondsPassed(secondsDifference)
        // }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles(state => [...state, newCycle]),
      setActiveCycleId(id),
      setAmoundSecondsPassed(0),
      reset()
  }

  function handleInterruptCycle() {
    setCycles(state =>
      state.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  console.log(activeCycle)

  const task = watch('task')
  const isSubmitDisabled = !task

  console.log(cycles)

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <CountDown />
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
