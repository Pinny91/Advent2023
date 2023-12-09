const fs = require("fs");

async function main() {
  const textFile = await fs.readFileSync("./day6/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);
  codeParser(textArray);
}

function codeParser(stringArray) {
  const { times, distances } = dataParser(stringArray);

  // Part 1
  const waysToBeatRaces = [];
  times.forEach((time, index) => {
    const distance = distances[index];
    const waysToBeatRace = calculateWaysToBeat(time, distance);
    waysToBeatRaces.push(waysToBeatRace);
  });

  const sum = waysToBeatRaces.reduce((partialSum, number) => partialSum * number, 1);
  console.log("Part 1: ", sum);

  // Part 2
  const time2 = Number(times.join(""));
  const distance2 = Number(distances.join(""));
  const waysToBeatRace = calculateWaysToBeat(time2, distance2);
  console.log("Part 2: ", waysToBeatRace);
  return 0;
}

function dataParser(stringArray) {
  const times = stringArray[0]
    .split(" ")
    .map((s) => Number(s))
    .filter((s) => !isNaN(s) && s != 0);
  const distances = stringArray[1]
    .split(" ")
    .map((s) => Number(s))
    .filter((s) => !isNaN(s) && s != 0);
  return { times, distances };
}

function calculateWaysToBeat(time, distance) {
  // Possible options
  let possibleOptions = 0;
  for (let timeToHold = 0; timeToHold <= time; timeToHold++) {
    const timeToMove = time - timeToHold;
    const distanceMoved = timeToMove * timeToHold;
    if (distanceMoved > distance) possibleOptions++;
  }

  return possibleOptions;
}
main();
