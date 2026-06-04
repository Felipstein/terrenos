import type { MapsResolver, ResolvedLocation } from '../ports/maps-resolver'

/** Resolve um link do Google Maps em coordenadas. */
export class ResolveMapsLink {
  constructor(private readonly maps: MapsResolver) {}

  execute(url: string): Promise<ResolvedLocation> {
    return this.maps.resolve(url)
  }
}
