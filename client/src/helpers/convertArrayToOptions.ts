import { ISelectOption } from '../types';

interface IItem {
  id: number | string | null;
  name: string | null;
}

function convertArrayToOptions<T extends IItem>(
  data: T[],
): (T & ISelectOption)[] {
  return data.map(item => ({
    ...item,
    value: item?.id ?? null,
    text: item?.name ?? null,
  }));
}

export default convertArrayToOptions;
