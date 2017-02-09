import { Winner } from './winner.class';
import { Utils } from '../app.utils';

export class WinnersPrizeResults {

  constructor() {
    this.results = new Object();
  }

  private results: any;

  public addResult(wp: any): void {
    this.results.hasOwnProperty(wp.w.CiRaw) ? this.results[wp.w.CiRaw].count++ : this.results[wp.w.CiRaw] = { wp: wp, count: 1 };
  }

  public get SortedResults(): Array<any> {

    let sorted: Array<any> = [];

    for (let key in this.results) {
      sorted.push(this.results[key])
    }

    Utils.sortCounterDescendent(sorted);

    return sorted.map(result => result.wp);
  }

}