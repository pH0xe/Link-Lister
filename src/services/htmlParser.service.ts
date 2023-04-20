import { OriginType } from '../enums/originType.enum';

export class HTMLParser {
  private static readonly _instance = new HTMLParser();

  private doc?: Document;

  private constructor() {}
  static get instance() {
    return this._instance;
  }

  setDocument(doc: Document) {
    this.doc = doc;
  }

  getAnchors(): HTMLAnchorElement[] {
    if (!this.doc) {
      throw new Error('Document not set');
    }
    return Array.from(this.doc.getElementsByTagName('a'));
  }

  getLinks(): HTMLLinkElement[] {
    if (!this.doc) {
      throw new Error('Document not set');
    }
    return Array.from(this.doc.getElementsByTagName('link'));
  }

  getImages(): HTMLImageElement[] {
    if (!this.doc) {
      throw new Error('Document not set');
    }
    return Array.from(this.doc.getElementsByTagName('img'));
  }

  getScripts(): HTMLScriptElement[] {
    if (!this.doc) {
      throw new Error('Document not set');
    }
    return Array.from(this.doc.getElementsByTagName('script'));
  }

  getLinksByRegex(source: OriginType): string[] {
    if (!this.doc) {
      throw new Error('Document not set');
    }
    const ignoreCharacters = `\\s"'\\\\`;
    const regexStr = `https?[^${ignoreCharacters}]*`;
    const regex = new RegExp(regexStr, 'gi');

    const text =
      source === OriginType.BODY
        ? this.doc.body.innerHTML
        : this.doc.head.innerHTML;
    const matches = text.match(regex);

    return matches ? matches : [];
  }

  getMailsByRegex(source: OriginType): string[] {
    if (!this.doc) {
      throw new Error('Document not set');
    }

    const regex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/gi;

    const text =
      source === OriginType.BODY
        ? this.doc.body.innerHTML
        : this.doc.head.innerHTML;
    const matches = text.match(regex);
    return matches ? matches : [];
  }
}
