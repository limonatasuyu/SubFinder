function SearchResult(title, poster_url, goToSubtitles) {
  const Container = document.createElement("div");
  const PosterContainer = document.createElement("div");
  const PosterImg = document.createElement("img");
  const TextContainer = document.createElement("div");
  const Title = document.createElement("span");
  const SeeSubtitlesButton = document.createElement("span");
  //const useSubtitleButton = document.createElement("button");
  const ArrowIconContainer = document.createElement("div");

  Container.style = `
	display: flex;
	height: 100px;
	align-items: center;
	background-color: rgb(50, 50, 50);
	gap: 8px;
	padding: 5px;
	border-radius: 5px;
	`;
  PosterContainer.style = `
	height: 100px;
	width: 70px;
	overflow: hidden;
  `;
  PosterImg.style = `
	height: 100px;
	width: auto;
	`;
  TextContainer.style = `
	display: flex;
  flex-direction: column;
  gap: 4px;
  color: white;
  font-weight: bold;
  width: 240px;
	`;
  Title.style = `
  font-family: sans-serif;
  font-size: 15px;
  user-select: none;
  `;
  SeeSubtitlesButton.style = `
  cursor: pointer;
  color: gray;
  text-decoration: underline;
  font-size: 12px;
  width: fit-content;
  `;
  /*useSubtitleButton.style = `
	background-color: rgb(133, 133, 133);
	border: none;
	outline: none;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	color: white;
	height: 20px;
	font-weight: bold;
	`;*/
  ArrowIconContainer.style = `
  transform: rotate(-90deg);
  cursor: pointer;
  `;

  const fallbackPosterUrl = chrome.runtime.getURL("assets/icons/movie_icon.png");
  PosterImg.src = poster_url !== undefined ? poster_url : fallbackPosterUrl;
  PosterImg.alt = "Show Poster image";
  //useSubtitleButton.className = `button-${id}`;
  //useSubtitleButton.innerText = "Use";
  ArrowIconContainer.innerHTML = arrowIcon("#808080");
  if (!title.split) console.log(title);
  Title.innerText = title.split(".").join(" ");
  SeeSubtitlesButton.innerText = "See the subtitles";

  PosterImg.onerror = () => (PosterImg.src = fallbackPosterUrl);

  SeeSubtitlesButton.onclick = ArrowIconContainer.onclick = () => goToSubtitles();

  /*const handleUse = () => {
    const handleMessageRespone = (res) => {
      const subtitleElement = document.getElementById(`subtitle-title-${extensionId}`);
      if (subtitleElement) parentElement.removeChild(subtitleElement);
      if (res.subtitles) {
        parentElement.appendChild(SubtitlesText(videoElement, res.subtitles));
        useSubtitleButton.onclick = () => {};
        useSubtitleButton.innerText = "Using";
        useSubtitleButton.style.backgroundColor = "rgb(45,200,45)";
        chrome.storage.local.set({ "button id": id });
      } else {
        useSubtitleButton.onclick = handleUse;
        useSubtitleButton.innerText = "error";
        useSubtitleButton.title = "Try Again";
        useSubtitleButton.style.backgroundColor = "rgb(45,200,45)";
      }
    };
    chrome.runtime.sendMessage({ message: "get-file", file_id: subtitleFileId }, handleMessageRespone);
  };
  useSubtitleButton.onclick = handleUse;*/

  /*chrome.storage.onChanged.addListener((changes) => {
    if (changes["button id"] && changes["button id"].newValue != id) {
      useSubtitleButton.onclick = handleUse;
      useSubtitleButton.innerText = "Use";
      useSubtitleButton.style.backgroundColor = "rgb(133, 133, 133)";
    }
  });*/

  TextContainer.appendChild(Title);
  TextContainer.appendChild(SeeSubtitlesButton);
  PosterContainer.appendChild(PosterImg);
  Container.appendChild(PosterContainer);
  Container.appendChild(TextContainer);
  Container.appendChild(ArrowIconContainer);
  //Container.appendChild(useSubtitleButton);

  return Container;
}

