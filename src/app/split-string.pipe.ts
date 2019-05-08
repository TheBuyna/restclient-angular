import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitString'
})
export class SplitStringPipe implements PipeTransform {

  transform(value: any, input: string): any {
    return input.split(" ")[0];
  }

}
