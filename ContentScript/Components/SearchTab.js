function SearchTab(parentElement, videoElement) {
  const extensionId = chrome.runtime.id;

  const TabContainer = document.createElement("div");
  const SearchContainer = document.createElement("div");
  const SearchArea = document.createElement("div");
  const SearchInput = document.createElement("input");
  const SearchButton = document.createElement("button");
  const SearchResults = document.createElement("div");
  const SubtitlesContainer = document.createElement("div");
  const Spinner = document.createElement("div");
  const NotFound = document.createElement("div");

  TabContainer.style = `
  display: flex;
  overflow: hidden;
  width: inherit;
  `;
  SearchContainer.style = `
	display: flex;
	flex-direction: column;
	gap: 16px;
  width: inherit;
	`;
  SubtitlesContainer.style = `
  width: inherit;
  height: inherit;
  `;
  SearchArea.style = `
	display: flex;
	gap: 16px;
	height: 40px;
  border-radius: 24px;
  border: 1px solid #b2b5bd33;
  align-items: center;
  width: 378px;
	`;
  SearchInput.style = `
  background-color: transparent;
  font-size: 16px;
	width: 100%;
  border: none;
  color: white;
	`;
  SearchButton.style = `
	background-color: #222;
	border: none;
	outline: none;
	width: 13px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
  border-radius: 33px;
  height: 63%;
  margin-right: 8px;
	`;
  SearchResults.style = `
	display: flex;
	flex-direction: column;
	gap: 4px;
	height: 260px;
	overflow-y: auto;
	padding-right: 5px;
	`;
  Spinner.style.display = "none";
  NotFound.style = `
  color: gray;
  font-family: sans-serif;
  font-weight: bold;
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 25px;
  `;

  SearchResults.className = `search-results-${extensionId}`;
  SearchInput.className = `search-input-${extensionId}`;
  Spinner.className = `spinner-${extensionId}`;
  SearchInput.type = "text";
  SearchInput.placeholder = "Search for the show name";
  SearchButton.innerHTML = SearchIcon;
  NotFound.innerText = "No results found.";

  var oldSearchValue = "";
  SearchButton.onclick = () => {
    const searchValue = SearchInput.value;
    if (oldSearchValue === searchValue) return;

    oldSearchValue = searchValue;
    if (searchValue.length < 3) {
      alert("Please insert more than 3 characters");
      return;
    }

    Spinner.style.display = "inline-block";

    let ShowContent;
    function changeContent(data) {
      const tabWidth = 382;
      const animation = [
        [{ marginLeft: "0px" }, { marginLeft: `-${tabWidth}px` }],
        {
          duration: 200,
          iterations: 1,
          fill: "forwards",
        },
      ];

      if (!data) {
        animation[0][0].marginLeft = `-${tabWidth}px`;
        animation[0][1].marginLeft = "0px";
        SearchContainer.animate(animation[0], animation[1]);
        SubtitlesContainer.removeChild(ShowContent);
      } else {
        ShowContent = Content(data, () => changeContent());
        SubtitlesContainer.appendChild(ShowContent);
        SearchContainer.animate(animation[0], animation[1]);
      }
    }

    function handleMessageResponse(response) {
      SearchResults.innerHTML = "";
      if (!response.searchData.length) {
        SearchResults.appendChild(NotFound);
      } else {
        console.log("test");
        mergeData(response.searchData).map((i) =>
          SearchResults.appendChild(SearchResult(i.title, i.poster_url, () => changeContent(i)))
        );
      }
      Spinner.style.display = "none";

      /*chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log(message);
        if (message.action !== "SecondarySearchData" || !message.searchData || !message.searchData.length)
          return;
        SearchResults.innerHTML = "";
        console.log(message.searchData);
        mergeSearchData([response.searchData, message.searchData].flat()).map((i) => {
          SearchResults.appendChild(SearchResult(i.title, i.poster_url, () => changeContent(i)));
        });
      });*/
    }

    chrome.runtime.sendMessage({ message: "search", keyword: searchValue }, handleMessageResponse);
  };

  SearchArea.appendChild(SearchInput);
  SearchArea.appendChild(Spinner);
  SearchArea.appendChild(SearchButton);
  SearchContainer.appendChild(SearchArea);
  SearchContainer.appendChild(SearchResults);
  TabContainer.appendChild(SearchContainer);
  TabContainer.appendChild(SubtitlesContainer);

  return TabContainer;
}

