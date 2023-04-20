import { MessageType } from './enums/message-type.enum';
import { OriginType } from './enums/originType.enum';
import { Link } from './models/link.model';
import { Message } from './models/message.model';
import { HTMLParser } from './services/htmlParser.service';
import { LinkService } from './services/link.service';

const onMessage = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: Link[]) => void
) => {
  if ((message.id = MessageType.SEARCH_LINKS)) {
    const links = searchLinks();
    sendResponse(links);
  }
};

const searchLinks = () => {
  const htmlParser = HTMLParser.instance;
  htmlParser.setDocument(document);
  const linkService = LinkService.instance;
  linkService.setUrls(window.location.origin, window.location.href);
  const links = linkService.getLinks(
    htmlParser.getAnchors(),
    htmlParser.getLinks(),
    htmlParser.getImages(),
    htmlParser.getScripts(),
    htmlParser.getLinksByRegex(OriginType.HEAD),
    htmlParser.getLinksByRegex(OriginType.BODY),
    htmlParser.getMailsByRegex(OriginType.HEAD),
    htmlParser.getMailsByRegex(OriginType.BODY)
  );
  return links;
};

chrome.runtime.onMessage.addListener(onMessage);
