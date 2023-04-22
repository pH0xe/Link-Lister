import { SourceType } from '../enums/source-type.enum';
import { Link } from '../models/link.model';
import { LinkItemComponent } from './linkItem.component';

export class LinkGroupComponent {
  private _element: HTMLDetailsElement;

  constructor(type: SourceType, links: Link[]) {
    this._element = document.createElement('details');
    this._element.className = 'link-group';
    this.addSummary(type);
    const groupBody = this.addLinksGroupBody(links);
    this.addLinks(links, groupBody);
  }

  get HTMLElement() {
    return this._element;
  }

  private addSummary(type: SourceType): HTMLElement {
    const summary = document.createElement('summary');

    const linkGroupTitleElement = document.createElement('h2');
    linkGroupTitleElement.classList.add('link-group-title');
    linkGroupTitleElement.innerHTML = type;
    summary.appendChild(linkGroupTitleElement);

    const iconElement = document.createElement('img');
    iconElement.classList.add('link-group-icon');
    iconElement.src = `/images/view/expand.svg`;
    iconElement.alt = 'expand/collapse';
    iconElement.title = 'expand/collapse';
    summary.appendChild(iconElement);

    this._element.appendChild(summary);
    return summary;
  }

  private addLinksGroupBody(links: Link[]): HTMLDivElement {
    const linkGroupBody = document.createElement('div');
    linkGroupBody.classList.add('link-group-body');
    this._element.appendChild(linkGroupBody);
    return linkGroupBody;
  }

  private addLinks(links: Link[], groupBody: HTMLDivElement): void {
    links.forEach((link) => {
      const linkItem = new LinkItemComponent(link);
      groupBody.appendChild(linkItem.HTMLElement);
    });
  }
}
