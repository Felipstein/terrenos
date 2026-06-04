#!/usr/bin/env bash
#
# Setup ONE-TIME: cria na AWS o OIDC provider do GitHub. É único por CONTA —
# roda uma vez só, e serve pra QUALQUER repo/serviço dessa conta.
#
# A IAM role do deploy NÃO está aqui — ela é IaC, vive no serverless.yml
# (GitHubActionsRole, criada no `sls deploy --stage prod`). Este provider é só
# o pré-requisito que o template referencia.
#
# Rode local, com credenciais AWS de admin. Idempotente.
#
#   ./scripts/setup-oidc-provider.sh
#
set -euo pipefail

PROVIDER_URL="token.actions.githubusercontent.com"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/${PROVIDER_URL}"

if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$PROVIDER_ARN" >/dev/null 2>&1; then
  echo "OIDC provider já existe nesta conta (${ACCOUNT_ID}) — nada a fazer."
  exit 0
fi

echo "Criando OIDC provider do GitHub na conta ${ACCOUNT_ID}..."
# A AWS valida o token do GitHub por CA pública; o thumbprint é legado mas a API
# ainda o exige. Estes são os thumbprints públicos do GitHub.
aws iam create-open-id-connect-provider \
  --url "https://${PROVIDER_URL}" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list \
    "6938fd4d98bab03faadb97b34396831e3780aea1" \
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd" >/dev/null

echo "OIDC provider criado. Agora rode o 1º deploy de prod local:"
echo "  pnpm run deploy --stage prod"
echo "Pegue o ARN da role no output GitHubActionsRoleArn e cole no secret AWS_DEPLOY_ROLE_ARN."
