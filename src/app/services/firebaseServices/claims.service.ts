import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  constructor(public db: AngularFireDatabase) {}


  getClaims(){
    return this.db.list('Claims').snapshotChanges();
  }
  getClaimsByDate(){
    return this.db.list('TotalClaimsPerDate').snapshotChanges();
  }


  
}
