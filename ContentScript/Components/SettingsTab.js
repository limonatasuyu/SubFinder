function SettingsTab() {
  const extensionId = chrome.runtime.id;

  const TabContainer = document.createElement("div");
  const TextSettingsIcon = document.createElement("img");
  const TextSizeOption = StyleMenuItem("Text Size", ["Small", "Normal", "Big", "Very Big"]);
  const TextColorOption = StyleMenuItem("Text Color", ["White", "Black", "Red", "Blue", "Yellow"]);
  const BackgroundColorOption = StyleMenuItem("Background Color", [
    "White",
    "Black",
    "Red",
    "Blue",
    "Yellow",
    "Transparent",
  ]);
  const TimeSettingsIcon = document.createElement("img");

  TextSettingsIcon.style = TimeSettingsIcon.style = `
  width: 16px;
  margin-left: 4px;
  padding-bottom: 6px;
  `;
  TimeSettingsIcon.style.marginTop = "4px";
  TabContainer.style = `
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  height: calc(100% - 16px);
  `;

  TextSettingsIcon.src = chrome.runtime.getURL("assets/icons/text_settings_icon.png");
  TimeSettingsIcon.src = chrome.runtime.getURL("assets/icons/time_settings_icon.png");
  TabContainer.className = `style-text-tab-${extensionId}`;

  TabContainer.appendChild(TextSettingsIcon);
  TabContainer.appendChild(TextSizeOption);
  TabContainer.appendChild(TextColorOption);
  TabContainer.appendChild(BackgroundColorOption);
  TabContainer.appendChild(TimeSettingsIcon);

  return TabContainer;
}

function StyleMenuItem(name, options) {
  const extensionId = chrome.runtime.id;

  const Container = document.createElement("div");
  const OptionContainer = document.createElement("div");
  const OptionName = document.createElement("span");
  const ArrowIconContainer = document.createElement("div");
  const Options = StyleOptions(name, options);

  Container.style = `
  display: flex;
  flex-direction: column;
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  `;
  OptionContainer.style = `
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  width: 100%;
  cursor: pointer;
  `;
  OptionName.style = `
  font-size: 16px;
  margin-left: 5px;
  `;

  OptionContainer.className = `style-option-${extensionId}`;

  OptionContainer.onclick = () => {
    if (Container.contains(Options)) {
      Container.removeChild(Options);
      ArrowIconContainer.style["rotate"] = "0deg";
      return;
    }
    ArrowIconContainer.style["rotate"] = "180deg";
    Container.appendChild(Options);
  };

  OptionName.innerText = name;
  ArrowIconContainer.innerHTML = arrowIcon("#fff");

  OptionContainer.appendChild(OptionName);
  OptionContainer.appendChild(ArrowIconContainer);
  Container.appendChild(OptionContainer);

  return Container;
}

function StyleOptions(optionName, options) {
  const OptionsContainer = document.createElement("div");
  const Options = options.map((option) => OptionSelection(option, optionName));

  OptionsContainer.style = `
  display: flex;
  flex-direction: column;
  `;

  Options.forEach((element) => {
    OptionsContainer.appendChild(element);
  });

  return OptionsContainer;
}

const OptionSelection = (option, optionName) => {
  const extensionId = chrome.runtime.id;

  const element = document.createElement("div");

  element.style = `
  width: calc(100% - 4px);
  padding: 4px 0px 4px 6px;
  cursor: pointer;
  user-select: none;
  font-weight: normal;
  color: gray;
  `;

  element.innerText = option;
  element.className = `style-option-${extensionId}`;

  const defaultSettings = ["White", "Text Color", "Transparent", "Normal"];
  if (
    (option == defaultSettings[0] && optionName == defaultSettings[1]) ||
    option == defaultSettings[2] ||
    option == defaultSettings[3]
  ) {
    element.style.fontWeight = "Bold";
    element.style.color = "white";
  }

  element.onclick = () => chrome.storage.local.set({ [optionName]: option });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[optionName] && changes[optionName].newValue == option) {
      element.style.fontWeight = "Bold";
      element.style.color = "white";
    } else if (changes[optionName]) {
      element.style.fontWeight = "initial";
      element.style.color = "gray";
    }
  });

  return element;
};

function arrowIcon(color) {
  return `
  <svg width="25px" height="30px" viewBox="0 0 24 30" fill="none">
    <path d="M12 18L7 13M12 18L17 13" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `.replace(/\n/g, " ");
}
