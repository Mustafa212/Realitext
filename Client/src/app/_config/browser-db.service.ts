import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserDbService {
  setItem(key: string, value: any) {
    return sessionStorage.setItem(key, JSON.stringify(value))
  }

  getItem(key: string) {
    const item = sessionStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    }
    return null;
  }

  clearLocalStorage(): void {
    sessionStorage.clear();
  }

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Lax`;
  }

  getCookie(name: string): string | null {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].trim().split('=');
      if (cookiePair[0] === name) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

}
