#!/usr/bin/env node
// Skill-guard (PostToolUse): se um arquivo editado é "governado" por uma skill
// (campo `governs` no frontmatter da SKILL.md), lembra de manter a skill em sync.
//
// Genérico e AUTO-EXTENSÍVEL: o hook lê o `governs` de TODAS as skills a cada
// edição. Toda skill nova que declarar `governs` entra no sistema sozinha —
// nunca é preciso editar este hook. Nunca bloqueia; só injeta um lembrete.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

let raw = ''
process.stdin.on('data', (chunk) => (raw += chunk))
process.stdin.on('end', () => {
  try {
    run()
  } catch {
    // Nunca quebrar uma edição por causa do guard.
  }
  process.exit(0)
})

function run() {
  const evt = JSON.parse(raw || '{}')
  const file = evt?.tool_input?.file_path || ''
  if (!file) return

  const cwd = process.cwd()
  let rel = file.startsWith(cwd) ? file.slice(cwd.length) : file
  rel = rel.replace(/^\/+/, '')

  // Edição na própria skill: nada a lembrar.
  if (rel.startsWith('.claude/skills/')) return

  const skillsDir = join(cwd, '.claude', 'skills')
  if (!existsSync(skillsDir)) return

  const matches = []
  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const skillFile = join(skillsDir, entry.name, 'SKILL.md')
    if (!existsSync(skillFile)) continue
    const governs = parseGoverns(readFileSync(skillFile, 'utf8'))
    if (governs.some((glob) => globMatch(glob, rel))) matches.push(entry.name)
  }
  if (matches.length === 0) return

  const list = matches.map((name) => `\`${name}\``).join(', ')
  const msg =
    `📚 Sync de skills: \`${rel}\` é documentado pela(s) skill(s) ${list}. ` +
    `Se o comportamento/regra mudou, atualize a skill na MESMA mudança. ` +
    `Se foi refactor sem mudar comportamento, ignore.`

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: msg },
    }),
  )
}

// Lê o campo `governs` do frontmatter (lista inline [a, b] ou bloco com `-`).
function parseGoverns(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) return []
  const fm = fmMatch[1]

  const inline = fm.match(/governs:\s*\[([^\]]*)\]/)
  if (inline) {
    return splitList(inline[1])
  }

  const block = fm.match(/governs:\s*\n([\s\S]*?)(?:\n\S|$)/)
  if (block) {
    return block[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('-'))
      .map((line) => unquote(line.slice(1).trim()))
      .filter(Boolean)
  }
  return []
}

function splitList(value) {
  return value
    .split(',')
    .map((item) => unquote(item.trim()))
    .filter(Boolean)
}

function unquote(value) {
  return value.replace(/^['"]|['"]$/g, '')
}

// Glob simples: `*` casa um segmento, `**` casa qualquer profundidade.
function globMatch(glob, path) {
  const source =
    '^' +
    glob
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\/\*\*/g, '(/.*)?')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*') +
    '$'
  return new RegExp(source).test(path)
}