const SearchIcon = `
<svg style="margin-bottom: 2px;" viewBox="0 0 600 600" version="1.1" id="svg9724" sodipodi:docname="search.svg" inkscape:version="1.2.2 (1:1.2.2+202212051550+b0a8486541)" width="30" height="28">
	<defs id="defs9728"/>
	<sodipodi:namedview id="namedview9726" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" showgrid="true" inkscape:zoom="0.84118632" inkscape:cx="29.125533" inkscape:cy="385.76471" inkscape:window-width="1920" inkscape:window-height="1009" inkscape:window-x="0" inkscape:window-y="1080" inkscape:window-maximized="1" inkscape:current-layer="g10449" showguides="true">
		<inkscape:grid type="xygrid" id="grid9972" originx="0" originy="0"/>
		<sodipodi:guide position="-260,300" orientation="0,-1" id="guide383" inkscape:locked="false"/>
		<sodipodi:guide position="300,520" orientation="1,0" id="guide385" inkscape:locked="false"/>
		<sodipodi:guide position="240,520" orientation="0,-1" id="guide939" inkscape:locked="false"/>
		<sodipodi:guide position="220,80" orientation="0,-1" id="guide941" inkscape:locked="false"/>
	</sodipodi:namedview>

	<g id="g10449" transform="matrix(0.95173205,0,0,0.95115787,13.901174,12.168794)" style="stroke-width:1.05103">
		<path style="color:#000000;fill:#fff;stroke-linecap:round;stroke-linejoin:round;-inkscape-stroke:none;paint-order:stroke fill markers" d="m 206.04492,-12.792969 c -121.380675,0 -220.650389,99.36284 -220.650389,220.783199 0,121.42037 99.269714,220.78321 220.650389,220.78321 121.38068,0 220.65039,-99.36284 220.65039,-220.78321 0,-121.420359 -99.26971,-220.783199 -220.65039,-220.783199 z m 0,84.082031 c 75.90523,10e-7 136.56641,60.688518 136.56641,136.701168 0,76.01266 -60.66118,136.70118 -136.56641,136.70118 -75.90522,0 -136.568357,-60.68852 -136.568358,-136.70118 10e-7,-76.01265 60.663138,-136.701168 136.568358,-136.701168 z" id="path397"/>
		<g id="path10026" inkscape:transform-center-x="-0.59233046" inkscape:transform-center-y="-20.347403" transform="matrix(1.3807551,0,0,1.2700888,273.60014,263.99768)"/>
		<g id="g11314" transform="matrix(1.5092301,0,0,1.3955555,36.774048,-9.4503933)" style="stroke-width:50.6951"/>
		<path style="color:#000000;fill:#fff;stroke-linecap:round;-inkscape-stroke:none" d="m 332.15625,292.14648 a 42.041302,42.041302 0 0 0 -29.73242,12.30469 42.041302,42.041302 0 0 0 -0.0176,59.45508 l 241.63867,241.78711 a 42.041302,42.041302 0 0 0 59.45508,0.0176 42.041302,42.041302 0 0 0 0.0195,-59.45508 L 361.87891,304.4707 a 42.041302,42.041302 0 0 0 -29.72266,-12.32422 z" id="path453"/>
	</g>
</svg>`.replace(/\n/g, " ");

function mergeData(dataArray) {
  const mergedMap = new Map();

  dataArray.flat().forEach((obj) => {
    const hasTitle = Boolean(obj.title);
    const hasPosterURL = Boolean(obj.poster_url);

    if (hasTitle && mergedMap.has(obj.title)) {
      const existingObj = mergedMap.get(obj.title);
      existingObj.download_material.push(obj.download_material);

      if (hasPosterURL && !existingObj.poster_url) {
        existingObj.poster_url = obj.poster_url;
      } else if (hasPosterURL && existingObj.poster_url) {
        if (obj.poster_url === existingObj.poster_url) {
          existingObj.download_material.push(obj.download_material);
        } else {
          for (let i of mergedMap) {
            if (!i[1].poster_url) continue;

            const resembleControl = resemble(obj.poster_url).compareTo(i[1].poster_url);
            resembleControl.scaleToSameSize();
            resembleControl.ignoreAntialiasing();
            resembleControl
              .outputSettings({
                ignoredBox: {
                  left: 120,
                  top: 200,
                  right: 400,
                  bottom: 250,
                },
              })
              .repaint();
            resembleControl.onComplete((data) => {
              if (Number(data.misMatchPercentage) < 10) {
                console.log(data);
              }
            });
          }
          //existingObj.download_material.push(obj.download_material)
        }
      }
    } else if (hasTitle) {
      mergedMap.set(obj.title, {
        id: obj.id,
        title: obj.title,
        parent_title: obj.parent_title,
        poster_url: hasPosterURL ? obj.poster_url : undefined,
        download_material: [obj.download_material],
      });
    }
  });

  console.log(mergedMap);

  return Array.from(mergedMap.values());
}
