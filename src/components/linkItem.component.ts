import { SourceType } from '../enums/source-type.enum';
import { Link } from '../models/link.model';

export class LinkItemComponent {
  private _element: HTMLDivElement;

  private validationButton: HTMLButtonElement;

  constructor(link: Link) {
    this._element = document.createElement('div');
    this.id = link.id.toString();
    this.className = 'link-item';
    this.addLinkSpan(link);
    this.addButtons(link, 'copy-button', 'Copy', this.copyLink);
    this.addButtons(link, 'go-to-button', 'Go To', this.openLink);
    this.validationButton = this.addButtons(
      link,
      'validate-button',
      'Validate',
      this.validateLink
    );
  }

  set id(id: string) {
    this._element.id = id;
  }

  set className(className: string) {
    this._element.className = className;
  }

  set innerHTML(innerHTML: string) {
    this._element.innerHTML = innerHTML;
  }

  get HTMLElement() {
    return this._element;
  }

  private addLinkSpan(link: Link): HTMLSpanElement {
    const span = document.createElement('span');
    span.classList.add('link');
    span.innerHTML = link.url;
    span.title = link.url;
    this._element.appendChild(span);
    return span;
  }

  private addButtons(
    link: Link,
    className: string,
    text: string,
    event: (link: Link) => void
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add(className);
    button.innerHTML = text;
    button.addEventListener('click', event.bind(this, link));
    this._element.appendChild(button);
    return button;
  }

  private copyLink(link: Link) {
    navigator.clipboard.writeText(link.url);
  }

  private openLink(link: Link) {
    if (link.type === SourceType.MAIL) {
      chrome.tabs.create({ url: `mailto:${link.url}` });
    } else if (link.type === SourceType.ANCHOR) {
      chrome.tabs.update({ url: link.url });
    } else {
      chrome.tabs.create({ url: link.url });
    }
  }

  private validateLink(link: Link) {
    this.waitingStatus();
    fetch(link.url)
      .then((response) => {
        this.updateLinkStatus(response.status === 200);
      })
      .catch((error) => {
        this.updateLinkStatus(false);
      });
  }

  private waitingStatus() {
    this.validationButton.innerHTML = 'Waiting...';
    this.validationButton.disabled = true;
    this.validationButton.classList.remove('valid');
    this.validationButton.classList.remove('invalid');
    this.validationButton.classList.add('waiting');
  }

  private updateLinkStatus(isValid: boolean) {
    this.validationButton.innerHTML = isValid ? 'Valid' : 'Invalid';
    this.validationButton.disabled = false;
    this.validationButton.classList.remove('waiting');
    this.validationButton.classList.add(isValid ? 'valid' : 'invalid');
  }
}
