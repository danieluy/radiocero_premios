import { Winner } from './winner.class';
import { Utils } from '../app.utils';

export class WinnersResults {

  constructor() {
    this.results = new Object();
  }

  private results: any;

  public addResult(w: Winner): void {
    this.results.hasOwnProperty(w.CiRaw) ? this.results[w.CiRaw].count++ : this.results[w.CiRaw] = { w: w, count: 1 };
  }

  public get SortedResults(): Winner[] {

    let sorted: Array<any> = [];

    for (let key in this.results)
      sorted.push(this.results[key])


    Utils.sortCounterDescendent(sorted);
    // // SELECTION SORT
    // for (let i = 0; i < sorted.length - 1; i++) {
    //   let max_count: number = sorted[i + 1].count;
    //   let max_pos: number = i + 1;
    //   for (let j = i + 2; j < sorted.length; j++) {
    //     if (max_count < sorted[j].count) {
    //       max_count = sorted[j].count;
    //       max_pos = j;
    //     }
    //   }
    //   if (sorted[i].count < max_count) {
    //     let aux: any = sorted[i];
    //     sorted[i] = sorted[max_pos];
    //     sorted[max_pos] = aux;
    //   }
    // }

    return sorted.map(result => result.w);
  }

}