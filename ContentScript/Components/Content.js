function Content(data, goToResults) {
  const Container = document.createElement("div");
  const BackButton = document.createElement("div");
  const ContentContainer = document.createElement("div");
  const PosterContainer = document.createElement("div");
  const PosterImg = document.createElement("img");
  const Title = document.createElement("span");

  Container.style = ``;
  BackButton.style = `
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  `;
  ContentContainer.style = `
	display: flex;
	height: 100px;
	align-items: center;
	background-color: rgb(50, 50, 50);
	gap: 8px;
	padding: 5px;
	border-radius: 5px;
	margin-left: 2px;
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
  Title.style = `
  color: white;
  font-weight: bold;
  font-family: sans-serif;
  font-size: 15px;
  user-select: none;
  width: 240px;
  `;

  BackButton.innerHTML = `
  <div style="transform: rotate(90deg);">${arrowIcon("#fff")}</div>
  <span style="font-family: sans-serif; font-weight: bold; font-size: 16px; color: white;">Back</span>
  `;
  const fallbackPosterUrl = chrome.runtime.getURL("assets/icons/movie_icon.png");
  PosterImg.src = data.poster_url ? data.poster_url : fallbackPosterUrl;
  PosterImg.onerror = () => (PosterImg.src = fallbackPosterUrl);
  Title.innerText = data.title;

  BackButton.onclick = () => goToResults();

  PosterContainer.appendChild(PosterImg);
  ContentContainer.appendChild(PosterContainer);
  ContentContainer.appendChild(Title);
  Container.appendChild(BackButton);
  Container.appendChild(ContentContainer);

  return Container;
}

function LangugeContainer(language) {}
