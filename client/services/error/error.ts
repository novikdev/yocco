import { IYoccoError } from '@services/api/types';

export class YoccoError extends Error {
  constructor(error: IYoccoError) {
    const message = errorCodeToMsg(error);
    super(message);
    this.name = 'YoccoError';
  }
}

export function errorCodeToMsg(error: IYoccoError): string {
  if (typeof apiErrors[error.code] === 'function') {
    return (apiErrors[error.code] as Function)(error.info);
  } else if (typeof apiErrors[error.code] === 'string') {
    return apiErrors[error.code] as string;
  }
  return 'Что-то пошло не так';
}

const fbPermissions: { [key: string]: string } = {
  email: 'Электронный адрес',
  pages_show_list: 'Показать список Страниц, которыми вы управляете',
  pages_read_engagement: 'Читать контент, опубликованный на этой Странице',
  instagram_basic:
    'Доступ к профилю и публикациям аккаунта Instagram, связанного с вашей Страницей',
  instagram_manage_insights:
    'Доступ к статистике аккаунта Instagram, подключенного к вашей Странице',
  ads_management: 'Управление рекламными объявлениями',
  business_management: 'Управлять вашей компанией',
};

const apiErrors: { [key: number]: string | ((...args: any[]) => string) } = {
  1: (permissions: string[]): string => {
    const permissionNames = permissions.map(
      (permission) => fbPermissions[permission] ?? permission
    );
    return `Необходимо дать приложению следующие права: ${permissionNames.join('; ')}`;
  },
};
