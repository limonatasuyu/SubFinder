import { parseSRT } from "../backgroundUtils.js";

export async function opensubtitlesGetFile(file_id) {
	const response = await fetch(
		`https://api.opensubtitles.com/api/v1/download`,
		{
			method: "POST",
			headers: {
				Accept: "*/*",
				"Api-Key": "7fkB2JYnvrvjLOiEAwHCmPERzmBnT6ZF",
				Authorization:
					"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEaWZSWkFLbDdGa09JVU0wNzlZM2YxMG5LRkFic1pkTSIsImV4cCI6MTY5MTUwMDg1M30.uV7epnNEIrhA2O6IrGwwLPTfdiUpVpP8dvlN327gEYk",
			},
			body: JSON.stringify({ file_id: file_id }),
		}
	);

	const responseData = await response.json();

	const subtitlesResponse = await fetch(responseData.downloadLink);
	const subtitlesText = await subtitlesResponse.text();
	const subtitles = parseSRT(subtitlesText);

	return { subtitles: subtitles };
}

export async function FuntitlesComGetFile(post_id) {
	const pageResponse = await fetch(
		`https://funtitles.com/wp-json/wp/v2/posts/${post_id}`
	);
	const pageResponseData = await pageResponse.json();

	const doc = pageResponseData.content.rendered;
	var downloadLink;

	const pattern =
		/<a\s+[^>]*class=["'][^"']*wp-block-button__link[^"']*["'][^>]*href=["']([^"']*)["'][^>]*>.*?<\/a>/;
	const matches = doc.match(pattern);
	if (matches) downloadLink = matches[1];
	if (!downloadLink) return;

	const downloadId = downloadLink.match(/\/([^\/]+)$/gi)[0].slice(1);

	const formData = new FormData();
	formData.append("op", "download2");
	formData.append("id", downloadId);
	formData.append("rand", "");
	formData.append("referer", "");
	formData.append("method_free", "");
	formData.append("method_premium", "");

	const subtitlesResponse = await fetch(
		"https://voltupload.com/download",
		{
			method: "POST",
			body: formData,
		}
	);
	const subtitlesText = await subtitlesResponse.text();
	const subtitles = parseSRT(subtitlesText);

	return { subtitles: subtitles };
}

export async function SubAskGet() {
	let subtitle;

	const driver = await new Builder().forBrowser("chrome").build();

	try {
		await driver.get(
			"https://subask.com/subtitles/spider-man-2002/turkish/feedback"
		);

		await driver.wait(async () => {
			const response = await driver.executeScript(
				'return fetch("https://subask.com/api/fetch-subtitle");'
			);
			const responseJson = await response.json();

			if (response.url.endsWith("api/fetch-subtitle")) {
				subtitle = responseJson;
				return true; // Stop waiting
			}

			return false; // Continue waiting
		}, 10000); // Wait for a maximum of 10 seconds

		// Now you can use the "subtitle" variable as needed
	} finally {
		await driver.quit();
	}
	return subtitle;
}

/*
// Giving CORS Error
export async function funky(endpoint) {

  const url = "https://subask.com/api/fetch-subtitle";

  const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZGUwZGYzYjgxMzA0NTAxN2Y4MDQ0NyIsImlhdCI6MTY5MjI3NDE2MywiZXhwIjoyMDA3NjM0MTYzfQ.MTmw_hVQYIepBF4oQHhgxoNyomQc6EcnkboBy2-Y6K0";

  const payload = {
    locale: "tr",
    slug: "spider-man-2002",
    _id: "\u0019m;nrR\u0016^||\u001bR\u0019:mEm"
  };

  const options = {
    method: "POST",
    headers: {
      "x-access-token": userToken,
      "Content-Type": "application/json;charset=UTF-8",
      "user-lang": "en",
    },
    body: JSON.stringify(payload)
  };

  const response = await fetch(url, options);

  const responseText = await response.text();
  console.log(responseText);

}
*/
/*export async function  YifySubtitlesGetFile(file_name) {

    fetch(`https://yts.ams3.digitaloceanspaces.com/Allsubtitles/${file_name}.zip`)
}*/

//(subtitleseeker.in)
//document.getElementsByClassName("entry")[0].getElementsByTagName("a")[0].href
//Array.from(document.getElementsByClassName("post")).map((i) => i.getElementsByTagName("a")[0].title.toLowerCase().includes("subtitle"))
