function formatHTML(
  HTMLText,
  baseUrl,
  resultSelectors,
  titleSelectors,
  parentTitleSelectors,
  posterUrlSelectors,
  downloadMaterialSelectors,
  language,
  languageSelectors,
  paginationSelectors
) {
  try {
    const doc = new DOMParser().parseFromString(HTMLText, "text/html");
    const results = Array.from(doc.querySelectorAll(resultSelectors[0]));

    if (
      !results ||
      !results.length ||
      (baseUrl === "https://hosszupuskasub.com" &&
        results[0].querySelector("img").getAttribute("src") === "css/nofound.gif")
    ) {
      return { data: [], total_pages: 1 };
    }

    const data = results
      .map((item) => {
        var languageValue = getValue(languageSelectors, item, baseUrl);
        if (baseUrl === "https://www.podnapisi.net" && languageValue)
          languageValue = languageValue.substring(languageValue.lastIndexOf("=") + 1);
        if (baseUrl === "https://www.titulky.com" && !languageValue) return;

        let titleValue = getValue(titleSelectors, item, baseUrl);
        if (baseUrl === "https://subsland.com" && titleValue) titleValue = titleValue.split("/")[0];

        let parentTitleValue = getValue(parentTitleSelectors, item, baseUrl);
        if (baseUrl === "https://hosszupuskasub.com" && parentTitleValue) {
          parentTitleValue = parentTitleValue.substring(parentTitleValue.lastIndexOf("serial") + 7);
        }

        return {
          title: parentTitleValue || titleValue,
          poster_url: getValue(posterUrlSelectors, item, baseUrl),
          download_material: {
            title: titleValue,
            baseUrl,
            material: getValue(downloadMaterialSelectors, item, baseUrl),
            language: language || iso[languageValue] || languageValue,
          },
        };
      })
      .filter((i) => i);

    const total_pages = calculateTotalPages(baseUrl, paginationSelectors, doc);

    return { data, total_pages };
  } catch (err) {
    throw new Error(`Error processing HTML for ${baseUrl}: ${err.message}`);
  }
}

function calculateTotalPages(baseUrl, paginationSelectors, doc) {
  const totalPagesString = getValue(paginationSelectors, doc);

  if (!totalPagesString) return 1;

  if (baseUrl === "https://www.elsubtitle.com") {
    return getElsubtitleTotalPages(totalPagesString);
  } else if (baseUrl === "https://greeksubs.net") {
    return getGreeksubsTotalPages(totalPagesString);
  } else if (baseUrl === "https://titrari.ro") {
    return getTitrariTotalPages(totalPagesString);
  } else if (baseUrl === "https://www.titulky.com") {
    return totalPagesString / 50 + 1;
  } else if (Number(totalPagesString)) {
    return Number(totalPagesString);
  }
  return 1;
}

function getElsubtitleTotalPages(string) {
  return string.split("/")[1];
}

function getGreeksubsTotalPages(elements) {
  const arr = Array.from(elements);
  return arr.length ? arr.slice(-3)[0].innerText : 1;
}

function getTitrariTotalPages(string) {
  return Math.ceil(string.split("/")[1] / 20);
}

function getValue(selectors, Element, baseUrl) {
  if (!selectors.length) return undefined;

  var element;
  if (selectors[0] === "") element = Element;
  else element = Element.querySelector(selectors[0]);

  if (!element) return undefined;
  if (!selectors[1]) return element;

  var attributeValue;
  if (selectors[1] === "innerText" || selectors[1] === "children") attributeValue = element[selectors[1]];
  else attributeValue = element.getAttribute(selectors[1]);

  if (selectors[1] === "href" || selectors[1] === "src" || selectors[1] === "srcset")
    return attributeValue.slice(0, 4) === "http"
      ? attributeValue
      : `${baseUrl}${attributeValue[0] === "/" ? attributeValue : `/${attributeValue}`}`;

  return attributeValue;
}

const iso = {
  "https://hosszupuskasub.com/flags/10.gif": "it",
  "https://hosszupuskasub.com/flags/9.gif": "cs",
  "https://hosszupuskasub.com/flags/8.gif": "nl",
  "https://hosszupuskasub.com/flags/7.gif": "hr",
  "https://hosszupuskasub.com/flags/6.gif": "ro",
  "https://hosszupuskasub.com/flags/5.gif": "de",
  "https://hosszupuskasub.com/flags/4.gif": "es",
  "https://hosszupuskasub.com/flags/3.gif": "fr",
  "https://hosszupuskasub.com/flags/2.gif": "en",
  "https://hosszupuskasub.com/flags/1.gif": "hu",
  "https://subsland.com/pic/britain.png": "en",
  "https://subsland.com/pic/bulgaria.png": "bg",
  "https://subsland.com/pic/russian_federation.png": "ru",
  // https://titrari.ro
  "[ Engleza ]\n": "en",
  "[ Romana ]\n": "ro",
  "[ Spaniola ]\n": "es",
  "[ Germana ]\n": "de",
  "[ Italiana ]\n": "it",
  "[ Portugheza ]\n": "pt",
  "[ Franceza ]\n": "fr",
  "[ Ceha ]\n": "cs",
  "[ Rusa ]\n": "ru",
  "[ Maghiara ]\n": "hu",
};
