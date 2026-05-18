import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Books } from './components/books/books';
import { Quotes } from './components/quotes/quotes';
import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';  

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Books,
    Quotes,
    Navbar,
    Home 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
