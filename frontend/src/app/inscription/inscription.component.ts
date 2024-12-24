import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit {

  ngOnInit() {
    console.log('coucou');
  }

}
