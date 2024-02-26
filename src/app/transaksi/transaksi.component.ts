import { Component, OnInit } from '@angular/core';
import { formatDate,DatePipe } from '@angular/common';

//Service
import { TransaksiService } from '../transaksi.service';
import { KaryawanService } from '../karyawan.service';
import { CustomerService } from '../customer.service';
import { DistributorService } from '../distributor.service';
import { CabangService } from '../cabang.service';
import { StokPusatService } from '../stok-pusat.service';

//Array
import { TransaksiArray } from '../transaksi/transaksiarray';
import { KeranjangArray } from '../transaksi/keranjangarray';
import { PenggunaArray } from '../pengguna/penggunaarray';
import { KaryawanArray } from '../karyawan/karyawanarray';
import { CustomerArray } from '../customer/customerarray';
import { CabangArray } from '../cabang/cabangarray';
import { StokPusatArray } from '../stok-pusat/stok-pusatarray';
import { ResepArray } from '../customer/reseparray';


import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertsService } from '@jaspero/ng-alerts';

import { DistributorComponent } from '../distributor/distributor.component';
import { HomeComponent, HomeNotfoundComponent } from '../home/home.component';
import { KategoriProdukComponent } from '../kategori-produk/kategori-produk.component';
import { KaryawanComponent } from '../karyawan/karyawan.component';
import { StokPusatComponent } from '../stok-pusat/stok-pusat.component';
import { CustomerComponent, CustomerResepComponent } from '../customer/customer.component';
import { MerkComponent } from '../merk/merk.component';
import { PenggunaComponent } from '../pengguna/pengguna.component';
import { CabangComponent, CabangUtamaComponent, CabangStokComponent, CabangTransaksiComponent } from '../cabang/cabang.component';
import { LaporanComponent } from '../laporan/laporan.component';

