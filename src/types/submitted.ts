import { Protocol } from './protocols'

interface SubmittedRecordUiLabels {
  protocol: Protocol
  site: string
  management: string
  size: string
  depth: string
  sampleDate: string
  observers: string
  sampleUnitNumber: number
}

export interface SubmittedRecordForUiDisplay {
  id: string | number
  protocol: Protocol
  uiLabels: SubmittedRecordUiLabels
}
