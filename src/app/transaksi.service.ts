import { Injectable } from '@angular/core';
// Array
import { TransaksiArray } from '../app/transaksi/transaksiarray';
import { KeranjangArray } from '../app/transaksi/keranjangarray';
//HTTP Response
//Tambahkan Response,Request,Header
import { Http,Response,RequestOptions,Headers } from '@angular/http';

//Tambahkan Obervable
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransaksiService {
  isPrinting = false;
  private items:TransaksiArray[]=[];
  private cart:KeranjangArray[]=[];
  private url:string="http://localhost:8000/transaksi";
  private urlstore:string="https://honestly-certain-dingo.ngrok-free.app/api/print/suratorder/";
  private urlwa:string="http://103.31.39.135:3000/api/pemesanan";
  private idprofile = JSON.parse(localStorage.getItem("profileuser"))[0].profile.id;
  constructor(public http: Http) { 

  }
  //TRANSAKSI
  showtransaksi(jenis)
  {
    if(jenis=='suratorder'){
      return this.http.get(this.url + "/pesan/profile/"+ this.idprofile).pipe(
        map((response:Response)=>response.json())
      );
    }
    else{
      return this.http.get(this.url + "/" + jenis + "/profile/"+ this.idprofile).pipe(
        map((response:Response)=>response.json())
      );
    }
  }
  showdetailtransaksi(idtrans)
  {
    return this.http.get(this.url + "/view/" + idtrans).pipe(
      map((response:Response)=>response.json())
    );
  }
  showsuratorder(idtrans){
    return this.http.get(this.url + "/viewsuratorder/" + idtrans).pipe(
      map((response:Response)=>response.json())
    );
  }
  cetaksuratorder(item){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: false });
    return this.http.post(this.urlstore,
                  body,options)
                 .pipe(map((response:Response)=>response.json()));
  }
  kirimwaorder(item){
    console.log(item);
    let body = JSON.stringify(item);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: false });
    return this.http.post(this.urlwa,
                  body,options)
                 .pipe(map((response:Response)=>response.json()));
  }
  searchtransaksi(item:TransaksiArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.url+"/cari",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  savetransaksi(item:TransaksiArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.url,
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  updatetransaksi(item:TransaksiArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.patch(this.url,
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  deletetransaksi(item){
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(this.url + "/hapus/" + item.id,
                  options)
                 .pipe(map((response:Response)=>response.json()));
  }
  lunastransaksi(item:TransaksiArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this.url+"/lunas",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  bataltransaksi(item:TransaksiArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this.url+"/batal",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  //KERANJANG
  showkeranjang(idkaryawan,jenis)
  {
    return this.http.get(this.url + "/keranjang/" + idkaryawan + "/jenis/" + jenis).pipe(
      map((response:Response)=>response.json())
    );
  }
  savekeranjang(item:KeranjangArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.url+"/keranjang",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  editkeranjang(item:KeranjangArray){
    let body = JSON.stringify(item);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this.url+"/keranjang",
                  body, options)
                 .pipe(map((response:Response)=>response.json()));
  }
  deletekeranjang(item){
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(this.url + "/keranjang/hapus/" + item.id,
                  options)
                 .pipe(map((response:Response)=>response.json()));
  }
}
