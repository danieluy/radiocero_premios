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

    return sorted.map(result => result.w);
  }

}