import { Component, OnInit } from '@angular/core';
import { formatDate,DatePipe } from '@angular/common';

import { CabangService } from '../cabang.service';
import { LaporanService } from '../laporan.service';
import { CabangArray } from '../cabang/cabangarray';
import { LaporanArray } from '../laporan/laporanarray';
import { PenggunaArray } from '../pengguna/penggunaarray';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertsService } from '@jaspero/ng-alerts';
import { HomeComponent, HomeNotfoundComponent } from '../home/home.component';
import { DistributorComponent } from '../distributor/distributor.component';
import { CustomerComponent, CustomerResepComponent } from '../customer/customer.component';
import { KategoriProdukComponent } from '../kategori-produk/kategori-produk.component';
import { MerkComponent } from '../merk/merk.component';
import { KaryawanComponent } from '../karyawan/karyawan.component';
import { StokPusatComponent } from '../stok-pusat/stok-pusat.component';
import { PenggunaComponent } from '../pengguna/pengguna.component';
import { CabangComponent, CabangStokComponent, CabangTransaksiComponent, CabangUtamaComponent } from '../cabang/cabang.component';
import { TransaksiComponent, TransaksiViewComponent, TransaksiAddComponent } from '../transaksi/transaksi.component';

declare var $:any;

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.component.html',
  styleUrls: ['./laporan.component.css']
})
export class LaporanComponent implements OnInit {
  cabang:CabangArray[]=[];
  items:LaporanArray[]=[];
  pengguna:PenggunaArray[]=[];
  id_cabang:Number;
  level:any;
  jenis:any;
  periode:any;
  status:any;
  statustransaksi:any;
  metode:String;
  omzet:any;
  cash:any;
  debit:any;
  awalbulan;
  akhirbulan;
  awalbulanlalu;
  akhirbulanlalu;
  hariini;
  kemarin;
  seminggu;
  tanggalmulai; 
  tanggalselesai; 
  constructor(public route:ActivatedRoute, public router:Router,private datePipe: DatePipe, public cabangservice:CabangService,
    public laporanservice:LaporanService,private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService) { }

  ngOnInit() {
    $('#print-section').hide();
    this.jenis = this.route.snapshot.paramMap.get('jenis');

    //Variabel Tanggal
    var dt = new Date();
    var day = dt.getDate(), month = dt.getMonth(), year = dt.getFullYear();
    this.awalbulan = new Date(year, month, 1);
    this.akhirbulan = new Date(year, month + 1, 0);
    this.awalbulanlalu = new Date(year, month - 1, 1);
    this.akhirbulanlalu = new Date(year, month - 1, 0);
    this.hariini = new Date();
    this.kemarin = new Date(year, month, day - 1);
    this.seminggu = new Date(year, month, day - 7);

    //Set Tanggal Custom
    this.tanggalmulai = this.datePipe.transform(this.awalbulan, 'yyyy-MM-dd');
    this.tanggalselesai = this.datePipe.transform(this.akhirbulan, 'yyyy-MM-dd');
    
    //Tampil Cabang
    this.cabangservice.showcabang().subscribe(
      //Jika data sudah berhasil di load
      (data:CabangArray[])=>{
        this.cabang=data;
        // this.id_cabang = 0;
        // if(data.length > 0){
        //   this.id_cabang = data[0].id;
        // }
      },
      //Jika Error
      function (error){   
        this.spinner.hide();
      },
      //Tutup Loading
      function(){
      }
    );
    
    this.status = 'lunas';
    this.statustransaksi = 'sudah';
    this.pengguna = JSON.parse(localStorage.getItem("profileuser"));
    if(this.pengguna.length > 0){
      this.level = this.pengguna[0].level;
      if(this.level == 'admin'){
        this.periode = 4;
        this.id_cabang = 0;
      }
      else if(this.level == 'sales'){
        this.periode = 1;
        this.id_cabang = this.pengguna[0].id_profile;
      }
    }
    this.tampilperiode();

    this.router.resetConfig(
      [
        { path: 'home', component: HomeComponent },
        { path: '',
          redirectTo: '/home',
          pathMatch: 'full'
        },
        { path: 'distributor', component: DistributorComponent },
        { path: 'customer', component: CustomerComponent },
        { path: 'customer/resep/:id', component: CustomerResepComponent },
        { path: 'kategoriproduk', component: KategoriProdukComponent },
        { path: 'merk', component: MerkComponent },
        { path: 'karyawan', component: KaryawanComponent },
        { path: 'produk/kategori/:id', component: StokPusatComponent },
        { path: 'pengguna', component: PenggunaComponent },
        { path: 'cabang', component: CabangComponent },
        { path: 'cabang/stok/:id', component: CabangStokComponent },
        { path: 'cabang/transaksi/:id', component: CabangTransaksiComponent },
        { path: 'profile', component: CabangUtamaComponent },
        { path: 'transaksi/:jenis', component: TransaksiComponent},
        { path: 'transaksi/view/:idtrans', component: TransaksiViewComponent},
        { path: 'transaksi/add/:jenis', component: TransaksiAddComponent},
        { path: 'notfound', component: HomeNotfoundComponent },
        { path: 'laporan/:jenis', component: LaporanComponent},
      ]
    );
  }

