import { Regex } from '../constants';

export type TValue = null | string;
export type TRuleReturn = boolean | string;

export function isRequired(fieldName: string) {
  return (v: TValue): TRuleReturn => !!v || `${fieldName} is required`;
}

export function isRequiredInArray(fieldName: string, array: string[]) {
  return (): TRuleReturn => array.length !== 0 || `${fieldName} is required`;
}

const emailCompanyRegex = new RegExp(Regex.EMAIL_COMPANY);
const emailRegex = new RegExp(Regex.EMAIL);

export function isEmail(
  fieldName: string,
  { isNormalEmail = false }: { isNormalEmail?: boolean } = {},
) {
  return (v: TValue): TRuleReturn => {
    if (v === null || v.length === 0) return true;

    if (isNormalEmail) {
      return emailRegex.test(v) || `${fieldName} - E-mail must be valid`;
    }

    return emailCompanyRegex.test(v) || `${fieldName} - E-mail must be valid`;
  };
}

export function isUniqueInArray(fieldName: string, array: string[]) {
  return (v: TValue): TRuleReturn => {
    if (v === null || v.length === 0) return true;
    return !array.includes(v) || `${v} already exists in ${fieldName}`;
  };
}
