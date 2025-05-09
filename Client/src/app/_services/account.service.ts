import { HttpClient } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { map } from 'rxjs';
import { Config } from '../_config/api.config';
import { BrowserDbService } from '../_config/browser-db.service';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  currentuser = signal<User | null>(null)
  baseurl = Config.apiUrl;
  private browserDb = inject(BrowserDbService);
 

  login(email: string, password: string) {
  var query={ 
    username :email,
   password: password,
  }
    return this.http.post<User>(
      this.baseurl + Config.Identity.login,
    query
    ).pipe(
      map(user => {
        console.log(user);
        if (user) this.setCurrentUser(user);

        return user;
      })
    );
  }
  
  register(email: string, password: string) {
  return this.http.post(`${this.baseurl + Config.Identity.register}?username=${email}&password=${password}`,{}
    );
  }
  
  setCurrentUser(user:User){
    this.currentuser.set(user);
    this.browserDb.setItem("user" , user);
  }
  GetCurrentUser():User|null{
    var user:User|null=null
    if(this.currentuser()!=null ){
     user=this.currentuser()
    }else{
      user=this.browserDb.getItem("user");
    }
       return user
    }
  logout(){
    this.currentuser.set(null);
    this.browserDb.clearLocalStorage();
  }
}
