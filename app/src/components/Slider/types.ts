import { ReactNode } from "react"

export type Title = {
  index: number
  shortTitle?: ReactNode
  title: ReactNode
}

export interface SliderProps {
  titles: Title[]
  children: ReactNode
  onCancel?: () => void
  onComplete: () => void
}
