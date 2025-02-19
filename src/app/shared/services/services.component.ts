import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {data} from 'autoprefixer';


@Injectable({
  providedIn: 'root', // or 'any' or a specific module
})

export class ServicesComponent {
  public audrosServer = `https://dms-server/`;
  private _audrosSession: (string | undefined);
  public user = "audros";
  public psw = "aupwd";
  public Ct = '40';
  public authInfos = 'AUSessionID=';

  private _sessionId = ""
  private _baseUrl: string = '';

  connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _http: HttpClient){

  }


  autologin(): Observable<any> {

    //this._baseUrl = `cocoon/View/ExecuteService/fr/AW_AuplResult3.text?${this.authInfos}${sessionID}&ServiceSubPackage=mehdi&ServiceName=Bijoux.au&ServiceParameters=`;
    //console.log("url base est : ", this._baseUrl);
    const param = "login";
    const data = "";

    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;

    return new Observable(observer => {
      const url = `${this.audrosServer}cocoon/View/LoginCAD.xml?userName=${this.user}&computerName=AWS&userPassword=${this.psw}&dsn=dmsDS&Client_Type=${this.Ct}`;

      this._http.get(url, {responseType: 'text'}).subscribe({
        next: (response: string) => {
          console.log("XML Response:", response);

          // Parse the XML response using DOMParser
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response, 'application/xml');

          const resultElement = xmlDoc.querySelector('result');

          if (resultElement) {
            this._sessionId = resultElement.textContent || "";
            console.log("Connected with session: ", this._sessionId);
            this.connected.next(true);
            this._baseUrl = `cocoon/View/ExecuteService/fr/AW_AuplResult3.text?${this.authInfos}${this._sessionId}&ServiceSubPackage=customer/Apps/ConfigPF&ServiceName=WS_configPF.au&ServiceParameters=`;
            console.log("url base est : ", this._baseUrl)


          } else {
            console.error("Autologin failed: Unable to extract session id from XML");
          }
          // Assume successful login if we get here
          observer.next(response); // Emit successful login
          observer.complete(); // Complete the observable
        },
        error: (error) => {
          //console.error("Autologin failed:", error);
          observer.error(error); // Propagate error
        }
      });
    });
  }

   log(sessionID: string): Observable<any> {

    this._baseUrl = `cocoon/View/ExecuteService/fr/AW_AuplResult3.text?${this.authInfos}${sessionID}&ServiceSubPackage=customer/Apps/ConfigPF&ServiceName=WS_configPF.au&ServiceParameters=`;
    console.log("url base est : ", this._baseUrl);
    const param = "login";
    const data = "";

    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;

    return this._http.get(url, {responseType: 'text'});
  }

  getItem(data: string):Observable<any>{
    const param = "getItem";
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;
    console.log("url", url);
    return this._http.get<any>(url, {responseType : 'json'});
  }

  getType(type_objet: string, nom_type: string): Observable<any> {
    const param = "getTypeObject";
    const url = `${this.audrosServer}${this._baseUrl}${param}@${type_objet};${nom_type}@`;
    console.log("URL:", url);
    return this._http.get<any>(url, { responseType: 'json' });
  }

  getMBOM(numArt: string): Observable<any> {
    const param = "getMBOM";
    const data = `${numArt}`;
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;

    console.log("Fetching MBOM from URL:", url);

    return this._http.get<any>(url, { responseType: 'json' });
  }


  addNewLink(linkData: { linkClass: string, parentID: string, childID: string, quantity: number, flag: string, ordre: string }): Observable<any> {
    const param = "AddNewLink";
    const data = `${linkData.linkClass};${linkData.parentID};${linkData.childID};${linkData.quantity};${linkData.flag};${linkData.ordre}`;
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}`;

    console.log("URL d'ajout de lien :", url);

    return this._http.get<any>(url, { responseType: 'json' });
  }

  getAttribut(data: string):Observable<any>{
    const param = "getAttribut";
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;
    console.log("url", url);
    return this._http.get<any>(url, {responseType : 'json'});
  }

  getFournisseur(data: string):Observable<any>{
    const param = "getFournisseur";
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;
    console.log("url", url);
    return this._http.get<any>(url, {responseType : 'json'});
  }

  getTypeBijoux(data: string):Observable<any>{
    const param = "getTypeBijoux";
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;
    console.log("url", url);
    return this._http.get<any>(url, {responseType : 'json'});
  }

  getChild(data: string):Observable<any>{
    const param = "getChild";
    const url = `${this.audrosServer}${this._baseUrl}${param}@${data}@`;
    console.log("url", url);
    return this._http.get<any>(url, {responseType : 'json'});
  }


  ensureLoggedIn(sessionID: string): Observable<any> {
    if (!this._sessionId) {
      return this.log(sessionID);
    }
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

}
