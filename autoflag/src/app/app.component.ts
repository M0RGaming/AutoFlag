import { Component } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'autoflag';
  showFiller = false;

  tweetdb = [
    {
      user: "Shiba Inu",
      id: "Small",
      text: "The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan." +
        "A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for" +
        "hunting.",
      picture: "https://material.angular.io/assets/img/examples/shiba2.jpg"
    },
    {
      user: "Cat",
      id: "1203123",
      text: "The cat is dead",
      picture: "https://material.angular.io/assets/img/examples/shiba2.jpg"
    },
  ]


}
