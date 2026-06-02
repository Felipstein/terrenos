import { chromium } from 'playwright'

const URL = process.env.URL || 'http://localhost:5173/'
const USER = process.env.SMOKE_USER || 'admin'
const PASS = process.env.SMOKE_PASS || 'admin'

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

  // 1) Login
  await page.waitForSelector('#username', { timeout: 10000 })
  await page.fill('#username', USER)
  await page.fill('#password', PASS)
  await page.getByRole('button', { name: 'Entrar' }).click()

  // 2) Painel desktop com a tabela
  await page.waitForSelector('table', { timeout: 8000 })
  result.loggedIn = true

  // 3) Busca filtra (conta no header)
  const search = page.locator('input[placeholder="Buscar por endereço"]').first()
  await search.fill('Aurora')
  await page.waitForSelector('text=1 terreno', { timeout: 4000 })
  result.buscaAurora = true
  await search.fill('')

  // 4) Ordenar pela coluna Área (2 cliques => área desc => maior primeiro)
  const areaHeader = page.locator('th button:has-text("Área")').first()
  await areaHeader.click()
  await areaHeader.click()
  result.primeiroPorArea = (await page.locator('tbody tr').first().innerText()).includes('Estrada')

  // 5) Cadastro com auto-cálculo (via "+ Novo" do painel)
  await page.getByRole('button', { name: '+ Novo' }).click()
  await page.waitForSelector('text=Novo terreno', { timeout: 5000 })
  await page.fill('#rua', 'Rua de Teste, 999')
  await page.fill('#preco', '250000')
  await page.fill('#largura', '10')
  await page.fill('#comprimento', '20')
  await page.waitForFunction(() => document.querySelector('#areaTotal')?.value === '200', null, {
    timeout: 3000,
  })
  result.areaAutoCalculada = await page.locator('#areaTotal').inputValue()
  await page.getByRole('button', { name: 'Salvar terreno' }).click()
  await page.waitForSelector('text=R$ 250.000', { timeout: 5000 })
  result.cadastroOk = true
} catch (err) {
  result.error = String(err)
}

const googleNoise = /google|maps|gstatic|MapError|InvalidKey|billing|ApiNotActivated|RefererNotAllowed/i
result.appErrors = consoleErrors.filter((e) => !googleNoise.test(e))
result.googleErrors = consoleErrors.filter((e) => googleNoise.test(e)).length

console.log(JSON.stringify(result, null, 2))
await browser.close()
