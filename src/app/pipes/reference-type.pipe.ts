import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'referenceType'
})
export class ReferenceTypePipe implements PipeTransform {

    transform(items: any[], type: string): any[] {

        if (!items) {
            return [];
        }
        if (!type) {
            return items;
        }

        type = type.toLowerCase();
        items = items.filter(item => {
            return item.type = type;
        });

        console.log('OUT: ', items);
        return items;
    }
}
