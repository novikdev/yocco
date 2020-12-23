import { format as dfnFormat } from 'date-fns';
import { ru } from 'date-fns/locale';

export function format(date: Date, formatStr: string) {
  return dfnFormat(date, formatStr, {
    locale: ru,
  });
}
