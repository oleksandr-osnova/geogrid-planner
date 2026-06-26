import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type AppLocale = 'uk' | 'en';
export type LengthUnit = 'mm' | 'cm' | 'm';

export interface LengthUnitOption {
  value: LengthUnit;
  labelKey: string;
  symbolKey: string;
}

export const DEFAULT_LENGTH_UNIT_OPTION: LengthUnitOption = {
  value: 'm',
  labelKey: 'settings.units.m',
  symbolKey: 'settings.unitSymbols.m',
};

export const LENGTH_UNIT_OPTIONS: readonly LengthUnitOption[] = [
  DEFAULT_LENGTH_UNIT_OPTION,
  {
    value: 'cm',
    labelKey: 'settings.units.cm',
    symbolKey: 'settings.unitSymbols.cm',
  },
  {
    value: 'mm',
    labelKey: 'settings.units.mm',
    symbolKey: 'settings.unitSymbols.mm',
  },
];

export const DECIMAL_PRECISION_OPTIONS = [0, 1, 2, 3, 4];

/**
 * Stores global UI settings shared by calculators and layout controls.
 *
 * The selected unit is treated as the active unit for both user input and
 * calculation output. Values are not converted when the unit changes: the same
 * numeric input is simply interpreted in the newly selected unit.
 */
export const useAppSettingsStore = defineStore('app-settings', () => {
  const locale = ref<AppLocale>('uk');
  const lengthUnit = ref<LengthUnit>('m');
  const decimalPrecision = ref(2);

  const lengthUnitOption = computed(() => {
    return (
      LENGTH_UNIT_OPTIONS.find((option) => option.value === lengthUnit.value) ??
      DEFAULT_LENGTH_UNIT_OPTION
    );
  });

  function setLocale(value: AppLocale): void {
    locale.value = value;
  }

  function setLengthUnit(value: LengthUnit): void {
    lengthUnit.value = value;
  }

  function setDecimalPrecision(value: number): void {
    decimalPrecision.value = value;
  }

  /**
   * Formats a numeric metric value using the global decimal precision.
   */
  function formatNumber(value: number): string {
    return value.toFixed(decimalPrecision.value);
  }

  return {
    locale,
    lengthUnit,
    decimalPrecision,
    lengthUnitOption,
    setLocale,
    setLengthUnit,
    setDecimalPrecision,
    formatNumber,
  };
});
