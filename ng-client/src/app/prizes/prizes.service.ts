import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from '../const.class';
import { Prize } from './prize.class';
import { Winner } from '../winners/winner.class';

import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PrizesService {

  prizes_source = new Subject<Prize[]>();
  prizes$ = this.prizes_source.asObservable();

  constructor(private http: Http, private notificationService: NotificationService) { }

  fetchPrizes(): void {
    this.http.get(`${Const.APIURL}api/prizes`, { withCredentials: true })
      .map(res => res.json().map(p => new Prize(p.id, p.type, p.sponsor, p.description, p.stock, p.periodic, p.note, p.set_date, p.update_date, p.due_date)))
      .subscribe(
      prizes => this.prizes_source.next(prizes),
      error => {
        console.log(error);
        this.notificationService.error("Error descargando los premios", error.json().details);
      }
      );
  }

  newPrize(prize: Prize): Observable<any> {
    return this.http.post(`${Const.APIURL}api/prizes`, this.newPrizeComposeParameters(prize), { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }
  newPrizeComposeParameters(prize: Prize): string {
    let params: string = `type=${prize.type}&sponsor=${prize.sponsor}&description=${prize.description}&periodic=${prize.periodic}`
    if (prize.stock) params += `&stock=${prize.stock}`;
    if (prize.due_date) params += `&due_date=${prize.StrDueDateToPost}`;
    if (prize.note) params += `&note=${prize.Note}`;
    return params;
  }

  editPrize(prize: Prize): Observable<any> {
    console.log('editPrize', prize);
    return this.http.post(`${Const.APIURL}api/prizes/edit`, this.editPrizeComposeParameters(prize), { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }
  editPrizeComposeParameters(prize: Prize): string {
    let params: string = `id=${prize.id}&type=${prize.type}&sponsor=${prize.sponsor}&description=${prize.description}&periodic=${prize.periodic}`;
    if (prize.stock) params += `&stock=${prize.stock}`;
    if (prize.due_date) params += `&due_date=${prize.StrDueDateToPost}`;
    if (prize.note) params += `&note=${prize.note}`;;
    return params;
  }

  grantPrize(prize: Prize, winner: Winner): Observable<any> {
    console.log(prize, winner)
    return this.http.post(`${Const.APIURL}api/grantprize`, this.grantPrizeComposeParameters(prize, winner), { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }
  grantPrizeComposeParameters(prize: Prize, winner: Winner): string {
    let params: string = `prize_id=${prize.Id}&ci=${winner.CiRaw}&name=${winner.name}&lastname=${winner.lastname}`;
    if (winner.facebook) params += `&facebook=${winner.facebook}`;
    if (winner.GenderRaw) params += `&gender=${winner.GenderRaw}`;
    if (winner.phone) params += `&phone=${winner.phone}`;
    if (winner.mail) params += `&mail=${winner.mail}`;
    return params;
  }

}
