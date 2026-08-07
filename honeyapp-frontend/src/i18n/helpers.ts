import type { HoneyType, QuantityChangeReason } from '../types';
import i18n from '../i18n';

export function translateHoneyType(type: HoneyType): string {
  return i18n.t(`honeyType.${type}`, { defaultValue: type });
}

export function translateQuantityChangeReason(reason: QuantityChangeReason): string {
  return i18n.t(`quantityChangeReason.${reason}`, { defaultValue: reason });
}

export function translateRegion(region: string | null | undefined): string {
  if (!region) return '';
  return i18n.t(`regions.${region}`, { defaultValue: region });
}
