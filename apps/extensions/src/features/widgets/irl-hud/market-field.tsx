import { useId, useState } from 'react';
import { BUTTON_SECONDARY, BUTTON_TEST } from '#/components/ui/button-styles';
import { CountField } from '#/components/ui/count-field';
import { FieldLabel } from '#/components/ui/field-label';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { useI18n } from '#/lib/i18n';
import {
  type HudItem,
  ITEM_NAME_MAX,
  isItemName,
  MAX_EVENT_MONEY,
  MAX_ITEMS,
  tidyItemName,
} from '#/lib/irl-hud-url';

const DEFAULT_PRICE = 100;

interface MarketFieldProps {
  items: HudItem[];
  onChange: (items: HudItem[]) => void;
  /** Buys an item in the preview, the way !hud buy would on stream. */
  onTry: (name: string) => void;
}

/** The market: items with a price, which mods buy from chat with !hud buy and the name. */
export function MarketField({ items, onChange, onTry }: MarketFieldProps) {
  const { t } = useI18n();
  const id = useId();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [problem, setProblem] = useState<string | null>(null);

  const add = () => {
    const tidy = tidyItemName(name);
    if (!tidy) return;
    if (items.length >= MAX_ITEMS) return setProblem(t('irlHud.itemsFull', { count: MAX_ITEMS }));
    if (!isItemName(tidy)) return setProblem(t('irlHud.itemNameInvalid'));
    if (items.some((item) => item.name.toLowerCase() === tidy.toLowerCase()))
      return setProblem(t('irlHud.itemNameTaken'));
    onChange([...items, { name: tidy, price }]);
    setName('');
    setProblem(null);
  };

  return (
    <div className="space-y-3">
      <div>
        <FieldLabel id={`${id}-items`} tip={t('irlHud.itemsTip')}>
          {t('irlHud.items')}
        </FieldLabel>
        {items.length === 0 ? (
          <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.itemsEmpty')}</p>
        ) : (
          <ul
            aria-labelledby={`${id}-items`}
            className="divide-y divide-zinc-200 rounded-md border border-zinc-300 dark:divide-zinc-700 dark:border-zinc-700"
          >
            {items.map((item, index) => (
              <li key={item.name} className="flex items-center gap-2 px-3 py-2">
                <p className="min-w-0 flex-1 truncate text-sm text-zinc-900 dark:text-white">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-zinc-500">${item.price.toLocaleString('en-US')}</span>
                </p>
                <button
                  type="button"
                  className={BUTTON_TEST}
                  aria-label={t('irlHud.itemTryLabel', { name: item.name })}
                  onClick={() => onTry(item.name)}
                >
                  {t('irlHud.itemTry')}
                </button>
                <button
                  type="button"
                  className={BUTTON_TEST}
                  aria-label={t('irlHud.itemRemoveLabel', { name: item.name })}
                  onClick={() => onChange(items.filter((_, other) => other !== index))}
                >
                  {t('irlHud.placeRemove')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid grid-cols-[1fr_8rem_auto] items-end gap-2">
        <div>
          <FieldLabel htmlFor={`${id}-name`} tip={t('irlHud.itemNameTip')}>
            {t('irlHud.itemName')}
          </FieldLabel>
          <input
            id={`${id}-name`}
            className={INPUT_CLASS}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              add();
            }}
            placeholder={t('irlHud.itemNamePlaceholder')}
            maxLength={ITEM_NAME_MAX}
            autoComplete="off"
          />
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-price`}>{t('irlHud.itemPrice')}</FieldLabel>
          <CountField
            id={`${id}-price`}
            value={price}
            onChange={setPrice}
            min={1}
            max={MAX_EVENT_MONEY}
          />
        </div>
        <button
          type="button"
          className={`${BUTTON_SECONDARY} h-9`}
          onClick={add}
          disabled={!tidyItemName(name)}
        >
          {t('irlHud.itemAdd')}
        </button>
      </div>
      {problem && (
        <p className={`${HINT_CLASS} mt-0 text-red-600 dark:text-red-400`} role="alert">
          {problem}
        </p>
      )}
    </div>
  );
}
