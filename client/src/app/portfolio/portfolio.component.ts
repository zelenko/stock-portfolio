import { Component, OnInit, Input } from '@angular/core';
import { Portfolio } from '../portfolio';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {
  @Input() one: Portfolio // = new Symbol();
  constructor() { };
  list = this.getData("http://localhost:8080/portfolio/");

  displayedColumns: string[] = ['name', 'qty', 'price', 'more'];
  dataSource = this.list;

  ngOnInit() {
  }

  getData(url: string): any {
    window.fetch(url, { method: 'GET', cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(response => response.json())
      .then(response => this.list = response)
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
  }

  delete(id: any){
    var url = "http://localhost:8080/portfolio/"+id;
    window.fetch(url, { method: 'DELETE', cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(() =>{this.list = this.getData("http://localhost:8080/portfolio/")})
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
  }

  edit(id: any){
    for (let item of this.list) {
      if (item.id == id){
        this.one = item;
      }
    }
  }

  savePortfolioItem(){
    var url = `id=${this.one.id}&name=${this.one.name}&qty=${this.one.qty}&price=${this.one.price}`;
    window.fetch("http://localhost:8080/portfolio/", { method: 'PUT', body: url, cache: "no-cache", headers: { "Content-type": "application/x-www-form-urlencoded" } })
      .then(response => response.text())
      //.then(response => window.alert("UPDATED: " + response))
      .then(() =>{this.list = this.getData("http://localhost:8080/portfolio/")})
      //.then(() =>{this.list = this.save("http://localhost:8080/symbol/")})
      .catch(function (error) {
        console.log('fetch error: ', error.message);
      });
    this.one = null;
  }

}
