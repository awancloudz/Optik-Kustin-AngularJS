import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributorComponent } from './distributor/distributor.component';
import { HomeComponent, HomeNotfoundComponent } from './home/home.component';
import { KategoriProdukComponent } from './kategori-produk/kategori-produk.component';
import { KaryawanComponent } from './karyawan/karyawan.component';
import { StokPusatComponent } from './stok-pusat/stok-pusat.component';
import { CustomerComponent, CustomerResepComponent } from './customer/customer.component';
import { MerkComponent } from './merk/merk.component';
import { PenggunaComponent } from './pengguna/pengguna.component';
import { CabangComponent, CabangUtamaComponent, CabangStokComponent, CabangTransaksiComponent } from './cabang/cabang.component';
import { TransaksiComponent, TransaksiViewComponent, TransaksiAddComponent, TransaksiSOComponent } from './transaksi/transaksi.component';
import { LaporanComponent } from './laporan/laporan.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // { path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // },
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
  { path: 'laporan/:jenis', component: LaporanComponent},
  { path: 'notfound', component: HomeNotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
