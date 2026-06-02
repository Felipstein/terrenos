import { chromium } from 'playwright'

const URL = process.env.URL || 'http://localhost:5173/'
const USER = process.env.SMOKE_USER || 'admin'
const PASS = process.env.SMOKE_PASS || 'admin'

// PNG 1x1 em memória pra simular um arquivo de imagem.
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await context.newPage()

const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message))

const result = {}
try {
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#username', { timeout: 10000 })
  await page.fill('#username', USER)
  await page.fill('#password', PASS)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForSelector('table', { timeout: 8000 })
  result.loggedIn = true

  // CADASTRO com FOTO
  await page.getByRole('button', { name: '+ Novo' }).click()
  await page.waitForSelector('text=Novo terreno')
  await page.setInputFiles('#fotos-input', { name: 'foto.png', mimeType: 'image/png', buffer: png })
  // done => aparece o botão de principal
  await page.waitForSelector('button[aria-label="Definir como principal"]', { timeout: 8000 })
  result.uploadDone = true
  await page.locator('button[aria-label="Definir como principal"]').first().click()
  result.principalSet = await page.getByText('Principal', { exact: true }).first().isVisible()

  await page.fill('#rua', 'Rua com Foto, 1')
  await page.fill('#preco', '300000')
  await page.fill('#largura', '10')
  await page.fill('#comprimento', '20')
  await page.getByRole('button', { name: 'Salvar terreno' }).click()
  await page.waitForSelector('text=R$ 300.000', { timeout: 5000 })
  result.galeriaNoDetalhe = (await page.locator('[role="dialog"] img').count()) > 0
  result.created = true

  // CASO DE ERRO: arquivo com "fail" no nome
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: '+ Novo' }).click()
  await page.waitForSelector('text=Novo terreno')
  await page.setInputFiles('#fotos-input', { name: 'fail.png', mimeType: 'image/png', buffer: png })
  await page.waitForSelector('text=Tentar de novo', { timeout: 8000 })
  result.erroUpload = true
} catch (err) {
  result.error = String(err)
}

const googleNoise = /google|maps|gstatic|MapError|InvalidKey|billing|ApiNotActivated|RefererNotAllowed/i
result.appErrors = consoleErrors.filter((e) => !googleNoise.test(e))

console.log(JSON.stringify(result, null, 2))
await browser.close()
