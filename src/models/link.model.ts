import { SourceType } from '../enums/source-type.enum';

export class Link {
  // set by content script
  type!: SourceType;
  url!: string;

  constructor(obj: Partial<Link>) {
    Object.assign(this, obj);
  }

  equals(other: Link): boolean {
    return this.url === other.url;
  }
}
