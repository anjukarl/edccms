import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  signIn(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.loggedIn = true;
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        this.loggedIn = false;
      });
  }

  isAuthenticated() {
    return this.loggedIn;
  }

  signOut() {
    this.loggedIn = false;
    this.afAuth.signOut();
  }
}
