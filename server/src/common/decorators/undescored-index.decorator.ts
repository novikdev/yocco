import { snakeCase } from 'lodash';
import { annotateModelWithIndex } from 'sequelize-typescript';

export function UnderscoredIndex<T>(target: T, key: string): void {
  annotateModelWithIndex(target, snakeCase(key));
}
