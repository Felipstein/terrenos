export type UploadStatus = 'uploading' | 'done' | 'error'

export type ImageUpload = {
  id: string
  name: string
  previewUrl: string
  status: UploadStatus
  progress: number
  url?: string
}
