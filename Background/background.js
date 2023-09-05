import { handleSearch } from "./requests/search.js";

chrome.webNavigation.onCompleted.addListener((details) =>
  chrome.tabs.sendMessage(details.tabId, { action: "pageLoaded" })
);
chrome.tabs.onCreated.addListener((tab) => chrome.tabs.sendMessage(tab.id, { action: "pageLoaded" }));

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") chrome.tabs.sendMessage(tabId, { action: "pageLoaded" });
});

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    //if (details.url === "https://subask.com/api/fetch-subtitle") {
    //  setTimeout(() => console.log(details), 10000);
    //}

    if (details.tabId && details.tabId >= 0)
      chrome.tabs.sendMessage(details.tabId, { action: "requestMade" });
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "search") {
    handleSearch(request.keyword, sender.tab.id).then((response) => {
      sendResponse({ searchData : response });
    });
    return true;
  } else if (request.message == "get-file") {
    return true;
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "User-Agent",
              operation: "set",
              value: "subtitle-finder-extension v1",
            },
            {
              header: "Accept",
              operation: "set",
              value: "*/*",
            },
            {
              header: "Api-Key",
              operation: "set",
              value: "7fkB2JYnvrvjLOiEAwHCmPERzmBnT6ZF",
            },
            {
              header: "Authorization",
              operation: "set",
              value:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEaWZSWkFLbDdGa09JVU0wNzlZM2YxMG5LRkFic1pkTSIsImV4cCI6MTY5MTUwMDg1M30.uV7epnNEIrhA2O6IrGwwLPTfdiUpVpP8dvlN327gEYk",
            },
          ],
        },
        condition: {
          urlFilter: "https://api.opensubtitles.com/*",
        },
      },
    ],
  });
});