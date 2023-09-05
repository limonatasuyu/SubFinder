(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "pageLoaded" || message.action === "requestMade") {
      const videoElements = document.getElementsByTagName("video");
      if (videoElements.length === 0) return;

      const extensionId = chrome.runtime.id;
      const buttonExists = document.getElementById(`subtitles-extension-button-${extensionId}`);
      if (buttonExists) return;

      for (let videoElement of videoElements) {
        //if (!videoElement.controls) continue;
        let parentElement;
        let isJwPlayer = Array.from(videoElement.classList).includes("jw-video");

        if (isJwPlayer) parentElement = videoElement.parentNode.parentNode;
        else parentElement = videoElement.parentNode;

        parentElement.appendChild(UIModal(videoElement, parentElement));
      }
    } else if (message.action === "formatHTML") {
      var responseData;
      const HTMLText = message.HTMLText;

      if (!HTMLText) responseData = { data: [], total_pages: 1 };
      else responseData = formatHTML(HTMLText, message.baseUrl, ...message.dataPaths);

      sendResponse(responseData);
      return true;
    }
  });
})();
