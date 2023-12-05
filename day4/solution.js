const fs = require("fs");

async function main() {
  const textFile = await fs.readFileSync("./day4/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);
  codeParser(textArray);
}

function codeParser(stringArray) {
  const cards = [];
  stringArray.forEach((string) => {
    const card = parseLine(string);
    cards.push(card);
  });

  // Part 1
  let sum = 0;
  cards.forEach((card) => {
    sum += card.points;
  });
  console.log("part1: ", sum);

  // Part 2

  cards.forEach((card, currentIndex) => {
    if (!card.instances) card.instances = 1;
    for (let i = currentIndex + 1; i <= currentIndex + card.matchingNumbers; i++) {
      if (!cards[i].instances) cards[i].instances = 1;
      cards[i].instances += card.instances;
    }
  });

  let sum2 = 0;
  cards.forEach((card) => {
    sum2 += card.instances;
  });
  console.log("part2: ", sum2);

  return 0;
}

function parseLine(line) {
  const card = {};
  let [cardNumberText, data] = line.split(":");
  card.id = Number(cardNumberText.replace(/\D/g, ""));

  const [winningNumbersString, playerNumbersString] = data.split(" | ");

  // Numbers are still seen as string
  const playerNumbers = playerNumbersString
    .split(" ")
    .map((s) => (s ? Number(s) : undefined))
    .filter((v) => v);
  const winningNumbers = winningNumbersString
    .split(" ")
    .map((s) => (s ? Number(s) : undefined))
    .filter((v) => v);
  let points = 0;
  let matchingNumbers = 0;
  playerNumbers.forEach((number) => {
    if (number && winningNumbers.includes(number)) {
      points = Math.max(1, points * 2);
      matchingNumbers++;
    }
  });
  card.points = points;
  card.matchingNumbers = matchingNumbers;
  return card;
}

main();
