import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowEdit: boolean = false;
  changesSaved: boolean = false;

  constructor(
    private serversService: ServersService,
    private router: Router,
    private route: ActivatedRoute
    ) { }


  ngOnInit() {
    this.route.queryParams
    .subscribe((params: Params)=>{
      this.allowEdit = params['allowEdit'] === '1' ? true : false;
    })
    this.route.fragment.subscribe();
    const id = +this.route.snapshot.params['id']
    this.server = this.serversService.getServer(id);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddServer() {
    this.serversService.addServers(this.server.id, {name: this.serverName, status: this.serverStatus});
  }
  canDeactivate():boolean | Promise<boolean> | Observable<boolean> {
    if(!this.allowEdit){
      return true;
    }
    if((this.serverName ! == this.server.name || this.serverStatus !== this.server.status) && !this.changesSaved){
      return confirm('Are you sure you want to discard the changes?');
    } else {
      return true;
    }
  }
}
