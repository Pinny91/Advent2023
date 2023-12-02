const fs = require("fs");

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const COLORS_MAX = { red: MAX_RED, blue: MAX_BLUE, green: MAX_GREEN };
const EMPTY_ROUND = {
  blue: 0,
  red: 0,
  green: 0,
};
async function main() {
  const textFile = await fs.readFileSync("./day2/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);
  codeParser(textArray);
}

function codeParser(stringArray) {
  const games = [];
  stringArray.forEach((string) => {
    const gameData = parseTextRow(string);
    // Part 1
    gameData.isLegit = isGameLegit(gameData);
    // Part 2
    gameData.requiredCubes = calculateMinRequierdCubes(gameData);
    games.push(gameData);
  });

  // Part 1
  let sum = 0;
  games.forEach((game) => {
    if (game.isLegit) sum += game.gameNumber;
  });
  console.log("part1: ", sum);
  // Part 2
  let sum2 = 0;
  games.forEach((game) => {
    let multiplier = 1;
    Object.keys(COLORS_MAX).forEach((color) => {
      multiplier *= game.requiredCubes[color];
    });
    sum2 += multiplier;
  });

  console.log("part2: ", sum2);
  return sum;
}

function parseTextRow(textRow) {
  const textSplit = textRow.split(":");
  const gameNumber = Number(textSplit[0].replace(/\D/g, ""));

  const gameData = {
    gameNumber,
    rounds: [],
  };

  const gameDataString = textSplit[1];
  const roundDataStringArray = gameDataString.split(";");
  roundDataStringArray.forEach((roundString) => {
    const round = { ...EMPTY_ROUND };
    const colorStringArray = roundString.split(",");
    colorStringArray.forEach((colorString) => {
      Object.keys(COLORS_MAX).forEach((color) => {
        if (colorString.includes(color)) round[color] = Number(colorString.replace(/\D/g, ""));
      });
    });
    gameData.rounds.push(round);
  });

  return gameData;
}

function isGameLegit(gameData) {
  let isLegit = true;
  gameData.rounds.forEach((round) => {
    Object.keys(COLORS_MAX).forEach((color) => {
      if (round[color] > COLORS_MAX[color]) isLegit = false;
    });
  });
  return isLegit;
}

function calculateMinRequierdCubes(gameData) {
  const minColors = { ...EMPTY_ROUND };
  gameData.rounds.forEach((round) => {
    Object.keys(COLORS_MAX).forEach((color) => {
      if (round[color] > minColors[color]) minColors[color] = round[color];
    });
  });
  return minColors;
}

main();
