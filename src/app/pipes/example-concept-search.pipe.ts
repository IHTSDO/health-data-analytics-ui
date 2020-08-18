import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exampleConceptSearch'
})
export class ExampleConceptSearchPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return null;
    }

}
