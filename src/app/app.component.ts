import { Component,OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';

import { LogServiceService } from '../app/service/log-service.service';
import { EntryData} from './model/EntryData';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LogAnalyser';
  constructor(private http:HttpClient,private logService:LogServiceService,private parser:NgxXml2jsonService) { }
  logData=[];
  responseLinks=[];
  
  ngOnInit(){

    this.logService.getResponseLink().subscribe(
      (data:any)=>{
        data.hits.hits.forEach(element => {
         this.responseLinks.push(element._source.request);
         this.http.get(element._source.request,{responseType: 'text'} ).subscribe((xml:string) => {
          let temp = xml.split("CurrentPointBalance</Name><Value>");
          let j = temp[1].indexOf("</Value>");
          let pointStr = temp[1].slice(0,j);

          let temp1 = xml.split("UserId</Name><Value>");
          let k = temp1[1].indexOf("</Value>");
          let userIdStr = temp1[1].slice(0,j);
          let userData = userIdStr.split("_")
          this.logData.push({clientId:userData[0], UserId:userData[1], CurrentPointBalance:pointStr});
         })
        });
      });
    

  }
}
