---
name: map-deeplinks
description: Use ao trabalhar com Google Maps no app — botão de rota (deep-link nativo), ler coordenadas de um link colado, ou reverse-geocoding (endereço a partir de lat/lng).
governs:
  - web/src/lib/maps.ts
  - web/src/lib/parse-maps-url.ts
  - web/src/features/map/**
  - web/src/features/list/TerrenoTableRow.tsx
  - web/src/features/terreno-detail/RouteButton.tsx
---

# Google Maps — rota, parsing e geocoding

## 0. Tipo de mapa (roadmap × satélite)
`features/map/MapTypeControl.tsx` é o segmented control flutuante (canto superior esquerdo do mapa) que alterna entre **Mapa** (`roadmap`) e **Satélite** (`satellite`). O estado vive no `MapView`, que passa o valor pra prop `mapTypeId` do `<Map>` (`@vis.gl/react-google-maps`). Default = `roadmap`. Sem chave de API o mapa cai no placeholder e o controle nem renderiza.

## 1. Rota até o destino (deep-link nativo)
O botão de rota abre o **app nativo do Google Maps** com a rota. Vale pra qualquer provider de mapa na tela.
```
https://www.google.com/maps/dir/?api=1&destination=LAT,LNG
```
`lib/maps.ts` → `buildDirectionsUrl(lat, lng)`. É só um `<a href>`, sem SDK nem chave.

## 2. Ler coordenadas de um link colado
`lib/parse-maps-url.ts` → `parseLatLngFromGoogleMapsUrl(url)`: extrai `{lat,lng}` de URLs **completas** do Google (`@lat,lng`, `!3dLAT!4dLNG`, `q=/ll=/query=`). Parse 100% no navegador.
- **Link curto** (`maps.app.goo.gl`) **não** funciona ainda (precisa resolver redirect → backend). Retorna `null`.

## 3. Reverse geocoding (endereço a partir do ponto)
`features/map/useReverseGeocode.ts` usa o geocoding do Google (via `@vis.gl/react-google-maps`). Retorna `null` se a lib não carregou (ex: sem chave). Usado no cadastro pra autopreencher a `rua`.

## 4. Hover sincronizado lista ↔ pino (D4)
Estado de "terreno em hover" **elevado no `AppShell`** (`hoveredId` + `setHoveredId`), compartilhado entre lista e mapa — o efeito é **idêntico** venha da linha da tabela ou direto do pino.
- **Hover só com mouse**: linha (`TerrenoTableRow`) e pino (`PriceMarker`) usam `onPointerEnter/Leave` filtrados por `pointerType === 'mouse'`. Em **touch não há hover** — o toque segue só o fluxo de seleção (`onSelect`). Progressive enhancement pra ponteiro.
- **Destaque visual**: `PriceMarker` aplica o tom `moss` + `scale-110` quando `selected || hovered` (mesmo destaque do selecionado).
- **z-index do pino** (`PriceMarker`): hover = `2000` (acima de TODOS, pra pino escondido vir pra frente), selecionado = `1000`, demais = `undefined`.
- **Pan automático**: `features/map/HoverPanController.tsx` recebe o terreno em hover; se ele estiver **fora dos `getBounds()` atuais**, faz `panTo` suave até ele. Não mexe no zoom e não paneia pinos já visíveis.
- O hover **não re-renderiza o mapa inteiro** — só os pinos cujo `hovered`/`selected` mudou (props primitivas + setters estáveis + React Compiler).

## Provider e chave
Mapa = Google Maps (`@vis.gl/react-google-maps`), chave em `VITE_GOOGLE_MAPS_API_KEY`, `mapId` em `VITE_GOOGLE_MAPS_MAP_ID`. **Restringir a chave por domínio + teto de cota** no Google Cloud pra não gerar custo.