  tampilperiode(){
    if(this.periode == 1){
      this.tanggalmulai = this.datePipe.transform(this.hariini, 'yyyy-MM-dd');
      this.tanggalselesai = this.datePipe.transform(this.hariini, 'yyyy-MM-dd');
    }
    else if(this.periode == 2){
      this.tanggalmulai = this.datePipe.transform(this.kemarin, 'yyyy-MM-dd');
      this.tanggalselesai = this.datePipe.transform(this.hariini, 'yyyy-MM-dd');
    }
    else if(this.periode == 3){
      this.tanggalmulai = this.datePipe.transform(this.seminggu, 'yyyy-MM-dd');
      this.tanggalselesai = this.datePipe.transform(this.hariini, 'yyyy-MM-dd');
    }
    else if(this.periode == 4){
      this.tanggalmulai = this.datePipe.transform(this.awalbulan, 'yyyy-MM-dd');
      this.tanggalselesai = this.datePipe.transform(this.akhirbulan, 'yyyy-MM-dd');
    }
    else if(this.periode == 5){
      this.tanggalmulai = this.datePipe.transform(this.awalbulanlalu, 'yyyy-MM-dd');
      this.tanggalselesai = this.datePipe.transform(this.akhirbulanlalu, 'yyyy-MM-dd');
    }

    this.laporanservice.showlaporan(this.jenis,this.id_cabang,this.tanggalmulai,this.tanggalselesai,this.status,this.statustransaksi).subscribe(
      //Jika data sudah berhasil di load
      (data:LaporanArray[])=>{
        this.items=data;
        this.omzet = 0;
        this.cash = 0;
        this.debit = 0;
        for(var key in data){
          if(data[key].statustransaksi != "batal"){
            this.omzet = this.omzet + Number(data[key].bayar);
            if(data[key].metode == "cash"){
              this.cash = this.cash + Number(data[key].bayar);
            }
            if(data[key].metode == "debit"){
              this.debit = this.debit + Number(data[key].bayar);
            }
          }
        }
      },
      //Jika Error
      function (error){   
        this.spinner.hide();
      },
      //Tutup Loading
      function(){
      }
    );
  }

  tampilcustom(){
    this.laporanservice.showlaporan(this.jenis,this.id_cabang,this.tanggalmulai,this.tanggalselesai,this.status,this.statustransaksi).subscribe(
      //Jika data sudah berhasil di load
      (data:LaporanArray[])=>{
        this.items=data;
        this.omzet = 0;
        this.cash = 0;
        this.debit = 0;
        for(var key in data){
          if(data[key].statustransaksi != "batal"){
            this.omzet = this.omzet + Number(data[key].bayar);
            if(data[key].metode == "cash"){
              this.cash = this.cash + Number(data[key].bayar);
            }
            if(data[key].metode == "debit"){
              this.debit = this.debit + Number(data[key].bayar);
            }
          }
        }
      },
      //Jika Error
      function (error){   
        this.spinner.hide();
      },
      //Tutup Loading
      function(){
      }
    );
  }
}
