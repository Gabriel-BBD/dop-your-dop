import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { AlcoholicsComponent } from './alcoholics/alcoholics.component';
import { ProfileComponent } from './profile/profile.component';
import { ChartModule } from 'angular-highcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    HomeComponent,
    AlcoholicsComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTabsModule,
    ChartModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class HomeModule { }
