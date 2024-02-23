import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DistributorComponent } from './distributor/distributor.component';
import { HomeComponent, HomeNotfoundComponent } from './home/home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { JasperoAlertsModule } from '@jaspero/ng-alerts';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';

import { KategoriProdukComponent } from './kategori-produk/kategori-produk.component';
import { KaryawanComponent } from './karyawan/karyawan.component';
import { StokPusatComponent } from './stok-pusat/stok-pusat.component';
import { CustomerComponent, CustomerResepComponent } from './customer/customer.component';
import { MerkComponent } from './merk/merk.component';
import { PenggunaComponent } from './pengguna/pengguna.component';
import { CabangComponent, CabangUtamaComponent, CabangStokComponent, CabangTransaksiComponent } from './cabang/cabang.component';
import { TransaksiComponent, TransaksiViewComponent, TransaksiAddComponent, TransaksiSOComponent } from './transaksi/transaksi.component';

import { DatePipe } from '@angular/common';
import { LaporanComponent } from './laporan/laporan.component';

@NgModule({
  declarations: [
    AppComponent,
    DistributorComponent,
    HomeComponent, HomeNotfoundComponent,
    KategoriProdukComponent,
    KaryawanComponent,
    StokPusatComponent,
    CustomerComponent, CustomerResepComponent,
    MerkComponent,
    PenggunaComponent,
    CabangComponent, CabangUtamaComponent, CabangStokComponent, CabangTransaksiComponent, 
    TransaksiComponent, TransaksiViewComponent, TransaksiAddComponent, LaporanComponent, 
    TransaksiSOComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxPrintModule,
    NgxBarcodeModule,
    JasperoAlertsModule.forRoot(),
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN'
    })
  ],
  providers: [ 
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
