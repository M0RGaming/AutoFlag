import {Component, Inject, Pipe, PipeTransform} from '@angular/core';
import {FlaggerService} from "./flagger/flagger";
import {fourchanInterface, TweetInterface} from "./tweet-interface";
import {DOCUMENT} from "@angular/common";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private flaggerService: FlaggerService, private dialog: MatDialog) {}
  title = 'autoflag';
  showFiller = false;


  ignored = false
  anyList = true

  flaggeddb: fourchanInterface[] = []
  ignoreddb: fourchanInterface[] = []
  toggleValue: any;


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

  deleteCallback(tweet: fourchanInterface): void {
    this.flaggeddb = this.flaggeddb.filter(function (el) {
      return el.no != tweet.no;
    })
  }
  deleteIgnoreCallback(tweet: fourchanInterface): void {
    this.ignoreddb = this.ignoreddb.filter(function (el) {
      return el.no != tweet.no;
    })
  }

  clickIgnoreCallback(tweet: fourchanInterface): void {
    this.flaggeddb = this.flaggeddb.filter(function (el) {
      return el.no != tweet.no;
    })
    this.ignoreddb.push(tweet)
    console.log(this.ignoreddb)
  }



  async openQueryModal(): Promise<string> {
    const dialogRef = this.dialog.open(QueryModalComponent, {
      width: '400px'
    });

    const result = await dialogRef.afterClosed().toPromise();

    return result;
  }

  async saveQuery() {
    const queryValue = await this.openQueryModal();
    console.log('Entered query url:', queryValue);
    this.flaggerService.moderateText(queryValue).subscribe(data => {
      console.log(data)
      this.flaggeddb = this.flaggeddb.concat(data.posts)
      console.log(this.flaggeddb)
    })

  }




}


@Component({
  selector: 'app-query-modal',
  template: `
    <h2 mat-dialog-title>Enter URL of 4Chan Thread</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input matInput #queryNameInput placeholder="Thread URL">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit(queryNameInput.value)">Save</button>
    </mat-dialog-actions>
  `
})
export class QueryModalComponent {

  constructor(
    private dialogRef: MatDialogRef<QueryModalComponent>
  ) { }

  onSubmit(queryName: string) {
    this.dialogRef.close(queryName);
  }
}


@Pipe({name: 'replaceLineBreaks'})
export class ReplaceLineBreaks implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }
}


@Pipe({name: 'flagHarrasment'})
export class FlagHarrasment implements PipeTransform {
  transform(value: Object): string {
    let out = ""
    let maps = {
      "harassment": "Harassment",
      "hate": "Hate Speech",
      "sexual": "Sexual Content",
      "self-harm": "Self Harm",
      "sexual/minors": "Sexual Content regarding Minors",
      "hate/threatening": "Hate Speech",
      "violence/graphic": "Graphic Violence",
      "self-harm/intent": "Intent of Self Harm",
      "self-harm/instructions": "Instructions of Self Harm",
      "harassment/threatening": "Harassment and threatening",
      "violence": "Violence"
    }
    for (let i in Object.keys(value)) {
      // @ts-ignore
      let translated = maps[Object.keys(value)[i]]
      if (translated) {
        out += translated
        out += ", "
      }
    }
    return out.slice(0,-2)
    //return value.replace(/\n/g, '<br/>');
  }
}
