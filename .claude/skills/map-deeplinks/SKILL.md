---
name: map-deeplinks
description: Use ao implementar o botão de rota, abrir um local no Google Maps nativo do celular, ou construir URLs de mapa/rota a partir de lat/lng. Independe da biblioteca de mapa usada na tela.
---

# Deep-links pro Google Maps nativo

O botão de rota deve abrir o **app nativo do Google Maps** (ou a versão web, se não instalado) já com a rota até o terreno. Isso **independe** da lib usada pra desenhar o mapa na tela (Leaflet/Mapbox/Google JS/etc).

## Rota até o destino (direções)
```
https://www.google.com/maps/dir/?api=1&destination=LAT,LNG
```
- No celular, o sistema abre o app nativo automaticamente.
- Opcional: `&travelmode=driving`.

## Só mostrar um ponto
```
https://www.google.com/maps/search/?api=1&query=LAT,LNG
```

## Boas práticas
- Use sempre `LAT,LNG` (vindo do `terreno-schema`), não endereço em texto — evita ambiguidade.
- O botão é um `<a href>` simples; **não precisa de SDK nem chave de API** do Google.
- Faça o alvo de toque grande e óbvio (ver `ui-conventions`).

Referência: Google Maps URLs (`api=1`).
