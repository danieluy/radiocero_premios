import { Component, OnInit } from '@angular/core';
import { Winner } from './winner.class';
import { Prize } from '../prizes/prize.class';
import { WinnersService } from '../winners/winners.service';
import { PrizesService } from '../prizes/prizes.service';
import { NotificationService } from '../notification/notification.service';
import { WinnersResults } from './winner-result.class';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: [
    '../app.global-styles.css',
    './winners.component.css'
  ],
  providers: [
    WinnersService,
    PrizesService
  ]
})
export class WinnersComponent implements OnInit {

  constructor(private winnersService: WinnersService, private prizesService: PrizesService, private notificationService: NotificationService) { }

  private visible_tab: string;
  private winners_list: Winner[];
  private winners_list_filter: Winner[];
  private current_winners_list: Winner[];
  private winner_prize_list: Array<any> = [];
  private winner_to_display: number;
  private winner_item_to_display: number;
  private query: string;

  ngOnInit() {
    this.visible_tab = 'currentWinnersList';

    // subscribes to prizes observable to react when winners observable fires
    this.prizesService.prizes$.subscribe(prizes => {
      this.pairWinnerPrize(prizes);
    })

    this.winnersService.winners$.subscribe(winners => {
      this.winners_list = winners;
      this.winners_list_filter = winners;
      this.current_winners_list = this.winners_list.filter(winner => winner.IsCurrent);
      this.prizesService.fetchPrizes();
    })

    this.winnersService.fetchWinners();
  }

  navigateTo(tab: string) {
    this.visible_tab = tab;
    this.winnersService.fetchWinners();
  }

  displayWinnerInfo(i: number): void {
    this.winner_to_display = this.winner_to_display === i ? undefined : i;
  }

  displayWinnerItemInfo(i: number): void {
    this.winner_item_to_display = this.winner_item_to_display === i ? undefined : i;
  }

  handOverPrize(winner_ci: string, prize_id: string): void {
    this.winnersService.handOverPrize(winner_ci, prize_id)
      .subscribe(
      res => {
        this.winnersService.fetchWinners();
        this.notificationService.ok("Exito", "El premio se a entregado correctamente", 3000)
      },
      error => this.notificationService.error("Error, el premio NO ha sido entregado", error.json().details)
      );
  }

  cancelHandOverPrize(): void {
    // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
    console.log('cancelHandOverPrize() was called');
  }

  searchWinner(e: any): void {
    if (!e.target.value || e.target.value === '')
      this.winners_list_filter = this.winners_list;
    else {
      let query_arr = e.target.value.trim().split(' ');
      let results = new WinnersResults();
      for (let i = 0; i < query_arr.length; i++) {
        for (let j = 0; j < this.winners_list.length; j++) {
          if (this.winners_list[j].matches(query_arr[i]))
            results.addResult(this.winners_list[j]);
        }
      }
      this.winners_list_filter = results.SortedResults;
    }
  }

  searchWinnerItem(e: any): void {
    if (!e.target.value || e.target.value === '')
      this.query = undefined;
    else
      this.query = e.target.value;
  }

  pairWinnerPrize(prizes: Prize[]): void {
    this.winner_prize_list = [];
    for (let i = 0; i < this.current_winners_list.length; i++)
      for (let j = 0; j < this.current_winners_list[i].Prizes.length; j++)
        if (!this.current_winners_list[i].Prizes[j].handed)
          this.winner_prize_list.push({
            w: this.current_winners_list[i],
            p: prizes.find(prize => prize.Id === this.current_winners_list[i].Prizes[j].id),
            grantedDate: this.dateToString(this.current_winners_list[i].Prizes[j].granted)
          })
  }

  dateToString(date: number): string {
    let aux: Date = new Date(date);
    return aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getUTCFullYear();
  }

}