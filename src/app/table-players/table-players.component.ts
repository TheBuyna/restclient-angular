import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

import { trigger, state, style, animate, transition, stagger, query, keyframes} from '@angular/animations';


@Component({
  selector: 'app-table-players',
  templateUrl: './table-players.component.html',
  styleUrls: ['./table-players.component.scss'],
  animations: [
    trigger('fadeIn', [
      /**
       * Animation gebeurt bij elke transition
       */
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('100ms', [
          animate('.5s ease-in', keyframes([
            style({opacity: 0}),
            style({opacity: 1}),
          ]))]), {optional: true})
      ])
    ])
  ]
})
export class TablePlayersComponent implements OnInit {
  /**
   * Cnstant variable voor het API adres
   */
  SERVER_URL = "http://localhost/restapi/speler";
  // addSpelerForm: FormGroup;
  spelers: any;
  EditRowID: any = '';
  // private spelersObservable: Observable<any>;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    /**
     * Bij elke initialisatie de 'GET' request doen
     */
    this.getRequest();
    // this.spelersObservable = this.http.get(this.SERVER_URL);
  }

  ngOnInit() {
  }

  /**
   * GET request in een methode
   */
  getRequest() {
    this.http.get(this.SERVER_URL).subscribe((resultaat) => {
      console.log(JSON.stringify(resultaat));
      this.spelers = resultaat;
    });
  }

  /**
   * Voeg een speler aan de tabel, met ngModel
   * @param input 
   */
  addSpeler(input: string) {
    const formData = new FormData();
    formData.append('speler_naam', input);

    /**
     * 'POST' methode met FormData
     */
    this.http.post<any>(this.SERVER_URL, formData).subscribe(
      (res) => {
        console.log(res);
        this.spelers = res;
      },
      (err) => console.log(err)
    );
  }

  /**
   * Reset form ingevoerde form
   * @param spelerForm
   */
  resetSpelerForm(spelerForm: NgForm) {
    spelerForm.resetForm();
  }

  /**
   * Krijg de row id om te editen
   * @param val
   */
  editRow(val) {
    this.EditRowID = val;
  }

  /**
   * Sla het nieuwe gegeven op de tabel
   * @param spe_id
   * @param spe_naam
   */
  saveEdit(spe_id, spe_naam) {
    let updateJson = { 
      "id" : spe_id,
      "speler_naam" : spe_naam
    };
    /**
     * 'PUT' request
     */
    this.http.put(this.SERVER_URL, JSON.stringify(updateJson) , { headers: { 'Content-Type': 'application/json' } }).subscribe(
      (res) => {
        console.log(res);
        this.spelers = res;
      },
      (err) => console.log(err)
    );

    this.EditRowID = "";
  }

  /**
   * Verwijder speler met ingevoerde gegevens
   * @param spe_id
   * @param spe_naam
   */
  deleteSpeler(spe_id, spe_naam){
    let deleteJson = { 
      "id" : spe_id,
      "speler_naam" : spe_naam
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: deleteJson
    };

    /**
     * 'DELETE' request
     */
    this.http.delete(this.SERVER_URL, httpOptions).subscribe(
      (res) => {
        console.log(res);
        this.spelers = res;
      },
      (err) => console.log(err)
    );

    /**
     * Na de request, refresh de tabel met 'GET' request
     */
    this.getRequest();
  }
}
