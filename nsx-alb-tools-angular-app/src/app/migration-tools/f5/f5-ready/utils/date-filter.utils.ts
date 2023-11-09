import { ClrDatagridStringFilterInterface } from '@clr/angular';

export type TDateFilter = DateFilter;

export class DateFilter implements ClrDatagridStringFilterInterface<any> {
    accepts(item: any, search: string): boolean {
        const value: string = new Date(item.date).toString().toLowerCase();

        return value.includes(search.toLowerCase());
  }
}
