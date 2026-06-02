#!/usr/bin/env node
// Contract guard (PostToolUse): quando o front mexe em chamadas de API, lembra a
// regra do contrato. Nunca bloqueia — só injeta um lembrete pro modelo.
// Funciona sem git: decide pela heurística de conteúdo do arquivo editado.
import { readFileSync } from "node:fs";

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let evt;
  try {
    evt = JSON.parse(raw || "{}");
  } catch {
    process.exit(0);
  }

  const file = evt?.tool_input?.file_path || "";
  if (!file) process.exit(0);

  // O próprio contrato: tudo certo.
  if (file.includes("contract/openapi.yaml")) process.exit(0);
  // Só nos importamos com o frontend.
  if (!file.includes("/web/")) process.exit(0);

  let content = "";
  try {
    content = readFileSync(file, "utf8");
  } catch {
    process.exit(0);
  }

  // Heurística: o arquivo faz chamada de API?
  const usesApi =
    /\bfetch\s*\(|axios|["'`]\/api\/|useQuery|useMutation|EventSource|XMLHttpRequest/.test(
      content,
    );
  if (!usesApi) process.exit(0);

  const msg =
    "🔗 Contrato: este arquivo usa a API. Se você criou uma rota nova ou mudou " +
    "request/response, atualize contract/openapi.yaml na MESMA mudança (skill " +
    "api-contract). Se nada de API mudou, pode ignorar.";

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: msg,
      },
    }),
  );
  process.exit(0);
});
