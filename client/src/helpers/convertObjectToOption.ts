import { ISelectOption } from '../types';

interface IItem {
  id: string | number;
  name: string;
}

function convertObjectToOption<T extends IItem>(data: T): T & ISelectOption {
  return {
    ...data,
    value: data.id,
    text: data.name,
  };
}

export default convertObjectToOption;
