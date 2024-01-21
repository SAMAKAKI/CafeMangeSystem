import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

export const routerGuardGuard: CanActivateFn = (route, state) => {
  let expectedRoleArray = route.data['expectedRole'];
  const token: any = localStorage.getItem('token');
  let tokenPayload: any;
  let router = inject(Router);
  let auth = inject(AuthService);
  let snack = inject(SnackbarService);

  try{
    tokenPayload = jwtDecode(token);
  } catch(err){
    localStorage.clear();
    router.navigate(['/']);
  }

  let checkRole = false;

  for(let i = 0; i < expectedRoleArray.length; i++){
    if(expectedRoleArray[i] == tokenPayload.role){
      checkRole = true;
    }
  }

  if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
    if(auth.isAuthenticated() && checkRole){
      return true;
    }
    snack.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
    router.navigate(['/cafe/dashboard']);

    return false;
  } else{
    router.navigate(['/']);
    localStorage.clear();

    return false;
  }
};
