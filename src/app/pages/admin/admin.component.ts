import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  UrlSegment,
  UrlSegmentGroup,
  UrlSerializer,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  url: string;
  doctor: boolean = false;
  constructor(private router: Router, private urlSerializer: UrlSerializer) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlTree = this.router.parseUrl(event.url);
        const urlSegmentGroup: UrlSegmentGroup =
          urlTree.root.children['primary'];
        const segments: UrlSegment[] = urlSegmentGroup?.segments;
        const baseRoute =
          '/' +
          segments
            ?.slice(0, 2)
            .map((segment) => segment.path)
            .join('/');
        this.url = baseRoute;
        if (segments[2]) {
          this.doctor = !isNaN(Number(segments[2]?.path));
        }
      });
  }
}
