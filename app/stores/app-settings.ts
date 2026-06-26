import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type AppLocale = 'uk' | 'en';
export type LengthUnit = 'mm' | 'cm' | 'm';

export interface LengthUnitOption {
  value: LengthUnit;
  factorFromMillimeters: number;
}

export const LENGTH_UNIT_OPTIONS: LengthUnitOption[] = [
  {
    value: 'mm',
    factorFromMillimeters: 1,
  },
  {
    value: 'cm',
    factorFromMillimeters: 0.1,
  },
  {
    value: 'm',
    factorFromMillimeters: 0.001,
  },
];

export const DECIMAL_PRECISION_OPTIONS = [0, 1, 2, 3, 4];

/**
 * Stores global UI settings shared by calculators and layout controls.
 *
 * Geometry calculations use millimeters internally. The selected unit is a
 * global input/output preference and should be converted at the UI boundary.
 */
export const useAppSettingsStore = defineStore('app-settings', () => {
  const locale = ref<AppLocale>('uk');
  const lengthUnit = ref<LengthUnit>('mm');
  const decimalPrecision = ref(2);

  const lengthUnitOption = computed(() => {
    return LENGTH_UNIT_OPTIONS.find((option) => option.value === lengthUnit.value) ?? LENGTH_UNIT_OPTIONS[0];
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
   * Converts a length from the currently selected unit to millimeters.
   */
  function toMillimeters(value: number): number {
    return value / lengthUnitOption.value.factorFromMillimeters;
  }

  /**
   * Converts a length from millimeters to the currently selected display unit.
   */
  function fromMillimeters(value: number): number {
    return value * lengthUnitOption.value.factorFromMillimeters;
  }

  /**
   * Converts an area from square millimeters to the currently selected squared unit.
   */
  function areaFromSquareMillimeters(value: number): number {
    return value * lengthUnitOption.value.factorFromMillimeters ** 2;
  }

  /**
   * Formats a number using global decimal precision settings.
   */
  function formatNumber(value: number): string {
    return value.toFixed(decimalPrecision.value);
  }

  /**
   * Formats a length value stored in millimeters using global precision settings.
   */
  function formatLength(value: number, unitLabel = lengthUnit.value): string {
    return `${formatNumber(fromMillimeters(value))} ${unitLabel}`;
  }

  /**
   * Formats an area value stored in square millimeters using global precision settings.
   */
  function formatArea(value: number, unitLabel = lengthUnit.value): string {
    return `${formatNumber(areaFromSquareMillimeters(value))} ${unitLabel}²`;
  }

  return {
    locale,
    lengthUnit,
    decimalPrecision,
    lengthUnitOption,
    setLocale,
    setLengthUnit,
    setDecimalPrecision,
    toMillimeters,
    fromMillimeters,
    areaFromSquareMillimeters,
    formatNumber,
    formatLength,
    formatArea,
  };
});
