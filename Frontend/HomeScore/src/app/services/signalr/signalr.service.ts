import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7241/hub')
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection started'))
      .catch(error => console.log('Error while starting SignalR connection: ' + error));
  }
}
