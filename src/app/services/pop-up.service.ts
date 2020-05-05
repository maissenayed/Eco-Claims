import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor() {}

  makeCapitalPopup(State: any, claims: any): string {
    let claimsString = ''

    claims.map(claim => {
      claimsString =
        claimsString +
        `
    <div class="toast-body"> 
    Claim date : ${claim.date}
    </div>
  </div>`
    })
    if (claims === undefined || claims.length == 0) {
      claimsString = ' There is no claims for the moment'
    }

    return (
      `` +
      `
      <div class="toast-header">
        <strong class="mr-auto">State: </strong>
        <small> ${State.State} </small>
        </div>` +
      claimsString
    )
  }
}
