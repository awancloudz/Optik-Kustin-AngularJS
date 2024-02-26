import { Component, OnInit } from '@angular/core';
//Service
import { CustomerService } from '../customer.service';
//Array
import { CustomerArray } from '../customer/customerarray';
import { ResepArray } from '../customer/reseparray';


import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertsService} from '@jaspero/ng-alerts';
import { formatDate,DatePipe } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  items:CustomerArray[]=[];
  id:any;
  kodecustomer:String;
  nama:String;
  alamat:String;
  notelp:String;
  umur:String;
  jeniskelamin:String;
  jenis:String;
  txtcari:String;
  tombol:String;
  tanggallahir:String;
  customerForm: FormGroup;
  submitted = false;

  AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 2000
  };
  constructor(private datePipe: DatePipe,public route:ActivatedRoute, public router:Router,public customerservice:CustomerService,
    private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService) { 

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.customerForm = this.formBuilder.group({
      nama: ['', Validators.required],
      alamat: ['', Validators.required],
      notelp: ['', [Validators.required]],
      tanggallahir: ['', [Validators.nullValidator]],
      umur: ['', [Validators.nullValidator]],
      jeniskelamin: ['', [Validators.nullValidator]]
    });
    this.spinner.show();
    this.customerservice.showcustomer().subscribe(
      //Jika data sudah berhasil di load
      (data:CustomerArray[])=>{
        this.items=data;
        this.spinner.hide();
      },
      //Jika Error
      function (error){   
        this.spinner.hide();
      },
      //Tutup Loading
      function(){
      }
    );
    this.tanggallahir = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    this.simpan();
  }

  cari(){
    //this.spinner.show();
    this.customerservice.searchcustomer(new CustomerArray(this.id,this.kodecustomer,this.txtcari,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur, this.jeniskelamin)).subscribe(
      //Jika data sudah berhasil di load
      (data:CustomerArray[])=>{
        this.items=data;
        //this.spinner.hide();
      },
      //Jika Error
      function (error){   
      },
      //Tutup Loading
      function(){
      }
    );
  }

  simpan(){
    this.spinner.show();
    this.jenis = "customer";
    if(this.tombol == "tambah"){
      this.customerservice.savecustomer(new CustomerArray(this.id,this.kodecustomer,this.nama,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur,this.jeniskelamin))
      .subscribe(
        (data:CustomerArray[])=>{
          this.open('success','Data Customer','Simpan Data Sukses!');
          this.spinner.hide();
          this.ngOnInit();
        },
        function(error){
          this.open('error','Data Customer','Simpan Data Gagal!');
          this.spinner.hide();
        },
        function(){
  
        }
      );
    }
    else if(this.tombol == "edit"){
      this.customerservice.editcustomer(new CustomerArray(this.id,this.kodecustomer,this.nama,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur,this.jeniskelamin))
      .subscribe(
        (data:CustomerArray[])=>{
          this.open('success','Data Customer','Edit Data Sukses!');
          this.spinner.hide();
          this.ngOnInit();
        },
        function(error){
          this.open('error','Data Customer','Edit Data Gagal!');
          this.spinner.hide();
        },
        function(){
  
        }
      );
    }
    this.kosongfield();
    $('#responsive-modal').modal('hide');
  }

  kosongfield(){
    this.id = '';
    this.nama = '';
    this.alamat = '';
    this.notelp = '';
  }

  tambah(){
    $('#responsive-modal').modal('show');
    this.tombol = "tambah";
    this.kosongfield();
    this.hitungumur();
    this.jeniskelamin = "0";
  }

  hitungumur(){
    function hitungUmur(tanggalLahir: Date): string {
      const sekarang = new Date();
      const tahunSekarang = sekarang.getFullYear();
      const bulanSekarang = sekarang.getMonth() + 1;
      const hariSekarang = sekarang.getDate();
  
      const tahunLahir = tanggalLahir.getFullYear();
      const bulanLahir = tanggalLahir.getMonth() + 1;
      const hariLahir = tanggalLahir.getDate();
  
      let umurTahun = tahunSekarang - tahunLahir;
      let umurBulan = bulanSekarang - bulanLahir;
      let umurHari = hariSekarang - hariLahir;
  
      if (umurBulan < 0 || (umurBulan === 0 && umurHari < 0)) {
          umurTahun--;
          umurBulan += 12;
      }
  
      if (umurHari < 0) {
          const bulanSebelumnya = bulanSekarang === 1 ? 12 : bulanSekarang - 1;
          const tahunSebelumnya = bulanSekarang === 1 ? tahunSekarang - 1 : tahunSekarang;
          const hariBulanSebelumnya = new Date(tahunSebelumnya, bulanSebelumnya, 0).getDate();
          umurHari += hariBulanSebelumnya;
          umurBulan--;
      }
  
      return `${umurTahun} tahun ${umurBulan} bulan ${umurHari} hari`;
    }
  
    function convertStringToDate(dateString: String): Date {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
  
    const tgllahir = convertStringToDate(this.tanggallahir);
    this.umur = hitungUmur(tgllahir);
  }
  edit(item){
    setTimeout(() => {
      this.id = item.id;
      this.nama = item.nama;
      this.alamat = item.alamat;
      this.notelp = item.notelp;
      this.tanggallahir = this.datePipe.transform(item.tanggallahir, 'yyyy-MM-dd');
      this.hitungumur();
      this.jeniskelamin = item.jeniskelamin;
      this.tombol = "edit";
      $('#responsive-modal').modal('show');
    },500);
  }

  hapus(item){
    /**/
    let konfirmasi = confirm("Anda yakin menghapus data?");
    if(konfirmasi == true){
      this.spinner.show();
      this.customerservice.deletecustomer(item).subscribe(
        //Jika data sudah berhasil di load
        (data:any)=>{
          this.open('success','Data Customer','Hapus Data Sukses!');
          this.spinner.hide();
          this.ngOnInit();
        },
        //Jika Error
        function (error){   
        },
        //Tutup Loading
        function(){
        }
      );
    } 
  }

  open(type,judul,pesan) {
    this._alert.create(type, judul, pesan, this.AlertSettings);
  }

}

