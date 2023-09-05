function SubtitlesText(videoElement, subtitles) {
  const extensionId = chrome.runtime.id;

  const TextContainer = document.createElement("div");
  const Text = document.createElement("span");

  TextContainer.style = `
	position: absolute;
	bottom: 4rem;
	text-align: center;
	width: 100%;
	`;
  Text.style = `
	width: 100%;
	color: white;
	font-weight: bold;
	user-select: none;
	font-size: 24px;
	`;

  TextContainer.id = `subtitle-text-${extensionId}`;

  // TODO: Change the algorithm !!!!!!!!!!!!!!!
  videoElement.ontimeupdate = () => {
    if (!subtitles) return;

    const currentTime = Math.round(videoElement.currentTime);
    let subtitleToShow = "";

    for (let subtitle of subtitles) {
      for (let second of subtitle.secondsToShow)
        if (currentTime == second) subtitleToShow = subtitle.subtitle;
    }

    Text.innerHTML = subtitleToShow;
  };

  chrome.storage.onChanged.addListener((changes) => {
    if (changes["Text Color"] && changes["Text Color"].newValue)
      Text.style.color = changes["Text Color"].newValue;
    if (changes["Background Color"] && changes["Background Color"].newValue)
      Text.style.backgroundColor = changes["Background Color"].newValue;
    if (changes["Text Size"] && changes["Text Size"].newValue) {
      switch (changes["Text Size"].newValue) {
        case "Small":
          Text.style.fontSize = "16px";
          break;
        case "Normal":
          Text.style.fontSize = "24px";
          break;
        case "Big":
          Text.style.fontSize = "32px";
          break;
        case "Very Big":
          Text.style.fontSize = "40px";
          break;
      }
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement)
      Text.style.fontSize = String(Text.style.fontSize.slice(0, -2) + 16) + "px";
    else Text.style.fontSize = String(Text.style.fontSize.slice(0, -2) - 16) + "px";
  });

  TextContainer.appendChild(Text);

  return TextContainer;
}
