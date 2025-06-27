import { ImageClassificationPoint } from '../App/mermaidData/mermaidDataTypes'

export interface ImageClassificationImage {
  id: string
  updated_by: string
  classification_status: {
    id: string
    image: string
    status: number
    message: string | null
  }
  patch_size: number
  num_confirmed: number
  num_unconfirmed: number
  num_unclassified: number
  points: ImageClassificationPoint[]
  created_on: string
  updated_on: string
  collect_record_id: string
  image: string
  thumbnail: string
  name: string
  original_image_name: string
  original_image_width: number
  original_image_height: number
  photo_timestamp: string | null
  location: string | null
  comments: string | null
  data: Record<string, unknown>
}
