import type { Track } from './now-playing-api';

/**
 * Made-up songs for the demo and the setup page's preview, with drawn covers. Song titles and
 * artists stay as they are in every language, like real ones would.
 */
export const DEMO_TRACKS: readonly Track[] = [
  {
    title: 'Paper Satellites',
    artist: 'Juniper Vale',
    album: 'Signal Bloom',
    cover: null,
    tile: [265, 322],
  },
  {
    title: 'Low Tide Static',
    artist: 'The Lantern Choir',
    album: 'Coastline Radio',
    cover: null,
    tile: [188, 222],
  },
  {
    title: 'Velvet Orbit',
    artist: 'Kaito and the Comets',
    album: 'Night Bus Sessions',
    cover: null,
    tile: [36, 8],
  },
  {
    title: 'Copper Skies Over Harbor Street',
    artist: 'Nova Lindqvist',
    album: 'Summer Static',
    cover: null,
    tile: [142, 96],
  },
];
