export class Utils {

  // Iterable must have a length property, and its elements must have a count: number property
  // Selection sort
  public static sortCounterDescendent(iterable): void {
    for (let i = 0; i < iterable.length - 1; i++) {
      let max_count: number = iterable[i + 1].count;
      let max_pos: number = i + 1;
      for (let j = i + 2; j < iterable.length; j++) {
        if (max_count < iterable[j].count) {
          max_count = iterable[j].count;
          max_pos = j;
        }
      }
      if (iterable[i].count < max_count) {
        let aux: any = iterable[i];
        iterable[i] = iterable[max_pos];
        iterable[max_pos] = aux;
      }
    }
  }

}