declare var $:any;

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.css'],
})
export class TransaksiComponent implements OnInit {
  items:TransaksiArray[]=[];
  pengguna:PenggunaArray[]=[];
  level:String;
  jenis:any;
  id:Number; 
  kodetransaksi:String; 
  jenistransaksi:String; 
  tanggaltransaksi:String;
  jamtransaksi:String; 
  tanggalselesai:String; 
  jamselesai:String; 
  id_customer:Number;
  id_profile:Number; 
  id_karyawan:Number; 
  totaldiskon:Number; 
  totalbelanja:Number;
  asuransi:Number; 
  subtotal:Number; 
  bayar:Number; 
  kembali:Number; 
  sisa:Number;
  catatan:String; 
  status:String; 
  statustoko:String;
  statustransaksi:String;
  statusresep:Number;
  metode:String;
  txtcari:String;
  AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 2000
  };
  constructor(public route:ActivatedRoute, public router:Router,public transaksiservice:TransaksiService,
    private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService) { 
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.spinner.show();
    this.jenis = this.route.snapshot.paramMap.get('jenis');
    this.pengguna = JSON.parse(localStorage.getItem("profileuser"));
    if(this.pengguna.length > 0){
      this.level = this.pengguna[0].level;
      this.id_profile = this.pengguna[0].id_profile;
    }
    if(this.level == 'admin'){
      this.tampiltransaksi();
    }
    else if((this.level == 'sales') && ((this.jenis == 'pesan') || (this.jenis == 'grosir') || (this.jenis == 'retail') || (this.jenis == 'suratorder'))){
      this.tampiltransaksi();
    }
    else{
      this.router.navigateByUrl('notfound');
    }
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
        { path: 'transaksi/so/:jenis/:idtrans', component: TransaksiSOComponent},
        { path: 'transaksi/add/:jenis', component: TransaksiAddComponent},
        { path: 'notfound', component: HomeNotfoundComponent },
        { path: 'laporan/:jenis', component: LaporanComponent},
      ]
    );
  }

  tampiltransaksi(){
    this.transaksiservice.showtransaksi(this.jenis).subscribe(
      //Jika data sudah berhasil di load
      (data:TransaksiArray[])=>{
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

  cari(){
    //this.spinner.show();
    if(this.jenis == 'suratorder'){
      var jenisso = 'pesan';
      this.transaksiservice.searchtransaksi(new TransaksiArray(this.id,this.txtcari,jenisso,this.tanggaltransaksi,this.jamtransaksi,this.tanggalselesai,this.jamselesai,this.id_customer,this.id_profile,this.id_karyawan,this.totaldiskon,this.totalbelanja,this.asuransi,this.subtotal,this.bayar,this.kembali,this.sisa,this.catatan,this.status,this.statustoko,this.statustransaksi,this.statusresep,this.metode)).subscribe(
        //Jika data sudah berhasil di load
        (data:TransaksiArray[])=>{
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
    else{
      this.transaksiservice.searchtransaksi(new TransaksiArray(this.id,this.txtcari,this.jenis,this.tanggaltransaksi,this.jamtransaksi,this.tanggalselesai,this.jamselesai,this.id_customer,this.id_profile,this.id_karyawan,this.totaldiskon,this.totalbelanja,this.asuransi,this.subtotal,this.bayar,this.kembali,this.sisa,this.catatan,this.status,this.statustoko,this.statustransaksi,this.statusresep,this.metode)).subscribe(
        //Jika data sudah berhasil di load
        (data:TransaksiArray[])=>{
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
  }

  hapus(item){
    let konfirmasi = confirm("Anda yakin menghapus data?");
    if(konfirmasi == true){
      this.spinner.show();
      this.transaksiservice.deletetransaksi(item).subscribe(
        //Jika data sudah berhasil di load
        (data:any)=>{
          this.open('success','Transaksi','Hapus Transaksi Sukses!');
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

  lunas(item){
    let konfirmasi = confirm("Konfirmasi pengambilan, klik OK untuk melanjutkan.");
    if(konfirmasi == true){
      this.spinner.show();
      this.transaksiservice.lunastransaksi(new TransaksiArray(item.id,item.kodetransaksi,item.jenis,item.tanggaltransaksi,item.jamtransaksi,item.tanggalselesai,item.jamselesai,item.id_customer,item.id_profile,item.id_karyawan,item.totaldiskon,item.totalbelanja,item.asuransi,item.subtotal,item.bayar,item.kembali,item.sisa,item.catatan,item.status,item.statustoko,item.statustransaksi,this.statusresep,this.metode)).subscribe(
        //Jika data sudah berhasil di load
        (data:TransaksiArray[])=>{
          this.open('success','Transaksi','Transaksi Selesai!');
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

  batal(item){
    let konfirmasi = confirm("Konfirmasi pembatalan transaksi, klik OK untuk melanjutkan.");
    if(konfirmasi == true){
      this.spinner.show();
      this.transaksiservice.bataltransaksi(new TransaksiArray(item.id,item.kodetransaksi,item.jenis,item.tanggaltransaksi,item.jamtransaksi,item.tanggalselesai,item.jamselesai,item.id_customer,item.id_profile,item.id_karyawan,item.totaldiskon,item.totalbelanja,item.asuransi,item.subtotal,item.bayar,item.kembali,item.sisa,item.catatan,item.status,item.statustoko,item.statustransaksi,item.statusresep,this.metode)).subscribe(
        //Jika data sudah berhasil di load
        (data:TransaksiArray[])=>{
          this.open('success','Transaksi','Transaksi Dibatalkan!');
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

  cetakstruk(id){
    this.transaksiservice.showsuratorder(id).subscribe(
      //Jika data sudah berhasil di load
      (data:TransaksiArray[])=>{
        //kirim request ke printer server
        this.transaksiservice.cetaksuratorder(data)
        .subscribe(
          (data)=>{
            console.log(data);
            this.open('success','Data Transaksi','Cetak Sukses!');
            this.spinner.hide();
            setTimeout(() => {
              this.router.navigateByUrl('transaksi/suratorder');
            },3000);
          },
          function(error){
            this.open('error','Data Transaksi','Cetak Gagal!');
            this.spinner.hide();
          },
          function(){}
        );
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
  kirimwa(id){
    this.transaksiservice.showsuratorder(id).subscribe(
      //Jika data sudah berhasil di load
      (data:TransaksiArray[])=>{
        //kirim request ke printer server
        this.transaksiservice.kirimwaorder(data)
        .subscribe(
          (data)=>{
            console.log(data);
            this.open('success','Data Transaksi','Cetak Sukses!');
            this.spinner.hide();
            setTimeout(() => {
              this.router.navigateByUrl('transaksi/'+this.jenis);
            },3000);
          },
          function(error){
            this.open('error','Data Transaksi','Cetak Gagal!');
            this.spinner.hide();
          },
          function(){}
        );
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

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi-view.component.html',
  styleUrls: ['./transaksi.component.css'],
})
export class TransaksiViewComponent implements OnInit {
  items:TransaksiArray[]=[];
  resep:ResepArray[]=[];
  statusresep:Number;
  metode:String;
  AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 2000
  };
  constructor(public route:ActivatedRoute, public router:Router,public transaksiservice:TransaksiService, public customerservice:CustomerService,
    private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService){

  }

  ngOnInit(){
    window.scrollTo(0, 0);
    this.spinner.show();
    var idtrans = this.route.snapshot.paramMap.get('idtrans');
    this.transaksiservice.showdetailtransaksi(idtrans).subscribe(
      //Jika data sudah berhasil di load
      (data:TransaksiArray[])=>{
        this.items=data;
        if(this.items[0].id != null){
          if(this.items[0].statusresep != 0){
            this.statusresep = this.items[0].statusresep;
            this.resepquery();
          }
        }
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

  lunas(item){
    let konfirmasi = confirm("Konfirmasi pengambilan, klik OK untuk melanjutkan.");
    if(konfirmasi == true){
      this.spinner.show();
      this.transaksiservice.lunastransaksi(new TransaksiArray(item.id,item.kodetransaksi,item.jenis,item.tanggaltransaksi,item.jamtransaksi,item.tanggalselesai,item.jamselesai,item.id_customer,item.id_profile,item.id_karyawan,item.totaldiskon,item.totalbelanja,item.asuransi,item.subtotal,item.bayar,item.kembali,item.sisa,item.catatan,item.status,item.statustoko,item.statustransaksi,item.statusresep,this.metode)).subscribe(
        //Jika data sudah berhasil di load
        (data:TransaksiArray[])=>{
          this.open('success','Transaksi','Transaksi Selesai!');
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

  //RESEP
  resepquery(){
    this.spinner.show();
    this.customerservice.showreseptransaksi(this.statusresep).subscribe(
      //Jika data sudah berhasil di load
      (data:ResepArray[])=>{
        this.resep=data;
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

  open(type,judul,pesan) {
    this._alert.create(type, judul, pesan, this.AlertSettings);
  }

  cetak(item){

  }
}

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi-add.component.html',
  styleUrls: ['./transaksi.component.css'],
  providers: [ DatePipe],
})
export class TransaksiAddComponent implements OnInit {
  transaksi:TransaksiArray[]=[];
  keranjang:KeranjangArray[]=[];
  pengguna:PenggunaArray[]=[];
  karyawan:KaryawanArray[]=[];
  customer:CustomerArray[]=[];
  cabang:CabangArray[]=[];
  produk:StokPusatArray[]=[];
  resep:ResepArray[]=[];

  //Variabel master
  id_cabang:any;
  jenis:any;

  //Variabel keranjang
  id_produk:any;
  harga:any;
  jumlah:Number;
  total:Number;

  //Variabel Produk
  kodeproduk:any;  
  id_kategoriproduk:any;
  id_merk:any;
  namaproduk:any;
  seriproduk:any;

  hargajual:any;
  hargagrosir:any;
  hargadistributor:any;
  diskon:any;
  stok:any;
  foto:any;

  //Variabel Transaksi
  id:Number; 
  hari;
  kodetransaksi:String; 
  jenistransaksi:String; 
  tanggaltransaksi;
  jamtransaksi:String; 
  tanggalselesai; 
  jamselesai:String; 
  id_customer:Number;
  id_profile:Number; 
  id_karyawan:Number; 
  totaldiskon:Number; 
  totalbelanja:Number;
  asuransi:Number; 
  subtotal:Number; 
  bayar:Number; 
  kembali:Number; 
  sisa:Number;
  catatan:String; 
  status:String; 
  statustoko:String;
  statustransaksi:String;
  statusresep:Number;
  metode:String;
  //Variabel Resep
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

  //Variabel Customer
  cariidcustomer:String;
  carinohandphone:String;

  kodecustomer:String;
  nama:String;
  alamat:String;
  notelp:String;
  tanggallahir:String;
  umur:String;
  jeniskelamin:String;

  loginstatus = localStorage.getItem('loginstatus');
  level:String;
  transaksiForm: FormGroup;
  customerForm: FormGroup;
  submitted = false;

  AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 2000
  };

  constructor(private datePipe: DatePipe,public route:ActivatedRoute, public router:Router,public transaksiservice:TransaksiService, public stokpusatservice:StokPusatService, 
    public karyawanservice:KaryawanService, public customerservice:CustomerService, public distributorservice:DistributorService,
    public cabangservice:CabangService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService,
    ){

  }
  ngOnInit(){
    window.scrollTo(0, 0);
    this.spinner.show();
    this.jenis = this.route.snapshot.paramMap.get('jenis');
    this.pengguna = JSON.parse(localStorage.getItem("profileuser"));
    this.statustoko = JSON.parse(localStorage.getItem("profileuser"))[0].profile.statustoko;
    this.id_profile = JSON.parse(localStorage.getItem("profileuser"))[0].profile.id;
    this.status = "lunas";
    this.metode = "cash";
    //Verifikasi Level
    if(this.pengguna.length > 0){
      this.level = this.pengguna[0].level;
    }
    if(this.level == 'admin'){
    }
    else if((this.level == 'sales') && ((this.jenis == 'pesan') || (this.jenis == 'grosir') || (this.jenis == 'retail'))){
    }
    else{
      this.router.navigateByUrl('notfound');
    }
    
    //Validator Awal
    this.transaksiForm = this.formBuilder.group({
      id_karyawan: ['0', Validators.required],
      id_customer: ['1', Validators.required],
      id_cabang: ['', Validators.nullValidator],
      status: ['', Validators.nullValidator],
      cariidcustomer: ['', Validators.nullValidator],
      carinohandphone: ['', Validators.nullValidator],
      //tanggaltransaksi : new FormControl((new Date()).toISOString().substring(0,10)),
    });
    this.tanggallahir = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.customerForm = this.formBuilder.group({
      nama: ['', Validators.required],
      alamat: ['', Validators.required],
      notelp: ['', [Validators.required]],
      tanggallahir: ['', [Validators.nullValidator]],
      umur: ['', [Validators.nullValidator]],
      jeniskelamin: ['', [Validators.nullValidator]]
    });
    //Tampil Dropdown by Transaksi
    this.tampilsales();
    this.id_karyawan = 0;
    //$(".id_karyawan").select2();
    
    if(this.jenis == 'pembelian'){
      this.tampildistributor();
      this.statustransaksi = "sudah";
    }
    else if((this.jenis == 'pesan') || (this.jenis == 'grosir')){
      this.tampilcustomer();
      this.status = "belum"      
    }
    else if(this.jenis == 'kirimcabang'){
      this.tampilcabang();
      this.id_customer = 1;
      this.statustransaksi = "sudah";
    }
    else if(this.jenis == 'retail'){
      this.id_customer = 1;
      this.statustransaksi = "sudah";
    }

    this.resepquery();

    //this.tanggaltransaksi = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    //this.tanggaltransaksi = new Date().toISOString().substring(0,10);
    this.tanggaltransaksi = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.hari = 1;
    let selesai = new Date();
    let plus = Number(this.hari);
    selesai.setDate(selesai.getDate()+plus);
    this.tanggalselesai = this.datePipe.transform(selesai, 'yyyy-MM-dd');
    $('#print-section').hide();
    $('#tb_print').hide();
    this.spinner.hide();
  }

  //TRANSAKSI
  caribarcode(){
    if(this.kodeproduk != ''){
      this.spinner.show();
      if(this.statustoko == "pusat"){
        if(this.jenis == "kirimcabang"){
          this.id_customer = this.id_cabang;
        }
        this.stokpusatservice.searchbarcode(new StokPusatArray(this.id,this.kodeproduk,this.id_kategoriproduk,this.id_merk,
          this.namaproduk,this.seriproduk,this.hargajual,this.hargagrosir,this.hargadistributor,this.diskon,this.stok,this.foto)).subscribe(
          //Jika data sudah berhasil di load
          (data:StokPusatArray[])=>{
            if(data.length > 0){
              //JIKA STOK ADA
              if(data[0].stok > 0){
                this.produk=data;
                this.simpankeranjang();
                this.spinner.hide();
                this.kodeproduk = '';
              }
              //JIKA STOK KOSONG
              else{
                //this.open('Error','Keranjang Belanja','Maaf,Stok Produk Kosong!');
                alert("Maaf,Stok Produk Kosong!");
                this.spinner.hide();
                this.produk = [];
                this.kodeproduk = '';
              }
            }
            //PRODUK TIDAK DITEMUKAN
            else{
              //this.open('Error','Keranjang Belanja','Produk tidak ditemukan!');
              alert("Produk tidak ditemukan!");
              this.spinner.hide();
              this.produk = [];
              this.kodeproduk = '';
            }
          },
          //Jika Error
          function (error){   
          },
          //Tutup Loading
          function(){
          }
        );
      }
      else if(this.statustoko == "cabang"){
        this.stokpusatservice.searchbarcodecabang(new StokPusatArray(this.id_profile,this.kodeproduk,this.id_kategoriproduk,this.id_merk,
          this.namaproduk,this.seriproduk,this.hargajual,this.hargagrosir,this.hargadistributor,this.diskon,this.stok,this.foto)).subscribe(
          //Jika data sudah berhasil di load
          (data:StokPusatArray[])=>{
            if(data.length > 0){
              //JIKA STOK ADA
              if(data[0].stok > 0){
                this.produk=data;
                this.simpankeranjang();
                this.spinner.hide();
                this.kodeproduk = '';
              }
              //JIKA STOK KOSONG
              else{
                //this.open('Error','Keranjang Belanja','Maaf,Stok Produk Kosong!');
                alert("Maaf,Stok Produk Kosong!");
                this.spinner.hide();
                this.produk = [];
                this.kodeproduk = '';
              }
            }
            //PRODUK TIDAK DITEMUKAN
            else{
              //this.open('Error','Keranjang Belanja','Produk tidak ditemukan!');
              alert("Produk tidak ditemukan!");
              this.spinner.hide();
              this.produk = [];
              this.kodeproduk = '';
            }
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
  }

  simpankeranjang(){
    if(this.produk.length > 0){
      //SET HARGA
      if(this.jenis == 'pembelian'){
        this.harga = this.produk[0].hargadistributor;
        this.diskon = 0;
      }
      else if((this.jenis == 'retail') || (this.jenis == 'pesan') || (this.jenis == 'kirimcabang')){
        this.harga = this.produk[0].hargajual;
        this.diskon = (Number(this.produk[0].diskon) / 100) * Number(this.harga);
      }
      else if(this.jenis == 'grosir'){
        this.harga = this.produk[0].hargagrosir;
        this.diskon = 0;
      }
      //HITUNG TOTAL
      this.total = this.harga - this.diskon;
      this.transaksiservice.savekeranjang(new KeranjangArray(this.id,this.id_karyawan,this.produk[0].id,this.harga,1,this.diskon,this.total,this.jenis)).subscribe(
        //Jika data sudah berhasil di load
        (data2:KeranjangArray[])=>{
          this.produk = [];
          this.tampilkeranjang(); 
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

  updatekeranjang(newcart){
    this.transaksiservice.editkeranjang(new KeranjangArray(newcart.id,newcart.id_karyawan,newcart.id_produk,newcart.harga,newcart.jumlah,newcart.diskon,newcart.total,newcart.jenistransaksi)).subscribe(
      //Jika data sudah berhasil di load
      (data2:KeranjangArray[])=>{
        this.produk = [];
        this.tampilkeranjang(); 
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

  increment(i){
    this.keranjang[i].jumlah = Number(this.keranjang[i].jumlah) + 1;
    var harga = Number(this.keranjang[i].jumlah) * Number(this.keranjang[i].harga);
    var diskon = Number(this.keranjang[i].jumlah) * Number(this.keranjang[i].diskon);
    this.keranjang[i].total = harga - diskon;
    this.updatekeranjang(this.keranjang[i]);
  } 

  decrement(i){
    if(this.keranjang[i].jumlah > 1){
      this.keranjang[i].jumlah = Number(this.keranjang[i].jumlah) - 1;
      var harga = Number(this.keranjang[i].jumlah) * Number(this.keranjang[i].harga);
      var diskon = Number(this.keranjang[i].jumlah) * Number(this.keranjang[i].diskon);
      this.keranjang[i].total = harga - diskon;
      this.updatekeranjang(this.keranjang[i]);
    }
  }

  editdiskon(i){
    var diskonbaru = $(document.getElementById("diskon_"+i)).val();
    if(diskonbaru == ''){
      diskonbaru = 0;
    }
    var harga = Number(this.keranjang[i].jumlah) * Number(this.keranjang[i].harga);
    var diskon = Number(this.keranjang[i].jumlah) * Number(diskonbaru);
    this.keranjang[i].diskon = Number(diskonbaru);
    this.keranjang[i].total = harga - diskon;
    this.updatekeranjang(this.keranjang[i]);
  }

  editbayar(){
    if(this.bayar == null){
      this.bayar = 0;
    }
    else if(this.bayar == 0){
      this.sisa = this.subtotal;
      this.kembali = 0;
    }

    //BELUM LUNAS
    if(this.bayar <= this.subtotal){
      this.sisa = Number(this.subtotal) - Number(this.bayar);
      this.kembali = 0;
    }
    //LUNAS
    else if(this.bayar >= this.subtotal){
      this.sisa = 0;
      this.kembali = Number(this.bayar) - Number(this.subtotal);
    }

    if(this.sisa > 0){
      this.status = "belum";
    }
    else{
      this.status = "lunas";
    }
  }

  edithari(){
    if(this.hari != ''){
      let selesai = new Date();
      let plus = Number(this.hari);
      selesai.setDate(selesai.getDate()+plus);
      this.tanggalselesai = this.datePipe.transform(selesai, 'yyyy-MM-dd');
    }
  }

  tampilsales(){
    this.karyawanservice.showkaryawan().subscribe(
      //Jika data sudah berhasil di load
      (data:KaryawanArray[])=>{
        this.karyawan=data;
        if(data.length > 0){
          //Tampil keranjang
          this.tampilkeranjang();
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

  tampilcustomer(){
    this.customerservice.showcustomer().subscribe(
      //Jika data sudah berhasil di load
      (data:CustomerArray[])=>{
        this.customer=data;
        if(data.length > 0){
          this.id_customer = data[0].id;
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

  tampildistributor(){
    this.distributorservice.showdistributor().subscribe(
      //Jika data sudah berhasil di load
      (data:CustomerArray[])=>{
        this.customer=data;
        if(data.length > 0){
          this.id_customer = data[0].id;
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

  tampilcabang(){
    this.cabangservice.showcabang().subscribe(
      //Jika data sudah berhasil di load
      (data:CabangArray[])=>{
        this.cabang=data;
        if(data.length > 0){
          this.id_cabang = data[0].id;
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

  tampilkeranjang(){
    this.transaksiservice.showkeranjang(this.id_karyawan,this.jenis).subscribe(
      //Jika data sudah berhasil di load
      (data2:KeranjangArray[])=>{
        this.keranjang=data2;
        this.totaldiskon = 0;
        this.totalbelanja = 0;
        this.subtotal = 0;
        this.kembali = 0;
        this.sisa = 0;
        if(data2.length > 0){
          for(var key in data2){
            var hitungdiskon = Number(data2[key].jumlah) * Number(data2[key].diskon);
            var hitungharga = Number(data2[key].jumlah) * Number(data2[key].harga);
            this.totaldiskon = Number(this.totaldiskon) + hitungdiskon;
            this.totalbelanja = Number(this.totalbelanja) + hitungharga;
          }
          this.subtotal = Number(this.totalbelanja) - Number(this.totaldiskon);
          if(this.jenis != "kirimcabang"){
            this.sisa = this.subtotal;
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

  hapus(item){
    let konfirmasi = confirm("Anda yakin menghapus data?");
    if(konfirmasi == true){
      this.spinner.show();
      this.transaksiservice.deletekeranjang(item).subscribe(
        //Jika data sudah berhasil di load
        (data:any)=>{
          this.open('success','Keranjang Belanja','Hapus Item Sukses!');
          this.spinner.hide();
          this.tampilkeranjang();
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

  get f() { return this.transaksiForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.transaksiForm.invalid) {
      return;
    }
    this.simpan();
  }

  simpan(){
    this.spinner.show();
    this.transaksiservice.savetransaksi(new TransaksiArray(this.id,this.kodetransaksi,this.jenis,this.tanggaltransaksi,this.jamtransaksi,this.tanggalselesai,this.jamselesai,this.id_customer,this.id_profile,this.id_karyawan,this.totaldiskon,this.totalbelanja,this.asuransi,this.subtotal,this.bayar,this.kembali,this.sisa,this.catatan,this.status,this.statustoko,this.statustransaksi,this.statusresep,this.metode))
      .subscribe(
        (data)=>{
          this.open('success','Data Transaksi','Simpan Data Sukses!');
          this.spinner.hide();
          this.kirimwa(data.id);
          setTimeout(() => {
            this.router.navigateByUrl('transaksi/'+this.jenis);
          },3000);
        },
        function(error){
          this.open('error','Data Transaksi','Simpan Data Gagal!');
          this.spinner.hide();
        },
        function(){
  
        }
      );
  }

  kirimwa(id){
    this.transaksiservice.showsuratorder(id).subscribe(
      //Jika data sudah berhasil di load
      (data:TransaksiArray[])=>{
        //kirim request ke printer server
        this.transaksiservice.kirimwaorder(data)
        .subscribe(
          (data)=>{
            console.log(data);
            this.open('success','Data Transaksi','Cetak Sukses!');
            this.spinner.hide();
            setTimeout(() => {
              this.router.navigateByUrl('transaksi/'+this.jenis);
            },3000);
          },
          function(error){
            this.open('error','Data Transaksi','Cetak Gagal!');
            this.spinner.hide();
          },
          function(){}
        );
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

  //CUSTOMER
  modalcustomer(){
    $('#showcustomer-modal').modal('show');
    this.hitungumur();
    this.jeniskelamin = "0";
  }

  cariidmember(){
    if(this.cariidcustomer!=''){
      this.customerservice.searchidmember(new CustomerArray(this.id,this.cariidcustomer,this.nama,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur, this.jeniskelamin)).subscribe(
        //Jika data sudah berhasil di load
        (data:CustomerArray[])=>{
          this.id_customer = data[0].id;
          this.carinohandphone = data[0].notelp
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

  carinohp(){
    if(this.carinohandphone!=''){
      this.customerservice.searchnohp(new CustomerArray(this.id,this.cariidcustomer,this.nama,this.alamat,this.carinohandphone,this.jenis,this.tanggallahir,this.umur, this.jeniskelamin)).subscribe(
        //Jika data sudah berhasil di load
        (data:CustomerArray[])=>{
          this.id_customer = data[0].id;
          this.cariidcustomer = data[0].kodecustomer
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

  verifikasinohp(){
    if(this.notelp!=''){
      this.customerservice.searchnohp(new CustomerArray(this.id,this.cariidcustomer,this.nama,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur, this.jeniskelamin)).subscribe(
        //Jika data sudah berhasil di load
        (data:CustomerArray[])=>{
          if(data[0].id != null){
            alert("No.Telp sudah ada!");
            this.notelp = '';
          }
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

  get g() { return this.customerForm.controls; }

  onSubmitCustomer() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    this.simpancustomer();
  }

  simpancustomer(){
    this.spinner.show();
    var jenislama = this.jenis;
    this.jenis = "customer";
    this.customerservice.savecustomer(new CustomerArray(this.id,this.kodecustomer,this.nama,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur,this.jeniskelamin))
    .subscribe(
      (data)=>{
        this.open('success','Data Customer','Simpan Data Sukses!');
        $('#showcustomer-modal').modal('hide');
        this.spinner.hide();
        this.jenis = jenislama;
        this.tampilcustomer();
        setTimeout(() => {
        this.id_customer = data.id;
        this.nama = "";
        this.alamat = "";
        this.notelp = "";
        },1000);
      },
      function(error){
        this.open('error','Data Customer','Simpan Data Gagal!');
        $('#showcustomer-modal').modal('hide');
        this.spinner.hide();
        this.jenis = jenislama;
      },
      function(){

      }
    );
  }

  //RESEP
  resepquery(){
    this.spinner.show();
    this.customerservice.showresep(this.id_customer).subscribe(
      //Jika data sudah berhasil di load
      (data:ResepArray[])=>{
        this.resep=data;
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

  tampilresep(){
    $('#addresep-modal').modal('hide');
    $('#showresep-modal').modal('show');
    this.resepquery();
  }

  tambahresep(){
    $('#showresep-modal').modal('hide');
    $('#addresep-modal').modal('show');
    this.kosongresep();
  }

  pilihresep(res){
    this.statusresep = res.id;
    $('#showresep-modal').modal('hide');
    this.open('success','Data Resep','Resep dipilih!');
  }

  kosongresep(){
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

  simpanresep(){
    $('#addresep-modal').modal('hide');
    this.spinner.show();
    this.customerservice.saveresep(new ResepArray(this.id,this.id_customer,this.r_sph,this.l_sph,this.r_cyl,this.l_cyl,this.r_axs,this.l_axs,this.r_add,this.l_add,this.pd,this.visakhir,this.A,this.B,this.dbl,this.r_mpd,this.l_mpd,this.shpv,this.jenisframe,this.koridor,this.visusbalance,this.dukeelder,this.wrapangle,this.pantoskopik,this.vertexdistance,this.catatan))
    .subscribe(
      (data:ResepArray[])=>{
        this.spinner.hide();
        this.open('success','Data Resep','Simpan Data Sukses!');
        setTimeout(() => {
          this.tampilresep();
        },3000);
      },
      function(error){
        this.spinner.hide();
        this.open('error','Data Resep','Simpan Data Gagal!');
        $('#addresep-modal').modal('hide');
      },
      function(){
      }
    );
  }

  gantiresep(){
    this.statusresep = 0;
  }

  open(type,judul,pesan) {
    this._alert.create(type, judul, pesan, this.AlertSettings);
  }
}

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi-so.component.html',
  styleUrls: ['./transaksi.component.css'],
})
export class TransaksiSOComponent implements OnInit {
  transaksi:TransaksiArray[]=[];
  keranjang:KeranjangArray[]=[];
  pengguna:PenggunaArray[]=[];
  karyawan:KaryawanArray[]=[];
  customer:CustomerArray[]=[];
  cabang:CabangArray[]=[];
  produk:StokPusatArray[]=[];
  resep:ResepArray[]=[];

  //Variabel master
  id_cabang:any;
  jenis:any;

  //Variabel keranjang
  id_produk:any;
  harga:any;
  jumlah:Number;
  total:Number;

  //Variabel Produk
  kodeproduk:any;  
  id_kategoriproduk:any;
  id_merk:any;
  namaproduk:any;
  seriproduk:any;

  hargajual:any;
  hargagrosir:any;
  hargadistributor:any;
  diskon:any;
  stok:any;
  foto:any;

  //Variabel Transaksi
  id:Number; 
  hari;
  kodetransaksi:String; 
  jenistransaksi:String; 
  tanggaltransaksi;
  jamtransaksi:String; 
  tanggalselesai; 
  jamselesai:String; 
  id_customer:Number;
  id_profile:Number; 
  id_karyawan:Number; 
  totaldiskon:Number; 
  totalbelanja:Number;
  asuransi:Number; 
  subtotal:Number; 
  bayar:Number; 
  kembali:Number; 
  sisa:Number;
  catatan:String; 
  status:String; 
  statustoko:String;
  statustransaksi:String;
  statusresep:Number;
  metode:String;
  //Variabel Resep
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

  //Variabel Customer
  kodecustomer:String;
  nama:String;
  alamat:String;
  notelp:String;
  tanggallahir:String;
  umur:String;
  jeniskelamin:String;

  loginstatus = localStorage.getItem('loginstatus');
  level:String;
  transaksiForm: FormGroup;
  customerForm: FormGroup;
  submitted = false;

  AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 2000
  };

  constructor(private datePipe: DatePipe,public route:ActivatedRoute, public router:Router,public transaksiservice:TransaksiService, public stokpusatservice:StokPusatService, 
    public karyawanservice:KaryawanService, public customerservice:CustomerService, public distributorservice:DistributorService,
    public cabangservice:CabangService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private _alert: AlertsService,
    ){

  }
  ngOnInit(){
    window.scrollTo(0, 0);
    this.spinner.show();
    this.jenis = this.route.snapshot.paramMap.get('jenis');
    this.pengguna = JSON.parse(localStorage.getItem("profileuser"));
    this.statustoko = JSON.parse(localStorage.getItem("profileuser"))[0].profile.statustoko;
    this.id_profile = JSON.parse(localStorage.getItem("profileuser"))[0].profile.id;
    this.status = "lunas";
    this.metode = "cash";
    //Verifikasi Level
    if(this.pengguna.length > 0){
      this.level = this.pengguna[0].level;
    }
    if(this.level == 'admin'){
    }
    else if((this.level == 'sales') && ((this.jenis == 'pesan') || (this.jenis == 'grosir') || (this.jenis == 'retail'))){
    }
    else{
      this.router.navigateByUrl('notfound');
    }
    
    //Validator Awal
    this.transaksiForm = this.formBuilder.group({
      id_karyawan: ['0', Validators.required],
      id_customer: ['1', Validators.required],
      id_cabang: ['', Validators.nullValidator],
      status: ['', Validators.nullValidator],
      //tanggaltransaksi : new FormControl((new Date()).toISOString().substring(0,10)),
    });
    this.tanggallahir = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.customerForm = this.formBuilder.group({
      nama: ['', Validators.required],
      alamat: ['', Validators.required],
      notelp: ['', [Validators.required]],
      tanggallahir: ['', [Validators.nullValidator]]
    });
    //Tampil Dropdown by Transaksi
    this.tampilsales();
    //this.id_karyawan = 0;
    if(this.jenis == 'pembelian'){
      this.tampildistributor();
      this.statustransaksi = "sudah";
    }
    else if((this.jenis == 'pesan') || (this.jenis == 'grosir')){
      this.tampilcustomer();
      this.status = "belum";
    }
    else if(this.jenis == 'kirimcabang'){
      this.tampilcabang();
      this.id_customer = 1;
      this.statustransaksi = "sudah";
    }
    else if(this.jenis == 'retail'){
      this.id_customer = 1;
      this.statustransaksi = "sudah";
    }

    this.resepquery();

    //this.tanggaltransaksi = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    //this.tanggaltransaksi = new Date().toISOString().substring(0,10);
    this.tanggaltransaksi = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.hari = 1;
    let selesai = new Date();
    let plus = Number(this.hari);
    selesai.setDate(selesai.getDate()+plus);
    this.tanggalselesai = this.datePipe.transform(selesai, 'yyyy-MM-dd');
    $('#print-section').hide();
    $('#tb_print').hide();
    this.spinner.hide();

  }

  //TRANSAKSI
  tampilsales(){
    this.karyawanservice.showkaryawan().subscribe(
      //Jika data sudah berhasil di load
      (data:KaryawanArray[])=>{
        this.karyawan=data;
        if(data.length > 0){
          //Tampil keranjang
          this.tampilkeranjang();
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

  tampilcustomer(){
    this.customerservice.showcustomer().subscribe(
      //Jika data sudah berhasil di load
      (data:CustomerArray[])=>{
        this.customer=data;
        if(data.length > 0){
          this.id_customer = data[0].id;
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

  tampildistributor(){
    this.distributorservice.showdistributor().subscribe(
      //Jika data sudah berhasil di load
      (data:CustomerArray[])=>{
        this.customer=data;
        if(data.length > 0){
          this.id_customer = data[0].id;
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

  tampilcabang(){
    this.cabangservice.showcabang().subscribe(
      //Jika data sudah berhasil di load
      (data:CabangArray[])=>{
        this.cabang=data;
        if(data.length > 0){
          this.id_cabang = data[0].id;
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

  tampilkeranjang(){
    var idtrans = this.route.snapshot.paramMap.get('idtrans');
    this.id = parseInt(idtrans);
    this.transaksiservice.showdetailtransaksi(idtrans).subscribe(
      //Jika data sudah berhasil di load
      (data2:KeranjangArray[])=>{
        this.keranjang=data2[0]['detailtransaksi'];
        this.totaldiskon = data2[0]['totaldiskon'];
        this.totalbelanja = data2[0]['totalbelanja'];
        this.subtotal = data2[0]['subtotal'];
        this.kembali = data2[0]['kembali'];
        this.sisa = data2[0]['sisa'];
        this.bayar = data2[0]['bayar'];
        this.metode = data2[0]['metode'];
        this.id_karyawan = data2[0]['id_karyawan'];
        this.status = data2[0]['status'];
        this.id_customer = data2[0]['id_customer'];
        this.tanggaltransaksi = data2[0]['tanggaltransaksi'];
        this.tanggalselesai = data2[0]['tanggalselesai'];
        this.jamselesai = data2[0]['jamselesai'];
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

  get f() { return this.transaksiForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.transaksiForm.invalid) {
      return;
    }
    this.simpan();
  }

  simpan(){
    this.spinner.show();
    //Simpan Resep
    this.transaksiservice.updatetransaksi(new TransaksiArray(this.id,this.kodetransaksi,this.jenis,this.tanggaltransaksi,this.jamtransaksi,this.tanggalselesai,this.jamselesai,this.id_customer,this.id_profile,this.id_karyawan,this.totaldiskon,this.totalbelanja,this.asuransi,this.subtotal,this.bayar,this.kembali,this.sisa,this.catatan,this.status,this.statustoko,this.statustransaksi,this.statusresep,this.metode))
      .subscribe(
        (data)=>{
          this.open('success','Data Transaksi','Simpan Data Sukses!');
          this.spinner.hide();
          this.cetakstruk(data.id);
        },
        function(error){
          this.open('error','Data Transaksi','Simpan Data Gagal!');
          this.spinner.hide();
        },
        function(){
  
        }
      );
  }

  cetakstruk(id){
    this.transaksiservice.showsuratorder(id).subscribe(
      //Jika data sudah berhasil di load
      (data:TransaksiArray[])=>{
        //kirim request ke printer server
        this.transaksiservice.cetaksuratorder(data)
        .subscribe(
          (data)=>{
            console.log(data);
            this.open('success','Data Transaksi','Cetak Sukses!');
            this.spinner.hide();
            setTimeout(() => {
              this.router.navigateByUrl('transaksi/suratorder');
            },3000);
          },
          function(error){
            this.open('error','Data Transaksi','Cetak Gagal!');
            this.spinner.hide();
          },
          function(){}
        );
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

  //CUSTOMER
  modalcustomer(){
    $('#showcustomer-modal').modal('show');  
  }

  get g() { return this.customerForm.controls; }

  onSubmitCustomer() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    this.simpancustomer();
  }

  simpancustomer(){
    this.spinner.show();
    var jenislama = this.jenis;
    this.jenis = "customer";
    this.customerservice.savecustomer(new CustomerArray(this.id,this.kodecustomer,this.nama,this.alamat,this.notelp,this.jenis,this.tanggallahir,this.umur,this.jeniskelamin))
    .subscribe(
      (data)=>{
        this.open('success','Data Customer','Simpan Data Sukses!');
        $('#showcustomer-modal').modal('hide');
        this.spinner.hide();
        this.jenis = jenislama;
        this.tampilcustomer();
        setTimeout(() => {
        this.id_customer = data.id;
        this.nama = "";
        this.alamat = "";
        this.notelp = "";
        },1000);
      },
      function(error){
        this.open('error','Data Customer','Simpan Data Gagal!');
        $('#showcustomer-modal').modal('hide');
        this.spinner.hide();
        this.jenis = jenislama;
      },
      function(){

      }
    );
  }

  //RESEP
  resepquery(){
    this.spinner.show();
    this.customerservice.showresep(this.id_customer).subscribe(
      //Jika data sudah berhasil di load
      (data:ResepArray[])=>{
        this.resep=data;
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

  tampilresep(){
    $('#addresep-modal').modal('hide');
    $('#showresep-modal').modal('show');
    this.resepquery();
  }

  tambahresep(){
    $('#showresep-modal').modal('hide');
    $('#addresep-modal').modal('show');
    this.kosongresep();
  }
  inputpd(){
    this.pd = Number(this.r_mpd) + Number(this.l_mpd);
  }
  pilihresep(res){
    this.statusresep = res.id;
    $('#showresep-modal').modal('hide');
    this.open('success','Data Resep','Resep dipilih!');
  }

  kosongresep(){
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

  simpanresep(){
    $('#addresep-modal').modal('hide');
    this.spinner.show();
    this.customerservice.saveresep(new ResepArray(this.id,this.id_customer,this.r_sph,this.l_sph,this.r_cyl,this.l_cyl,this.r_axs,this.l_axs,this.r_add,this.l_add,this.pd,this.visakhir,this.A,this.B,this.dbl,this.r_mpd,this.l_mpd,this.shpv,this.jenisframe,this.koridor,this.visusbalance,this.dukeelder,this.wrapangle,this.pantoskopik,this.vertexdistance,this.catatan))
    .subscribe(
      (data:ResepArray[])=>{
        this.spinner.hide();
        this.open('success','Data Resep','Simpan Data Sukses!');
        setTimeout(() => {
          this.tampilresep();
        },3000);
      },
      function(error){
        this.spinner.hide();
        this.open('error','Data Resep','Simpan Data Gagal!');
        $('#addresep-modal').modal('hide');
      },
      function(){
      }
    );
  }

  gantiresep(){
    this.statusresep = 0;
  }

  open(type,judul,pesan) {
    this._alert.create(type, judul, pesan, this.AlertSettings);
  }
}






