import { Fragment } from 'react';
import { useI18n } from '#/lib/i18n';
import {
  OBS_COMMAND_KEYS,
  type ObsBridgeCustomCommands,
  resolveObsCommands,
} from './obs-bridge-config';

/** Which chat message does what, with the commands as the tool will run them. */
export function ObsCommandList({ commands }: { commands: ObsBridgeCustomCommands }) {
  const { t } = useI18n();
  const resolved = resolveObsCommands(commands);

  return (
    <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2 text-sm">
      {OBS_COMMAND_KEYS.map((key) => (
        <Fragment key={key}>
          <dt>
            <code className="break-all rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-green-700 dark:bg-zinc-800 dark:text-green-400">
              {key === 'cmdScene'
                ? `${resolved.cmdScene} ${t('obsBridge.sceneArg')}`
                : resolved[key]}
            </code>
          </dt>
          <dd className="text-zinc-600 dark:text-zinc-400">
            {t(`obsBridge.action.${key}`, { example: `${resolved.cmdScene} Gaming` })}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
