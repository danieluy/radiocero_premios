import { Pipe, PipeTransform } from '@angular/core';
import { Winner } from '../winners/winner.class';
import { WinnersPrizeResults } from '../winners/winner-prize-result.class';


@Pipe({
  name: 'filterWinnersSearch'
})
export class FilterWinnersSearch implements PipeTransform {

  transform(full_list: Array<any>, query: string): Array<any> {
    if (!query)
      return full_list;
    else
      return this.searchWinner(full_list, query);
  }

  searchWinner(full_list: Array<any>, query): Array<any> {
    let query_arr = query.trim().split(' ');
    let results = new WinnersPrizeResults();
    for (let i = 0; i < query_arr.length; i++) {
      for (let j = 0; j < full_list.length; j++) {
        if (full_list[j].w.matches(query_arr[i]))
          results.addResult(full_list[j]);
      }
    }
    return results.SortedResults;
  }

}