@Component({
  selector: 'app-customer',
  templateUrl: './customer-resep.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerResepComponent implements OnInit {
  items:ResepArray[]=[];
  id:any;
  id_customer:Number;
  r_sph:Number; 
  l_sph:Number; 
  r_cyl:Number; 
  l_cyl:Number; 
  r_axs:Number; 
  l_axs:Number;
  r_add:Number; 
  l_add:Number; 
  pd:Number; 
  visakhir:Number;
  A:Number; 
  B:Number; 
  dbl:Number;
  r_mpd:Number;
  l_mpd:Number; 
  shpv:Number; 
  jenisframe:String;
  koridor:String;
  visusbalance:String;
  dukeelder:String;
  wrapangle:String;
  pantoskopik:String;
  vertexdistance:String;
  catatan:String;
  tombol:String;

  AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 2000
  };

  constructor(public route:ActivatedRoute, public router:Router,public customerservice:CustomerService,
    private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService){

  }

  ngOnInit(){
    window.scrollTo(0, 0);
    this.spinner.show();
    this.id_customer = Number(this.route.snapshot.paramMap.get('id'));
    this.customerservice.showresep(this.id_customer).subscribe(
      //Jika data sudah berhasil di load
      (data:ResepArray[])=>{
        this.items=data;
        this.spinner.hide();
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
  
  kosongfield(){
    this.id = '';
    this.r_sph = 0;
    this.l_sph = 0;
    this.r_cyl = 0;
    this.l_cyl = 0;
    this.r_axs = 0;
    this.l_axs = 0;
    this.r_add = 0;
    this.l_add = 0;
    this.pd = 0;
    this.visakhir = 0;
    this.A = 0;
    this.B = 0;
    this.dbl = 0;
    this.r_mpd = 0;
    this.l_mpd = 0;
    this.shpv = 0;
    this.jenisframe = '';
    this.koridor = '';
    this.visusbalance = '';
    this.dukeelder = '';
    this.wrapangle = '';
    this.pantoskopik = '';
    this.vertexdistance = '';
    this.catatan = '';
  }

  tambah(){
    $('#responsive-modal').modal('show');
    this.tombol = "tambah";
    this.kosongfield();
  }

  inputpd(){
    this.pd = Number(this.r_mpd) + Number(this.l_mpd);
  }

  simpan(){
    this.spinner.show();
    if(this.tombol == "tambah"){
      this.customerservice.saveresep(new ResepArray(this.id,this.id_customer,this.r_sph,this.l_sph,this.r_cyl,this.l_cyl,this.r_axs,this.l_axs,this.r_add,this.l_add,this.pd,this.visakhir,this.A,this.B,this.dbl,this.r_mpd,this.l_mpd,this.shpv,this.jenisframe,this.koridor,this.visusbalance,this.dukeelder,this.wrapangle,this.pantoskopik,this.vertexdistance,this.catatan))
      .subscribe(
        (data:ResepArray[])=>{
          console.log(data);
          this.open('success','Data Resep','Simpan Data Sukses!');
          this.spinner.hide();
          this.ngOnInit();
        },
        function(error){
          this.open('error','Data Resep','Simpan Data Gagal!');
          this.spinner.hide();
        },
        function(){
  
        }
      );
    }
    else if(this.tombol == "edit"){
      this.customerservice.editresep(new ResepArray(this.id,this.id_customer,this.r_sph,this.l_sph,this.r_cyl,this.l_cyl,this.r_axs,this.l_axs,this.r_add,this.l_add,this.pd,this.visakhir,this.A,this.B,this.dbl,this.r_mpd,this.l_mpd,this.shpv,this.jenisframe,this.koridor,this.visusbalance,this.dukeelder,this.wrapangle,this.pantoskopik,this.vertexdistance,this.catatan))
      .subscribe(
        (data:ResepArray[])=>{
          this.open('success','Data Resep','Edit Data Sukses!');
          this.spinner.hide();
          this.ngOnInit();
        },
        function(error){
          this.open('error','Data Resep','Edit Data Gagal!');
          this.spinner.hide();
        },
        function(){
  
        }
      );
    }
    this.kosongfield();
    $('#responsive-modal').modal('hide');
  }

  edit(item){
    setTimeout(() => {
      this.id = item.id;
      this.id_customer = item.id_customer;
      this.r_sph = item.r_sph;
      this.l_sph = item.l_sph;
      this.r_cyl = item.r_cyl;
      this.l_cyl = item.l_cyl;
      this.r_axs = item.r_axs;
      this.l_axs = item.l_axs;
      this.r_add = item.r_add;
      this.l_add = item.l_add;
      this.pd = item.pd;
      this.visakhir = item.visakhir;
      this.A = item.A;
      this.B = item.B;
      this.dbl = item.dbl;
      this.r_mpd = item.r_mpd;
      this.l_mpd = item.l_mpd;
      this.shpv = item.shpv;
      this.jenisframe = item.jenisframe;
      this.koridor = item.koridor;
      this.visusbalance = item.visusbalance;
      this.dukeelder = item.dukeelder;
      this.wrapangle = item.wrapangle;
      this.pantoskopik = item.pantoskopik;
      this.vertexdistance = item.vertexdistance;
      this.catatan = item.catatan;
      this.tombol = "edit";
      $('#responsive-modal').modal('show');
    },500);
  }

  hapus(item){
    /**/
    let konfirmasi = confirm("Anda yakin menghapus data?");
    if(konfirmasi == true){
      this.spinner.show();
      this.customerservice.deleteresep(item).subscribe(
        //Jika data sudah berhasil di load
        (data:any)=>{
          this.open('success','Data Resep','Hapus Data Sukses!');
          this.spinner.hide();
          this.ngOnInit();
        },
        //Jika Error
        function (error){   
        },
        //Tutup Loading
        function(){
        }
      );
    } 
  }

  open(type,judul,pesan) {
    this._alert.create(type, judul, pesan, this.AlertSettings);
  }
}
