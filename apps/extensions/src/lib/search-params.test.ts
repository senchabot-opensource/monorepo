import { defaultParseSearch, defaultStringifySearch } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { Route as ObsBridgeTool } from '#/routes/tools/obs-bridge';
import { Route as ChatWidget } from '#/routes/widgets/chat-widget';
import { Route as EmoteWall } from '#/routes/widgets/emote-wall';
import { Route as SubSprout } from '#/routes/widgets/sub-sprout-widget';
import { parseSearch, stringifySearch } from './search-params';

const validate = (route: { options: { validateSearch?: unknown } }, search: string) =>
  (route.options.validateSearch as (input: Record<string, unknown>) => Record<string, unknown>)(
    parseSearch(search),
  );

describe('parseSearch', () => {
  it('keeps digit-only and JSON-looking text params as the exact string', () => {
    const search = parseSearch(
      '?twitch=123&kick=007&obsWebsocketPassword=123456&cmdBrb=true&mainScene=null&commandUser=%22bob%22',
    );
    expect(search).toMatchObject({
      twitch: '123',
      kick: '007',
      obsWebsocketPassword: '123456',
      cmdBrb: 'true',
      mainScene: 'null',
      commandUser: '"bob"',
    });
  });

  it('decodes text params the same way the default parser does', () => {
    const search = parseSearch('?obsWebsocketPassword=a+b%2Bc%26d&twitch=%C3%A7a%C4%9Fla');
    expect(search.obsWebsocketPassword).toBe('a b+c&d');
    expect(search.twitch).toBe('çağla');
  });

  it('leaves every other param exactly as the default parser reads it', () => {
    const query = '?mock=true&fontSize=18&bgOpacity=0.5&sevenTv=false&mode=chaos&size=112';
    expect(parseSearch(query)).toEqual(defaultParseSearch(query));
  });
});

describe('stringifySearch', () => {
  it('writes text params without the quotes the default adds to JSON-looking strings', () => {
    expect(defaultStringifySearch({ obsWebsocketPassword: '123456' })).toBe(
      '?obsWebsocketPassword=%22123456%22',
    );
    expect(stringifySearch({ obsWebsocketPassword: '123456', twitch: 'true' })).toBe(
      '?obsWebsocketPassword=123456&twitch=true',
    );
  });

  it('matches the default for other params and keeps key order', () => {
    const search = { mock: true, fontSize: 18, font: 'inter', twitch: 'bob', sevenTv: false };
    expect(stringifySearch(search)).toBe(defaultStringifySearch(search));
  });

  it('round-trips through parseSearch', () => {
    const search = { twitch: '123', obsWebsocketPassword: 'p@ss w0rd&"x"', mainScene: 'Main 2' };
    expect(parseSearch(stringifySearch(search))).toEqual(search);
  });
});

describe('routes accept digit-only and JSON-looking text', () => {
  it('OBS Bridge tool loads with a numeric password and a numeric command', () => {
    const search = validate(
      ObsBridgeTool,
      '?twitch=foo&obsWebsocketPassword=123456&cmdBrb=1&commandUser=twitch:42',
    );
    expect(search).toMatchObject({
      obsWebsocketPassword: '123456',
      cmdBrb: '1',
      commandUser: 'twitch:42',
    });
  });

  it('overlays load for digit-only channel names', () => {
    expect(validate(ChatWidget, '?twitch=12345&kick=678').twitch).toBe('12345');
    expect(validate(EmoteWall, '?twitch=12345').twitch).toBe('12345');
    expect(validate(SubSprout, '?kick=678').kick).toBe('678');
  });
});
