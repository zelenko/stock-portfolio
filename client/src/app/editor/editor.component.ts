import { Component, OnInit, Input } from '@angular/core';
import { Symbol } from '../symbol';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  @Input() one: Symbol = new Symbol();
  list = this.getData("http://localhost:8080/symbol/");

  displayedColumns: string[] = ['name', 'open', 'high', 'low', 'close', 'more'];
  dataSource = this.list;

  constructor() { }

  ngOnInit() {
  }

  edit(id: any) {
    for (let item of this.list) {
      if (item.id == id) {
        this.one = item;
      }
    }
  }

  log(msg: any) {
    console.log(new Date() + ": "
      + JSON.stringify(msg));
  }

  delete(id: any) {
    var url = "http://localhost:8080/symbol/" + id;
    window.fetch(url, { method: 'DELETE', cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(() => { this.list = this.getData("http://localhost:8080/symbol/") })
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
  }

  buy(name: any, price: any) {
    var url = "http://localhost:8080/portfolio/";
    var body = `name=${name}&qty=1&price=${price}`;
    window.fetch(url, { method: 'POST', body: body, cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
  }

  getData(url: string): any {
    window.fetch(url, { method: 'GET', cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(response => response.json())
      .then(response => this.list = response)
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
  }

  create(): void {
    var url = `name=${this.one.name}&open=${this.one.open}&high=${this.one.high}&low=${this.one.low}&close=${this.one.close}`;
    window.fetch("http://localhost:8080/symbol/", { method: 'POST', body: url, cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(() => { this.list = this.getData("http://localhost:8080/symbol/") })
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
    this.one = new Symbol();
  }

  saveSymbol() {
    var url = `id=${this.one.id}&name=${this.one.name}&open=${this.one.open}&high=${this.one.high}&low=${this.one.low}&close=${this.one.close}`;
    window.fetch("http://localhost:8080/symbol/", { method: 'PUT', body: url, cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(() => { this.list = this.getData("http://localhost:8080/symbol/") })
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
    this.one = new Symbol();
  }

}
