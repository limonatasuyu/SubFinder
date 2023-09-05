function timeToSeconds(input) {
  const parts = input.split(",");

  const timePart = parts[0].trim();

  const timeComponents = timePart.split(":");

  const hours = parseInt(timeComponents[0], 10);
  const minutes = parseInt(timeComponents[1], 10);
  const seconds = parseInt(timeComponents[2], 10);

  const totalSeconds = hours * 60 * 60 + minutes * 60 + seconds;

  return totalSeconds;
}

function generateRangeArray(numbersArray) {
  const result = [];
  for (let i = numbersArray[0]; i <= numbersArray[1]; i++) result.push(i);
  return result;
}

export function parseSRT(srtText) {
  const lines = srtText.trim().split(/\r?\n/);
  const subtitles = [];
  let timestamp = null;
  let subtitle = "";
  let id = 0;

  let isLastLineId = false;
  let isLastLineSubtitle = false;
  for (const line of lines) {
    if (!isLastLineId && !isLastLineSubtitle && !isNaN(line)) {
      id = line;
      isLastLineId = true;
    } else if (isLastLineId && !isNaN(line[0])) {
      timestamp = line;
      isLastLineId = false;
    } else if (line !== "" && isLastLineSubtitle) {
      subtitle = subtitle + "\n" + line;
      //isLastLineSubtitle = true;
    } else if (line !== "") {
      subtitle = line;
      isLastLineSubtitle = true;
    } else if (line === "") {
      let secondsToShow = generateRangeArray(timestamp.split(" --> ").map((i) => timeToSeconds(i)));
      subtitles.push({ secondsToShow, subtitle, id });
      isLastLineSubtitle = false;
    }
  }

  return subtitles;
}

export function transposeArrays(arr) {
  return arr[0].map((_, index) => arr.map((innerArr) => innerArr[index]));
}