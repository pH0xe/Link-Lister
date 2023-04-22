import { LinkGroupComponent } from '../components/linkGroup.component';
import { SourceType } from '../enums/source-type.enum';
import { Link } from '../models/link.model';

export class PopupDisplayService {
  private static readonly _instance = new PopupDisplayService();

  links: Link[] = [];

  private constructor() {}
  static get instance() {
    return this._instance;
  }

  displayLinks() {
    if (!this.links.length) return;
    const linksContainer = document.getElementById('link-list');
    if (!linksContainer) return;
    const linksByType = this.linksByType(this.links);

    for (const [type, links] of linksByType) {
      linksContainer.appendChild(
        new LinkGroupComponent(type, links).HTMLElement
      );
    }
  }

  clearLinks() {
    const linksContainer = document.getElementById('link-list');
    if (!linksContainer) return;
    linksContainer.innerHTML = '';
  }

  linksByType(links: Link[]): Map<SourceType, Link[]> {
    const linksByType = new Map<SourceType, Link[]>();
    links.forEach((link) => {
      const type = link.type;
      if (linksByType.has(type)) {
        linksByType.get(type)?.push(link);
      } else {
        linksByType.set(type, [link]);
      }
    });
    return linksByType;
  }
}
