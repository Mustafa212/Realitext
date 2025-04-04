import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from '../_config/api.config';
import { response } from '../_models/ClassificationResponse';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private http = inject(HttpClient);
  baseurl = Config.apiUrl;
  classify(text:string){
    var query={ 
      text : text
    }
    return this.http.post<response>(this.baseurl + Config.Identity.classify,query);
  }

  extract(file:File){
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(this.baseurl + Config.Identity.extract,formData);
  }

}
