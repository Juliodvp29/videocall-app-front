import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeerService } from 'src/app/services/peer.service';
import { WebSocketService } from 'src/app/services/web-socket.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  roomName: string = '';
  listUser: Array<any> = [];
  currentStream: any;

  constructor(
    private router: Router,
    private webSocketService: WebSocketService,
    private peerService: PeerService
  ) { }

  ngOnInit(): void {
    this.checkMediaDevices();
  }

  checkMediaDevices = () => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(stream => {
        this.currentStream = stream;
        this.addVideoUser(stream);
      }).catch(() => {
        console.log('Not permissions');
      });
    } else {
      console.log('Not media devices');
    }
  }

  addVideoUser = (stream: any) => {
    this.listUser.push(stream);
  }
}
