import { DocumentExtension } from '../enums/document-extension';
import { OriginType } from '../enums/originType.enum';
import { SourceType } from '../enums/source-type.enum';
import { Link } from '../models/link.model';

export class LinkService {
  private static readonly _instance = new LinkService();
  private baseUrl?: string;
  private currentUrl?: string;

  private constructor() {}
  static get instance() {
    return this._instance;
  }

  setUrls(baseUrl: string, currentUrl: string) {
    this.baseUrl = baseUrl;
    this.currentUrl = currentUrl;
  }

  getLinks(
    anchors: HTMLAnchorElement[],
    linksElements: HTMLLinkElement[],
    images: HTMLImageElement[],
    scripts: HTMLScriptElement[],
    headLinks: string[],
    bodyLinks: string[],
    headMails: string[],
    bodyMails: string[]
  ): Link[] {
    if (!this.baseUrl || !this.currentUrl) {
      throw new Error('Urls not set');
    }
    let links = [
      ...this.getLinksFromAnchors(anchors),
      ...this.getLinksFromLinks(linksElements),
      ...this.getLinksFromImages(images),
      ...this.getLinksFromScripts(scripts),
      ...this.getLinksFromStrings(headLinks, OriginType.HEAD),
      ...this.getLinksFromStrings(bodyLinks, OriginType.BODY),
      ...this.getMailsFromStrings(headMails, OriginType.HEAD),
      ...this.getMailsFromStrings(bodyMails, OriginType.BODY)
    ];
    links = this.uniqueLinks(links);
    links.forEach((link, index) => (link.id = index));
    return links;
  }

  getLinksFromAnchors(anchors: HTMLAnchorElement[]): Link[] {
    const links: Link[] = [];
    anchors.forEach((anchor) => {
      const url = anchor.href;
      if (!url || url.startsWith('mailto:')) return;

      const type = SourceType.getSourceTypeFromAnchor(
        url,
        this.isAnchorLink(url),
        this.isBaseUrl(url),
        this.isDocumentLink(url)
      );
      links.push(new Link({ type, url }));
    });
    return links;
  }

  getLinksFromLinks(linksElement: HTMLLinkElement[]): Link[] {
    const links: Link[] = [];
    linksElement.forEach((linkElement) => {
      const url = linkElement.href;
      const rel = linkElement.rel;
      if (!url) return;
      const type = SourceType.getSourceTypeFromLink(rel, this.isBaseUrl(url));
      links.push(new Link({ type, url }));
    });
    return links;
  }

  getLinksFromImages(images: HTMLImageElement[]): Link[] {
    const links: Link[] = [];
    images.forEach((image) => {
      const url = image.src;
      const type = SourceType.getSourceTypeFromImage(this.isBaseUrl(url));
      links.push(new Link({ type, url }));
    });
    return links;
  }

  getLinksFromScripts(scripts: HTMLScriptElement[]): Link[] {
    const links: Link[] = [];
    scripts.forEach((script) => {
      const url = script.src;
      if (!url) return;
      const type = SourceType.getSourceTypeFromScript(this.isBaseUrl(url));
      links.push(new Link({ type, url }));
    });
    return links;
  }

  getLinksFromStrings(linksElement: string[], origin: OriginType): Link[] {
    const links: Link[] = [];
    linksElement.forEach((link) => {
      if (!link) return;
      const type = SourceType.getSourceTypeFromString(
        this.isDocumentLink(link),
        this.isBaseUrl(link)
      );
      links.push(new Link({ type: type, url: link }));
    });
    return links;
  }

  getMailsFromStrings(mails: string[], origin: OriginType): Link[] {
    const links: Link[] = [];
    mails.forEach((mail) => {
      if (!mail) return;
      links.push(new Link({ type: SourceType.MAIL, url: mail }));
    });
    return links;
  }

  private uniqueLinks(links: Link[]): Link[] {
    return links.filter(
      (link, i, arr) => arr.findIndex((t) => t.equals(link)) === i
    );
  }

  private isAnchorLink(link: string): boolean {
    return this.isCurrentLink(link) && link.includes('#');
  }

  private isDocumentLink(link: string): boolean {
    for (const ext of DocumentExtension) {
      if (link.includes(ext)) {
        return true;
      }
    }
    return false;
  }

  private isCurrentLink(link: string): boolean {
    if (!this.currentUrl) {
      throw new Error('Current url not set');
    }
    return link.startsWith(this.currentUrl.split('#')[0]);
  }

  private isBaseUrl(link: string): boolean {
    if (!this.baseUrl) {
      throw new Error('Base url not set');
    }
    return link.startsWith(this.baseUrl);
  }
}
