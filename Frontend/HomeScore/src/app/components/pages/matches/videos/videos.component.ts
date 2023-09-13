import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatchService } from 'src/app/services/backend/match/match.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  public isLoading: boolean = true;
  public videos: any[] = [];

  constructor(private matchService: MatchService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getAllVideoHighlight();
  }
  private getAllVideoHighlight(): void {
    this.matchService.getAllVideoHighlight().subscribe(media => {
      this.videos = media.media.map((video: any) => {
        let embedUrl = video.url.replace("watch?v=", "embed/");
        const ampersandIndex = embedUrl.indexOf('&');
        if (ampersandIndex !== -1) {
          embedUrl = embedUrl.substring(0, ampersandIndex);
        }
        video.url = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        return video;
      });
      this.isLoading = false;
    });
  }
}
