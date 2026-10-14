import { describe, expect, it } from 'vitest';
import {
  buildCounterPreviewUrl,
  buildCounterUrl,
  COUNTER_STAGES,
  type CounterSettings,
  DEFAULT_COUNTER,
  DEFAULT_COUNTER_SETTINGS,
  LABEL_MAX_LENGTH,
  MAX_COUNT,
  normalizeCommand,
  parseCounterUrl,
  readCounterSettings,
  uniqueCommands,
} from './counter-url';
import { getWidget } from './widgets';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: CounterSettings = {
  platforms: 'both',
  preset: 'classic',
  color: 'gold',
  layout: 'stack',
  pops: false,
  counters: [
    { label: 'Losses', command: 'losses', icon: '❌', iconUrl: '', start: 12 },
    {
      label: 'Wins',
      command: 'w',
      icon: '',
      iconUrl: 'https://cdn.7tv.app/emote/1/2x.webp',
      start: 0,
    },
  ],
};
const read = (query: string) => readCounterSettings(new URLSearchParams(query));

describe('buildCounterUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildCounterUrl(ORIGIN, DEFAULT_COUNTER_SETTINGS, '', '')).toBe('');
    expect(
      buildCounterUrl(ORIGIN, { ...DEFAULT_COUNTER_SETTINGS, platforms: 'kick' }, 'me', ''),
    ).toBe('');
  });

  it('writes the channels and the Wins counter for default settings', () => {
    const url = new URL(
      buildCounterUrl(ORIGIN, DEFAULT_COUNTER_SETTINGS, ' Streamer ', 'KickName'),
    );
    expect(url.pathname).toBe('/widgets/counter');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      kick: 'kickname',
      c1: 'Wins',
      c1cmd: 'wins',
      c1icon: '🏆',
    });
  });

  it('writes every changed setting and every counter', () => {
    const url = new URL(buildCounterUrl(ORIGIN, CUSTOM, 'streamer', ''));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      color: 'gold',
      layout: 'stack',
      pops: '0',
      c1: 'Losses',
      c1cmd: 'losses',
      c1icon: '❌',
      c1start: '12',
      c2: 'Wins',
      c2cmd: 'w',
      c2iconUrl: 'https://cdn.7tv.app/emote/1/2x.webp',
    });
  });

  it('keeps an empty label, since the parameter is what makes the counter', () => {
    const settings = { ...CUSTOM, counters: [{ ...DEFAULT_COUNTER, label: '' }] };
    const url = new URL(buildCounterUrl(ORIGIN, settings, 'streamer', ''));
    expect(url.searchParams.get('c1')).toBe('');
    expect(read(url.search).counters).toEqual([{ ...DEFAULT_COUNTER, label: '' }]);
  });

  it('writes at most four counters, with commands as mods type them', () => {
    const counters = Array.from({ length: 6 }, (_, index) => ({
      ...DEFAULT_COUNTER,
      label: `C${index}`,
      command: `!Count${index}`,
    }));
    const url = new URL(buildCounterUrl(ORIGIN, { ...CUSTOM, counters }, 'streamer', ''));
    expect(url.searchParams.has('c4')).toBe(true);
    expect(url.searchParams.has('c5')).toBe(false);
    expect(url.searchParams.get('c2cmd')).toBe('count1');
  });

  it('builds a preview that never names a channel and is paired with its page', () => {
    const url = new URL(buildCounterPreviewUrl(ORIGIN, CUSTOM, 'abc123'));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc123');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.has('simplatform')).toBe(false);
    expect(url.searchParams.get('c1start')).toBe('12');
    const kickOnly = new URL(buildCounterPreviewUrl(ORIGIN, { ...CUSTOM, platforms: 'kick' }, 'x'));
    expect(kickOnly.searchParams.get('simplatform')).toBe('kick');
  });

  it('writes a preset instead of the color, which the preset brings', () => {
    const url = new URL(buildCounterUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'streamer', ''));
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(url.searchParams.has('color')).toBe(false);
  });
});

