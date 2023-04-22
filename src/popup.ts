import { MessageType } from './enums/message-type.enum';
import { Link } from './models/link.model';
import { Message } from './models/message.model';
import { PopupDisplayService } from './services/popupDisplay.service';

const sendMessageToContent = () => {
  chrome.tabs.query({ active: true }, (tabs) => {
    const message = new Message({ id: MessageType.SEARCH_LINKS });

    const tabId = tabs[0].id;
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, message, (response: Link[]) => {
      PopupDisplayService.instance.links = response;
      PopupDisplayService.instance.displayLinks();
    });
  });
};

const init = () => {
  sendMessageToContent();
};

document.addEventListener('DOMContentLoaded', init);
