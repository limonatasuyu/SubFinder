import { formatJsonData, formatHTMLData } from "../formatSearchData.js";
import { transposeArrays } from "../backgroundUtils.js";
import getProviderInfo from "./providers.js";

export async function handleSearch(keyword, tabId) {
  try {
    const ProviderInfo = getProviderInfo(keyword);

    const InitialQueryPromises = ProviderInfo.firstQuery.map(
      ({ searchUrl, baseUrl, dataPaths, getOtherPagesUrl }) =>
        makeRequestAndFormat(searchUrl, baseUrl, dataPaths, tabId, true, getOtherPagesUrl)
    );

    const [query1Data1, query1Promises] = transposeArrays(await Promise.all(InitialQueryPromises));

    Promise.all(query1Promises.flat()).then(async ([query1Data2]) => {
      const [query2Data1, query2Data2] = await makeSecondQuery(ProviderInfo, tabId);
      await chrome.tabs.sendMessage(tabId, {
        action: "SecondarySearchData",
        searchData: [query1Data2, query2Data1, query2Data2].flat()
      });
    });

    return query1Data1
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function makeSecondQuery(ProviderInfo, tabId) {
  const SecondQueryPromises = ProviderInfo.SecondQuery.map(
    ({ searchUrl, baseUrl, dataPaths, getOtherPagesUrl }) =>
      makeRequestAndFormat(searchUrl, baseUrl, dataPaths, tabId, true, getOtherPagesUrl)
  );

  const [query2Data1, query2Promises] = transposeArrays(await Promise.all(SecondQueryPromises));

  const [query2Data2] = await Promise.all(query2Promises.flat());

  return [query2Data1, query2Data2];
}

async function makeRequestAndFormat(
  searchUrl,
  baseUrl,
  dataPaths,
  tabId,
  isInitialRequest,
  getOtherPagesUrl
) {
  const [rawData, dataType] = await fetchData(searchUrl);
  var formattedData;
  var total_pages;
  var otherPagesPromises = [];

  if (dataType === "empty") {
    formattedData = [];
  } else if (dataType === "html") {
    const formattedHTMLData = await formatHTMLData(rawData, baseUrl, dataPaths, tabId);
    formattedData = formattedHTMLData.data;
    total_pages = formattedHTMLData.total_pages;
  } else {
    formattedData = formatJsonData(rawData, baseUrl, ...dataPaths);
    if (baseUrl === "https://api.opensubtitles.com") total_pages = rawData.total_pages;
  }

  if (isInitialRequest && total_pages > 1) {
    let pagesToSearch = total_pages > 10 ? 10 : total_pages;
    for (let pageNum = 2; pageNum <= pagesToSearch; pageNum++) {
      otherPagesPromises.push(makeRequestAndFormat(getOtherPagesUrl(pageNum), baseUrl, dataPaths, tabId));
    }
  }

  return [formattedData, otherPagesPromises];
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    const responseCode = response.status;

    // opensubtitles have a rate limit, 5 requests per 1 second per ip address.
    // https://opensubtitles.stoplight.io/docs/opensubtitles-api/6ef2e232095c7-best-practices#limits
    if (responseCode === 429 && url.startsWith("https://api.opensubtitles.com")) {
      await asyncWait(2000);
      return fetchData(url);
    }

    if (responseCode !== 200 && responseCode !== 301) {
      console.error(`Unexpected response code from ${url}: ${responseCode}`);
      return [[], "empty"];
    }

    // weirdly subtitulamos.tv returns json but the content-type is `text/html; charset=UTF-8`
    if (
      contentType.includes("application/json") ||
      (contentType.includes("text/html") && url.startsWith("https://www.subtitulamos.tv"))
    ) {
      return [await response.json(), "json"];
    }

    if (contentType.includes("text/html") || contentType.includes("text/plain")) {
      return [await response.text(), "html"];
    }

    console.error(`Unsupported content type from ${url}: ${contentType}`);
    return [[], "empty"];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [[], "empty"];
  }
}

async function asyncWait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
