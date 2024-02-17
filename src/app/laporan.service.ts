import { Injectable } from '@angular/core';
// Array
import { LaporanArray } from '../app/laporan/laporanarray';
//HTTP Response
//Tambahkan Response,Request,Header
import { Http,Response,RequestOptions,Headers } from '@angular/http';

//Tambahkan Obervable
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LaporanService {
  private items:LaporanArray[]=[];
  private url:string="http://localhost:8000/laporan";
  constructor(public http: Http) { 

  }
  showlaporan(jenis,profile,awal,akhir,status,statustransaksi)
  {
    return this.http.get(this.url + "/" + jenis + "/profile/"+ profile + "/awal/" + awal + "/akhir/" + akhir + "/status/" + status + "/ambil/" + statustransaksi).pipe(
      map((response:Response)=>response.json())
    );
  }
}
