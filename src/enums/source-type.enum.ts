export enum SourceType {
  ANCHOR = 'Anchor', // anchor
  DOCUMENT = 'Document', // anchor, strings
  EXTERNAL = 'External', // anchor, strings
  INTERNAL = 'Internal', // strings

  INTERNAL_IMAGE = 'Internal image', // image
  EXTERNAL_IMAGE = 'External image', // image

  INTERNAL_STYLE = 'Internal style', // link
  EXTERNAL_STYLE = 'External style', // link

  INTERNAL_LINK = 'Internal link', // link
  EXTERNAL_LINK = 'External link', // link

  INTERNAL_SCRIPT = 'Internal script', // script
  EXTERNAL_SCRIPT = 'External script', // script
  MAIL = 'Mail' // string
}

export namespace SourceType {
  export function getSourceTypeFromAnchor(
    url: string,
    isAnchorLink: boolean,
    isBaseUrl: boolean,
    isDocumentLink: boolean
  ): SourceType {
    // Mailto are ignored
    if (isAnchorLink) return SourceType.ANCHOR;
    if (isBaseUrl) return SourceType.INTERNAL;
    if (isDocumentLink) return SourceType.DOCUMENT;

    return SourceType.EXTERNAL;
  }

  export function getSourceTypeFromLink(
    rel: string,
    isBaseUrl: boolean
  ): SourceType {
    if (isBaseUrl && rel.toLowerCase() === 'stylesheet') {
      return SourceType.INTERNAL_STYLE;
    }
    if (isBaseUrl) {
      return SourceType.INTERNAL_LINK;
    }
    // External
    if (rel.toLowerCase() === 'stylesheet') {
      return SourceType.EXTERNAL_STYLE;
    }
    return SourceType.EXTERNAL_LINK;
  }

  export function getSourceTypeFromImage(isBaseUrl: boolean): SourceType {
    if (isBaseUrl) {
      return SourceType.INTERNAL_IMAGE;
    }
    return SourceType.EXTERNAL_IMAGE;
  }

  export function getSourceTypeFromScript(isBaseUrl: boolean): SourceType {
    if (isBaseUrl) {
      return SourceType.INTERNAL_SCRIPT;
    }
    return SourceType.EXTERNAL_SCRIPT;
  }

  export function getSourceTypeFromString(
    isDocumentLink: boolean,
    isBaseUrl: boolean
  ): SourceType {
    if (isDocumentLink) {
      return SourceType.DOCUMENT;
    }
    if (isBaseUrl) {
      return SourceType.INTERNAL;
    }
    return SourceType.EXTERNAL;
  }
}
