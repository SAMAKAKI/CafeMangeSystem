import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SignupComponent } from './components/signup/signup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptorInterceptor } from './interceptors/token-interceptor.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ConformationComponent } from './components/dialog/conformation/conformation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangePasswordComponent } from './components/dialog/change-password/change-password.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { ManageCategoryComponent } from './components/dialog/manage-category/manage-category.component';
import { CategoryComponent } from './components/category/category.component';
import { CafeComponent } from './components/layouts/cafe/cafe.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManageProductComponent } from './components/dialog/manage-product/manage-product.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductComponent } from './components/product/product.component';
import { ManageOrderComponent } from './components/dialog/manage-order/manage-order.component';
import { BillComponent } from './components/bill/bill.component';
import { ViewBillComponent } from './components/dialog/view-bill/view-bill.component';
import { ManageUserComponent } from './components/dialog/manage-user/manage-user.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  pbColor: "red",
  bgsColor: "red",
  fgsColor: "red",
  fgsType: SPINNER.ballSpinClockwise,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent,
    DashboardComponent,
    ConformationComponent,
    ChangePasswordComponent,
    HeaderComponent,
    ManageCategoryComponent,
    CategoryComponent,
    CafeComponent,
    ManageProductComponent,
    ProductComponent,
    ManageOrderComponent,
    BillComponent,
    ViewBillComponent,
    ManageUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FontAwesomeModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDatepickerModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  providers: [
    provideClientHydration(),
    HttpClientModule,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
