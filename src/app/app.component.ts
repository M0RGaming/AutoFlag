import {Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from '@angular/material/grid-list';
import { FlaggerService} from "./flagger/flagger";
import {FlaggedInterface, TweetInterface} from "./tweet-interface";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private flaggerService: FlaggerService, ) {}
  title = 'autoflag';
  showFiller = false;

  tweetdb: TweetInterface[] = [
    {
      user: "mismagius",
      id: "@igramum",
      text: 'if you told me that wubwoofwolf would private all his recent videos on youtube and upload a 15 minute' +
        ' video about self-reflection, consent, the purpose of life and the implications of "influencing" as an ' +
        'influencer, i would say "What the fuck"',
      picture: "https://pbs.twimg.com/profile_images/1731429124596498432/tN2IVdAp_400x400.jpg",
    },
    {
      user: "Cat",
      id: "1203123",
      text: "The cat is dead",
      picture: "https://material.angular.io/assets/img/examples/shiba2.jpg",
    },
    {
      user: "Scary Guy",
      id: "1203123",
      text: "I'm about to kill this guy",
      picture: "https://material.angular.io/assets/img/examples/shiba2.jpg",
    },
  ]
  flaggeddb: TweetInterface[] = []
  toggleValue: any;

  setForFlag(): void {
    for (let i in this.tweetdb) {
      let tweet = this.tweetdb[i] as FlaggedInterface
      this.flaggerService.moderateText(tweet.text).subscribe(data => {
        if (data.flagged) {
          tweet.flags = data.categories
          this.flaggeddb.push(tweet)
        }
      })
    }
  }

  getTweets(): void {

  }


  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    let themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `assets/${styleName}`; //<--add assets
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.href = `assets/${styleName}`; //<--add assets

      head.appendChild(style);
    }
  }


}
