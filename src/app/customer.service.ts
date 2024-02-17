import { Injectable } from '@angular/core';
//Array
import { CustomerArray } from '../app/customer/customerarray';
import { ResepArray } from '../app/customer/reseparray';
//HTTP Response
//Tambahkan Response,Request,Header
import { Http,Response,RequestOptions,Headers } from '@angular/http';

//Tambahkan Obervable
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private items:CustomerArray[]=[];
  private items2:ResepArray[]=[];
  private url:string="http://localhost:8000/customer";
  constructor(public http: Http) { }
  showcustomer()
  {
    return this.http.get(this.url).pipe(
      map((response:Response)=>response.json())
    );
  }
  searchcustomer(item:CustomerArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.url+"/cari",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  savecustomer(item:CustomerArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.url,
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  editcustomer(item:CustomerArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this.url,
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  deletecustomer(item){
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(this.url + "/hapus/" + item.id,
                  options)
                 .pipe(map((response:Response)=>response.json()));
  }

  //Resep
  showresep(idcustomer)
  {
    return this.http.get(this.url + "/resep/" + idcustomer).pipe(
      map((response:Response)=>response.json())
    );
  }
  showreseptransaksi(id)
  {
    return this.http.get(this.url + "/reseptransaksi/" + id).pipe(
      map((response:Response)=>response.json())
    );
  }
  saveresep(item:ResepArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.url + "/resep",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  editresep(item:ResepArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this.url + "/resep",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  deleteresep(item){
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(this.url + "/resep/hapus/" + item.id,
                  options)
                 .pipe(map((response:Response)=>response.json()));
  }
}
