function UIModal(videoElement, parentElement) {
  const extensionId = chrome.runtime.id;

  const Container = document.createElement("div");
  const OpenModalButton = document.createElement("button");
  const OpenModalButtonImg = document.createElement("img");
  const ModalContainer = document.createElement("div");
  const ModalHeader = document.createElement("div");
  const TabsContainer = document.createElement("div");
  const Tab1 = document.createElement("div");
  const Tab2 = document.createElement("div");
  const CurrentTabContainer = document.createElement("div");
  const SearchTabElement = SearchTab(parentElement, videoElement);
  const SettingsTabElement = SettingsTab();
  const CloseModalButton = document.createElement("button");
  const CloseModalButtonImg = document.createElement("img");

  const style = document.createElement("style");

  const videoHeight = videoElement.style.height ? videoElement.style.height : videoElement.videoHeight;
  const videoWidth = videoElement.style.width ? videoElement.style.width : videoElement.videoWidth;
  Container.style = `
	position: absolute;
	top: ${videoHeight - 58};
	left: ${videoWidth - 188};
	display: flex;
	flex-direction: column;
	transform-style: flat;
	z-index: 10000;
	`;
  OpenModalButton.style = `
	opacity: 0.8;
	position: relative;
	width: 34px;
	height: 34px;
	background-color: transparent;
	border: none;
	outline: none;
	cursor: pointer !important;
	`;
  OpenModalButtonImg.style = `
	width: -webkit-fill-available;
	height: auto;
	`;
  ModalContainer.style = `
	background-color: rgba(28,27,28, 0.9);
	display: flex;
	flex-direction: column;
	border-radius: 23px;
	margin-left: -366px;
	`;
  ModalHeader.style = `
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	font-family: sans-serif;
	color: white;
	font-weight: bold;
	`;
  TabsContainer.style = `
	display: flex;
	`;
  Tab1.style = Tab2.style = `
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 12px;
	cursor: pointer;
	user-select: none;
	height: 39px;
	`;
  Tab1.style.borderTopLeftRadius = "23px";
  CurrentTabContainer.style = `
	width: 380px;
	height: 320px;
	padding: 12px 16px 16px;
	`;
  CloseModalButton.style = `
	width: 10px;
	height: 18px;
	border: none;
	cursor: pointer;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 11px;
	`;
  CloseModalButtonImg.style = `
	width: 24px;
	height: auto;
	border-radius: 12px;
	`;

  style.innerText = `
	.reset-${extensionId} * {
		-webkit-box-sizing: initial;
		-moz-box-sizing: initial;
		box-sizing: initial;
		text-align: initial;
		font-size: 13px;
		line-height: initial;
		margin: initial;
	}
	
	#subtitles-extension-button-${extensionId}:hover {
		opacity: 0.8;
	}

	#subtitles-extension-button-${extensionId}:hover {
		opacity: 1;
	}

	.tabs-container-${extensionId}:hover .tab-${extensionId} {
		padding-top: 2px !important;
	}

	.tab-${extensionId}:hover {
		background-color: rgb(15, 15, 15);
		border-bottom: 2px solid white;
	}

	.style-option-${extensionId}:hover {
		background-color: rgb(15, 15, 15)
	}

	.search-input-${extensionId} {
		background: #f4f6f8;
		box-shadow: 0 0 0 1px rgba(63,63,68,.05),0 1px 3px 0 rgba(63,63,68,.15);
		border: 1px solid #b2b5bd33;
		padding: 10px 16px;
		height: 18px;
	}

	.search-input-${extensionId}:focus {
		background: rgba(243,245,247,.21);
    box-shadow: none;
    border: 1px solid #dce0ea;
		padding: 9px 14px;
		outline: none;
		height: 20px;
		margin-left: 2px;
	}

	.search-results-${extensionId}::-webkit-scrollbar, .style-text-tab-${extensionId}::-webkit-scrollbar {
		width: 7px;
  }
  
	.search-results-${extensionId}::-webkit-scrollbar-thumb, .style-text-tab-${extensionId}::-webkit-scrollbar-thumb {
		background: black;
		border-radius: 150px;
	}
  
	.search-results-${extensionId}::-webkit-scrollbar-thumb:hover, .style-text-tab-${extensionId}::-webkit-scrollbar-thumb:hover {
		background: rgb(50, 50, 50);
  	}
  
	.search-results-${extensionId}::-webkit-scrollbar-thumb:focus, .style-text-tab-${extensionId}::-webkit-scrollbar-thumb:focus {
		background: rgb(0, 0, 0);
	}

	.spinner-${extensionId} {
  	display: inline-block;
	}
	.spinner-${extensionId}:after {
  	content: " ";
  	display: block;
  	width: 15px;
  	height: 15px;
  	border-radius: 50%;
  	border: 3px solid #fff;
  	border-color: #fff transparent #fff transparent;
  	animation: spinner-${extensionId} 1.2s linear infinite;
	}

	@keyframes spinner-${extensionId} {
  	0% { transform: rotate(0deg) }
  	100% { transform: rotate(360deg) }
	}


	`.replace(/\n/g, " ");

  Container.className = `reset-${extensionId}`;
  OpenModalButton.id = `subtitles-extension-button-${extensionId}`;
  TabsContainer.className = `tabs-container-${extensionId}`;
  Tab1.className = Tab2.className = `tab-${extensionId}`;
  OpenModalButtonImg.src = chrome.runtime.getURL("assets/icons/subtitles.png");
  CloseModalButtonImg.src = chrome.runtime.getURL("assets/icons/close.png");
  Tab1.innerText = "Search";
  Tab2.innerText = "Settings";

  var currentTab = "Search";
  Tab1.onclick = () => {
    if (currentTab == "Search") return;
    currentTab = "Search";
    CurrentTabContainer.removeChild(SettingsTabElement);
    CurrentTabContainer.appendChild(SearchTabElement);
  };
  Tab2.onclick = () => {
    if (currentTab == "Settings") return;
    currentTab = "Settings";
    CurrentTabContainer.appendChild(SettingsTabElement);
    CurrentTabContainer.removeChild(SearchTabElement);
  };

  const containerWidth = 388;

  CloseModalButton.onclick = () => {
    Container.style.top = Number(Container.style.top.slice(0, -2)) + containerWidth;
    Container.removeChild(ModalContainer);
  };

  OpenModalButton.onclick = () => {
    if (Container.contains(ModalContainer)) {
      Container.style.top = Number(Container.style.top.slice(0, -2)) + containerWidth;
      Container.removeChild(ModalContainer);
    } else {
      Container.style.top = Number(Container.style.top.slice(0, -2)) - containerWidth;
      Container.prepend(ModalContainer);
    }
  };

  OpenModalButton.appendChild(OpenModalButtonImg);
  CloseModalButton.appendChild(CloseModalButtonImg);
  TabsContainer.appendChild(Tab1);
  TabsContainer.appendChild(Tab2);
  ModalHeader.appendChild(TabsContainer);
  ModalHeader.appendChild(CloseModalButton);
  CurrentTabContainer.appendChild(SearchTabElement);
  ModalContainer.appendChild(ModalHeader);
  ModalContainer.appendChild(CurrentTabContainer);
  Container.appendChild(OpenModalButton);
  Container.appendChild(style);

  return Container;
}
