import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  listUser: Array<any> = [];
  currentStream: any;

  constructor() { }

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
