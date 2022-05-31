import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private peerService: PeerService
  ) {
    this.roomName = route.snapshot.paramMap.get('id')!;
    console.log(this.roomName);
   }

  ngOnInit(): void {
    this.initPeer();
    this.checkMediaDevices();
    this.initSocket();
  }

  
  initPeer = () => {
    const {peer} = this.peerService;
    peer.on('open', (id: any) => {
      const body = {
        idPeer: id,
        roomName: this.roomName
      };

      this.webSocketService.joinRoom(body);
    });

    peer.on('call', (callEnter: { answer: (arg0: any) => void; on: (arg0: string, arg1: (streamRemote: any) => void) => void; }) => {
      callEnter.answer(this.currentStream);
      callEnter.on('stream', (streamRemote) => {
        this.addVideoUser(streamRemote);
      });
    }, (err: any) => {
      console.log('Err Peer call ', err);
    });

  }

  initSocket = () => {
    this.webSocketService.cbEvent.subscribe(res => {
      if (res.name === 'new-user') {
        const {idPeer} = res.data;
        this.sendCall(idPeer, this.currentStream);
      }
    })
  }

  checkMediaDevices = () => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
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

  sendCall = (idPeer: any, stream: any) => {
    const newUserCall = this.peerService.peer.call(idPeer, stream);
    if (!!newUserCall) {
      newUserCall.on('stream', (userStream: any) => {
        this.addVideoUser(userStream);
      })
    }
  }


}
