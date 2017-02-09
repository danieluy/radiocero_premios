import { Pipe, PipeTransform } from '@angular/core';
import { Prize } from '../prizes/prize.class';


@Pipe({
  name: 'currentOnly'
})
export class CurrentOnly implements PipeTransform {

  transform(prizes: Array<Prize>, args?: any): Array<Prize> {
    if (prizes)
      return prizes.filter(prize => (prize.stock > 0 || prize.periodic === true));
    return prizes;
  }

}