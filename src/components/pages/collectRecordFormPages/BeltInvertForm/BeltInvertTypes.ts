export interface ObservationRecord {
  id: string
  count?: number | null
  size?: number | null
  invert_attribute?: string | null
  notes?: string | null
  include?: boolean
}
