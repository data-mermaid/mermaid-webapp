export interface ObservationRecord {
  id: string
  count?: number | null
  size?: number | string | null
  invert_attribute?: string | null
  notes?: string | null
  include?: boolean
}
