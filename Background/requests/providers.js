/*
 * {
 *  searchUrl: string;
 *  baseUrl: string;
 *  dataPaths: string[][];
 *  getOtherPagesUrl: (pageNum: number) => string;
 *  // dataPaths with order:
 *  // resultPath
 *  // titlePath
 *  // parentTitlePath
 *  // posterUrlPath
 *  // downloadMaterialPath
 *  // language
 *  // languagePath
 *  // totalPagesPath   // with providers that returns json, only the opensubtitle can return results that have more than one page,
 *                         so in these providers info there is no need to specify this path, opensubtitle's search for other pages
 *                         handled in makeRequestAndFormat function in search.js file
 *                         (if the file or function name changed and you're reading this, please change the comment)
 * }[]
 *
 */

function getProviderInfo(keyword) {
  return {
    firstQuery: [
      {
        searchUrl: `https://api.opensubtitles.com/api/v1/subtitles?order_by=download_count&query=${keyword}`,
        baseUrl: "https://api.opensubtitles.com",
        dataPaths: [
          ["data"],
          ["attributes", "feature_details", "title"],
          ["attributes", "feature_details", "parent_title"],
          ["attributes", "related_links", "0", "img_url"],
          ["attributes", "files", "0", "file_id"],
          [""],
          ["attributes", "language"],
        ],
        getOtherPagesUrl: (pageNum) =>
          `https://api.opensubtitles.com/api/v1/subtitles?order_by=download_count&query=${keyword}&page=${pageNum}`,
      },
      {
        searchUrl: `https://www.elsubtitle.com/search-results/?search_name=${keyword}`,
        baseUrl: "https://www.elsubtitle.com",
        dataPaths: [
          ["#post-349 > div > div.work-result-container"],
          ["img", "alt"],
          [],
          ["img", "src"],
          ["a", "href"],
          [],
          [],
          ["#post-349 > div > div.center > div > a.active", "innerText"],
        ],
        getOtherPagesUrl: (pageNum) =>
          `https://www.elsubtitle.com/search-results/?search_name=${keyword}&pageno=${pageNum}`,
      },
      {
        searchUrl: `https://greeksubs.net/search/${keyword}`,
        baseUrl: "https://greeksubs.net",
        dataPaths: [
          [".thumbnail"],
          ["span.h5", "innerText"],
          [],
          ["img", "src"],
          ["a", "href"],
          ["el"],
          [],
          [".pagination", "children"],
        ],
        getOtherPagesUrl: (pageNum) => `https://greeksubs.net/search/${keyword}/${pageNum}`,
      },
      {
        searchUrl: `https://hosszupuskasub.com/sorozatok.php?cim=${keyword}&evad=&resz=&nyelvtipus=%25&x=0&y=0`,
        baseUrl: "https://hosszupuskasub.com",
        dataPaths: [
          ["#stranka > center > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2n + 2)"],
          ["b", "innerText"],
          ["td:nth-child(1) > a", "href"],
          ["img", "src"],
          ["td:nth-child(7) > a", "href"],
          [],
          ["td:nth-child(3) > img", "src"],
          [],
        ],
      },
      {
        searchUrl: `https://subsland.com/index.php?s=${keyword}&w=name&category=0`,
        baseUrl: "https://subsland.com",
        dataPaths: [
          [
            "body > center > table.mainouter > tbody > tr > td.outer > table > tbody > tr > td > table:nth-child(6) > tbody > tr:nth-child(n + 2)",
          ],
          ["td", "innerText"],
          [],
          [],
          ["a", "href"],
          [],
          ["td:nth-child(2) > a > img", "src"],
          [],
        ],
      },
      {
        searchUrl: `https://subtitrari.regielive.ro/cauta.html?s=${keyword}`,
        baseUrl: "https://subtitrari.regielive.ro",
        dataPaths: [
          ["#lista-filme > li"],
          [".detalii > div", "innerText"],
          [],
          ["div.imagine > a > picture > source", "srcset"],
          ["a", "href"],
          ["ro"],
          [],
          ["#full-content > div > main > nav > ul > li:nth-last-child(2)"],
        ],
        getOtherPagesUrl: (pageNum) => `https://subtitrari.regielive.ro/cauta-${pageNum}.html?s=${keyword}`,
      },
      {
        searchUrl: `https://titrari.ro/index.php?page=cautare&z1=0&z2=${keyword}&z3=-1&z4=2`,
        baseUrl: "https://titrari.ro",
        dataPaths: [
          [
            "body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td > table.forumline > tbody > tr > td > span > table:nth-child(4) > tbody > tr:nth-child(6n - 5)",
          ],
          ["h1", "innerText"],
          [],
          ["img", "src"],
          ["td.row4 > a", "href"],
          ["td:nth-child(2) > table > tbody > tr:nth-child(1) > td", "innerText"],
          [],
          [
            "body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td > table.forumline > tbody > tr > td > span > table:nth-child(5) > tbody > tr > td:nth-child(3)",
            "innerText",
          ],
        ],
        getOtherPagesUrl: (pageNum) =>
          `https://titrari.ro/index.php?page=cautare&z1=${
            (pageNum - 1) * 20
          }&z2=${keyword}&z3=-1&z4=2&z5=&z6=&z7=&z8=&z9=&z10=&z11=`,
      },
      {
        searchUrl: `https://www.podnapisi.net/en/subtitles/search/?keywords=${keyword}&movie_type=&seasons=&episodes=&year=`,
        baseUrl: "https://www.podnapisi.net",
        dataPaths: [
          ["#page-body > div.panel.panel-default > div > div.table-responsive > table > tbody > tr"],
          ["td:nth-child(1) > a:nth-child(2)", "innerText"],
          [],
          ["td:nth-child(1) > div.pull-left > a:nth-child(2) > img", "src"],
          ["td:nth-child(1) > div.pull-left > a:nth-child(1)"],
          [],
          ["td:nth-child(4) > a", "href"],
          [
            "#page-body > div.panel.panel-default > div > div:nth-child(1) > ul > li:nth-last-child(2) > a",
            "href",
          ],
        ],
        getOtherPagesUrl: (pageNum) =>
          `https://www.podnapisi.net/en/subtitles/search/?episodes=&seasons=&year=&keywords=${keyword}&movie_type=&page=${pageNum}`,
      },
    ],
    SecondQuery: [
      {
        searchUrl: `https://funtitles.com/wp-json/wp/v2/search?search=${keyword}`,
        baseUrl: "https://funtitles.com",
        dataPaths: [[""], ["title"], [""], [""], ["url"], ["en"], [""]],
      },
      {
        searchUrl: `https://www.subtitulamos.tv/search/query?q=${keyword}`,
        baseUrl: "https://www.subtitulamos.tv",
        dataPaths: [[""], ["show_name"], [""], [""], ["show_id"], [""], [""]],
      },
      {
        searchUrl: `https://ww2.yifysubtitles.me/ajax/search?mov=${keyword}`,
        baseUrl: "https://ww2.yifysubtitles.me",
        dataPaths: [[""], ["movie"], [""], [""], ["imdb"], [""], [""]],
      },
      {
        searchUrl: `https://subentitle.com/search?title=${keyword}`,
        baseUrl: "https://subentitle.com",
        dataPaths: [[".item-author"], ["", "innerText"], [], [], ["", "href"], [], [], []],
      },
      {
        searchUrl: `https://www.titulky.com/?Fulltext=${keyword}`,
        baseUrl: "https://www.titulky.com",
        dataPaths: [
          ["#contcont > table > tbody > tr:nth-child(n + 2)"],
          ["a", "innerText"],
          [],
          [],
          ["a", "href"],
          [],
          ["td:nth-child(6) > img", "alt"],
          ["#contcont > div > span:nth-last-child(2)", "innerText"],
        ],
        getOtherPagesUrl: (pageNum) =>
          `https://www.titulky.com/?Fulltext=${keyword}&ZaznamuStrana=50&ActualRecord=${(pageNum - 1) * 50}`,
      },
      {
        searchUrl: `https://subtitleseeker.in/?s=${keyword}`,
        baseUrl: "https://subtitleseeker.in",
        dataPaths: [
          [".post > h2 > a:nth-last-child(1)"],
          ["", "innerText"],
          [],
          [],
          ["", "href"],
          ["en"],
          [],
          ["#content > nav > div > a:nth-last-child(2)", "innerText"],
        ],
      },
      {
        searchUrl: `https://my-subs.co/search.php?key=${keyword}`,
        baseUrl: "https://my-subs.co",
        dataPaths: [
          ["#search_panel > div.list-group > a"],
          ["", "innerText"],
          [],
          [],
          ["", "href"],
          [],
          [],
          [],
        ],
      },
      {
        searchUrl: `https://www.subsynchro.com/?q=${keyword}`,
        baseUrl: "https://www.subsynchro.com",
        dataPaths: [
          ["#resultats > li.ligne:not(.opacity) > ul > li > h2"],
          ["", "innerText"],
          [],
          [],
          ["a", "href"],
          ["fr"],
          [],
          ["#result > ul.navigation > li:nth-last-child(2)", "innerText"],
        ],
      },
    ],
  };
}
export default getProviderInfo;
