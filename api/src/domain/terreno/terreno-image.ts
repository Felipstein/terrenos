/**
 * Imagem de um terreno. Value object: `id` é gerado pelo storage no momento do
 * upload (presigned POST) e `url` é a URL pública final do objeto no S3.
 */
export type TerrenoImage = {
  id: string
  url: string
}