describe('readCounterSettings', () => {
  it('falls back to the Wins counter and the defaults', () => {
    const { counters, ...rest } = read('');
    expect(counters).toEqual([DEFAULT_COUNTER]);
    expect(rest).toEqual({ preset: 'classic', color: 'purple', layout: 'row', pops: true });
  });

  it('drops garbage to the defaults and clamps counts', () => {
    const settings = read(
      `color=teal&layout=grid&pops=no&c1=Losses&c1start=-4&c2=Wins&c2start=${MAX_COUNT + 5}&c3=X&c3start=abc`,
    );
    expect(settings.color).toBe('purple');
    expect(settings.layout).toBe('row');
    expect(settings.pops).toBe(false);
    expect(settings.counters.map((counter) => counter.start)).toEqual([0, MAX_COUNT, 0]);
  });

  it('reads the counters in order, skipping gaps, and stops at four', () => {
    const settings = read('c2=Two&c4=Four&c5=Five&c1=One');
    expect(settings.counters.map((counter) => counter.label)).toEqual(['One', 'Two', 'Four']);
  });

  it('takes the label as the command when the URL leaves it out', () => {
    expect(read('c1=Boss%20Fights').counters[0].command).toBe('bossfights');
    expect(read('c1=Wins&c1cmd=%21GG').counters[0].command).toBe('gg');
  });

  it('gives an empty or repeated command a count fallback', () => {
    const settings = read('c1=Wins&c2=Wins&c3=%F0%9F%8F%86&c4=x&c4cmd=count2');
    expect(settings.counters.map((counter) => counter.command)).toEqual([
      'wins',
      'count2',
      'count3',
      'count4',
    ]);
    // The fallback itself taken too.
    const taken = read('c1=a&c1cmd=count2&c2=b&c2cmd=count2');
    expect(taken.counters.map((counter) => counter.command)).toEqual(['count2', 'count2_2']);
  });

  it('cuts labels and icons by code point, never splitting an emoji', () => {
    const long = '🏆'.repeat(LABEL_MAX_LENGTH + 5);
    const [counter] = read(
      `c1=${encodeURIComponent(long)}&c1icon=${encodeURIComponent(long)}`,
    ).counters;
    expect(Array.from(counter.label)).toHaveLength(LABEL_MAX_LENGTH);
    expect(counter.label).toBe('🏆'.repeat(LABEL_MAX_LENGTH));
    expect(counter.icon).toBe('🏆'.repeat(8));
  });
});

describe('normalizeCommand', () => {
  it.each([
    ['!WINS', 'wins'],
    ['Boss Fights!', 'bossfights'],
    ['GÜLÜŞ', 'gülüş'],
    ['İyi_Oyun', 'iyi_oyun'],
    ['🏆', ''],
    ['a'.repeat(30), 'a'.repeat(20)],
  ])('%s → %s', (input, output) => {
    expect(normalizeCommand(input)).toBe(output);
  });
});

describe('uniqueCommands', () => {
  it('keeps the counters it doesn’t have to change', () => {
    const counters = [DEFAULT_COUNTER, { ...DEFAULT_COUNTER, command: 'losses' }];
    const unique = uniqueCommands(counters);
    expect(unique[0]).toBe(counters[0]);
    expect(unique[1]).toBe(counters[1]);
  });
});

describe('parseCounterUrl', () => {
  it('reads back what buildCounterUrl wrote', () => {
    const settings: CounterSettings = {
      ...CUSTOM,
      counters: [
        { label: 'a&b=c %20 #1 ?', command: 'odd', icon: '🏆', iconUrl: '', start: 3 },
        { label: 'Gülüş Sayısı', command: 'gülüş', icon: '😂', iconUrl: '', start: 0 },
      ],
    };
    const parsed = parseCounterUrl(buildCounterUrl(ORIGIN, settings, 'Streamer', 'kicker'));
    expect(parsed).toEqual({ settings, twitchChannel: 'streamer', kickChannel: 'kicker' });
  });

  it('reads a preset back', () => {
    const url = buildCounterUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'streamer', '');
    expect(parseCounterUrl(url)?.settings.preset).toBe('rift');
  });

  it('is null for other widgets and garbage', () => {
    expect(parseCounterUrl(`${ORIGIN}/widgets/goal?twitch=x`)).toBeNull();
    expect(parseCounterUrl('not a url')).toBeNull();
  });
});

describe('counter stages', () => {
  it('gives the registry the side by side stage as the browser source size', () => {
    expect(getWidget('counter').sourceSize).toEqual(COUNTER_STAGES.row);
  });
});
