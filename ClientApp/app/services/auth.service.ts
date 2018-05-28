import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {
    isAuthenticated(): boolean {
        let expiresAt = localStorage.getItem('expires_at');
        if (!expiresAt) return false;

        return new Date().getTime() < JSON.parse(expiresAt);
    }

    auth0 = new auth0.WebAuth({
        clientID: 'S7a3W2719Vz5T6PCYvSrGLjDaX471tsO',
        domain: 'andrewjco.au.auth0.com',
        responseType: 'token id_token',
        audience: 'https://andrewjco.au.auth0.com/userinfo',
        redirectUri: 'http://localhost:5000/callback',
        scope: 'openid'
    });

    constructor(public router: Router) { }

    public login(): void {
        this.auth0.authorize();
    }

    public logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public setSession(authResult: any): void {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken) {
                this.setSession(authResult);
            } else if (err) {
                this.router.navigate(['/home']);
            }
        });
    }
}