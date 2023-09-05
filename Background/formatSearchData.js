export function formatJsonData(
  rawData,
  baseUrl,
  dataPath,
  titleAttr,
  parent_titleAttr,
  poster_urlAttr,
  download_materialAttr,
  language,
  languageAttr
) {
  try {
    const data = dataPath[0] ? dataPath.reduce((a, v) => a[v], rawData) : rawData;

    return data.map((i) => {
      const title = getValue(titleAttr, i);
      const parentTitle = getValue(parent_titleAttr, i);

      return {
        title: parentTitle || title,
        poster_url: getValue(poster_urlAttr, i),
        download_material: {
          title: title,
          baseUrl: baseUrl,
          material: getValue(download_materialAttr, i),
          language: languageAttr ? getValue(languageAttr, i) : language[0],
        },
      };
    });
  } catch (err) {
    console.log(baseUrl, rawData);
    console.log(err);
  }
}

function getValue(attribute, object) {
  return attribute.reduce((a, v) => (a && a.hasOwnProperty(v) ? a[v] : undefined), object);
}

export async function formatHTMLData(HTMLText, baseUrl, dataPaths, tabId) {
  const response = await chrome.tabs.sendMessage(tabId, {
    action: "formatHTML",
    HTMLText: HTMLText,
    baseUrl: baseUrl,
    dataPaths: dataPaths,
  });

  return response;
}
