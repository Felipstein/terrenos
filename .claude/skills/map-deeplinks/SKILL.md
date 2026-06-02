---
name: map-deeplinks
description: Use ao trabalhar com Google Maps no app — botão de rota (deep-link nativo), ler coordenadas de um link colado, ou reverse-geocoding (endereço a partir de lat/lng).
governs:
  - web/src/lib/maps.ts
  - web/src/lib/parse-maps-url.ts
  - web/src/features/map/**
  - web/src/features/terreno-detail/RouteButton.tsx
---

# Google Maps — rota, parsing e geocoding

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

## Provider e chave
Mapa = Google Maps (`@vis.gl/react-google-maps`), chave em `VITE_GOOGLE_MAPS_API_KEY`, `mapId` em `VITE_GOOGLE_MAPS_MAP_ID`. **Restringir a chave por domínio + teto de cota** no Google Cloud pra não gerar custo.