const languages = {
  en: {
    language: "English",
    country: "United Kingdom",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
  },
  es: {
    language: "Spanish",
    country: "Spain",
    flag: "\uD83C\uDDEA\uD83C\uDDF8",
  },
  fr: {
    language: "French",
    country: "France",
    flag: "\uD83C\uDDEB\uD83C\uDDF7",
  },
  de: {
    language: "German",
    country: "Germany",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
  },
  it: {
    language: "Italian",
    country: "Italy",
    flag: "\uD83C\uDDEE\uD83C\uDDF9",
  },
  pt: {
    language: "Portuguese",
    country: "Portugal",
    flag: "\uD83C\uDDF5\uD83C\uDDF9",
  },
  ja: {
    language: "Japanese",
    country: "Japan",
    flag: "\uD83C\uDDEF\uD83C\uDDF5",
  },
  zh: {
    language: "Chinese",
    country: "China",
    flag: "\uD83C\uDDE8\uD83C\uDDF3",
  },
  ko: {
    language: "Korean",
    country: "South Korea",
    flag: "\uD83C\uDDF0\uD83C\uDDF7",
  },
  ar: {
    language: "Arabic",
    country: "Saudi Arabia",
    flag: "\uD83C\uDDE6\uD83C\uDDEA",
  },
  ru: {
    language: "Russian",
    country: "Russia",
    flag: "\uD83C\uDDF7\uD83C\uDDFA",
  },
  hi: {
    language: "Hindi",
    country: "India",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  tr: {
    language: "Turkish",
    country: "Turkey",
    flag: "\uD83C\uDDF9\uD83C\uDDF7",
  },
  nl: {
    language: "Dutch",
    country: "Netherlands",
    flag: "\uD83C\uDDF3\uD83C\uDDF1",
  },
  sv: {
    language: "Swedish",
    country: "Sweden",
    flag: "\uD83C\uDDF8\uD83C\uDDEA",
  },
  no: {
    language: "Norwegian",
    country: "Norway",
    flag: "\uD83C\uDDF3\uD83C\uDDF4",
  },
  da: {
    language: "Danish",
    country: "Denmark",
    flag: "\uD83C\uDDE9\uD83C\uDDF0",
  },
  fi: {
    language: "Finnish",
    country: "Finland",
    flag: "\uD83C\uDDEB\uD83C\uDDEE",
  },
  el: {
    language: "Greek",
    country: "Greece",
    flag: "\uD83C\uDDEC\uD83C\uDDF7",
  },
  he: {
    language: "Hebrew",
    country: "Israel",
    flag: "\uD83C\uDDEE\uD83C\uDDF1",
  },
  pl: {
    language: "Polish",
    country: "Poland",
    flag: "\uD83C\uDDF5\uD83C\uDDF1",
  },
  cs: {
    language: "Czech",
    country: "Czech Republic",
    flag: "\uD83C\uDDE8\uD83C\uDDFF",
  },
  hu: {
    language: "Hungarian",
    country: "Hungary",
    flag: "\uD83C\uDDED\uD83C\uDDFA",
  },
  th: {
    language: "Thai",
    country: "Thailand",
    flag: "\uD83C\uDDF9\uD83C\uDDED",
  },
  id: {
    language: "Indonesian",
    country: "Indonesia",
    flag: "\uD83C\uDDEE\uD83C\uDDE9",
  },
  vi: {
    language: "Vietnamese",
    country: "Vietnam",
    flag: "\uD83C\uDDFB\uD83C\uDDF3",
  },
  bg: {
    language: "Bulgarian",
    country: "Bulgaria",
    flag: "\uD83C\uDDE7\uD83C\uDDEC",
  },
  hr: {
    language: "Croatian",
    country: "Croatia",
    flag: "\uD83C\uDDED\uD83C\uDDF7",
  },
  et: {
    language: "Estonian",
    country: "Estonia",
    flag: "\uD83C\uDDEA\uD83C\uDDEA",
  },
  lt: {
    language: "Lithuanian",
    country: "Lithuania",
    flag: "\uD83C\uDDF1\uD83C\uDDF9",
  },
  lv: {
    language: "Latvian",
    country: "Latvia",
    flag: "\uD83C\uDDF1\uD83C\uDDFB",
  },
  ro: {
    language: "Romanian",
    country: "Romania",
    flag: "\uD83C\uDDF7\uD83C\uDDF4",
  },
  sk: {
    language: "Slovak",
    country: "Slovakia",
    flag: "\uD83C\uDDF8\uD83C\uDDF0",
  },
  sl: {
    language: "Slovenian",
    country: "Slovenia",
    flag: "\uD83C\uDDF8\uD83C\uDDF1",
  },
  uk: {
    language: "Ukrainian",
    country: "Ukraine",
    flag: "\uD83C\uDDFA\uD83C\uDDE6",
  },
  af: {
    language: "Afrikaans",
    country: "South Africa",
    flag: "\uD83C\uDDE6\uD83C\uDDEA",
  },
  sw: {
    language: "Swahili",
    country: "Kenya",
    flag: "\uD83C\uDDF0\uD83C\uDDF2",
  },
  ms: {
    language: "Malay",
    country: "Malaysia",
    flag: "\uD83C\uDDF2\uD83C\uDDFE",
  },
  sr: {
    languge: "Serbian",
    country: "Serbian",
    flag: "\uD83C\uDDF7\uD83C\uDDF8",
  },
  unknown: { flag: "\uD83C\uDFF3\uFE0F" },
};
