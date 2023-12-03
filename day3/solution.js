const fs = require("fs");

const FIXED_POSITIONS_TO_CHECK = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

async function main() {
  const textFile = await fs.readFileSync("./day3/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);
  codeParser(textArray);
}

function codeParser(stringArray) {
  // Part example = {symbol: x, position: [y, x]}
  const parts = getParts(stringArray);
  let partNumbers = [];
  parts.forEach((part) => {
    const localPartNumbers = getPartNumbers(stringArray, part);
    partNumbers = [...partNumbers, ...localPartNumbers];
  });

  const sum = partNumbers.reduce((partialSum, number) => partialSum + Number(number), 0);

  console.log("Part1: ", sum);

  // Part 2
  const sterParts = parts.filter((p) => p.symbol == "*");
  const gearRatios = [];
  sterParts.forEach((part) => {
    const localPartNumbers = getPartNumbers(stringArray, part);
    if (localPartNumbers.length < 2) return;
    let gearRatio = 1;
    localPartNumbers.forEach((number) => {
      gearRatio *= number;
    });
    gearRatios.push(gearRatio);
  });

  const sum2 = gearRatios.reduce((partialSum, number) => partialSum + Number(number), 0);
  console.log("Part2: ", sum2);

  return 0;
}

function getParts(stringArray) {
  const parts = [];
  const pattern = /[^A-Za-z0-9 .]/g;

  stringArray.forEach((stringRow, rowIndex) => {
    if (stringRow.match(pattern)) {
      while ((match = pattern.exec(stringRow))) {
        parts.push({ symbol: stringRow[match.index], position: [rowIndex, match.index] });
      }
    }
  });

  return parts;
}

function getPartNumbers(stringArray, part) {
  const positionsToCheck = [];
  const blackList = [];

  const numbers = [];
  FIXED_POSITIONS_TO_CHECK.forEach((fixedPositionOffset) => {
    const position = [part.position[0] + fixedPositionOffset[0], part.position[1] + fixedPositionOffset[1]];
    // Filter impossible Y positions
    if (position[0] < 0 || position[0] > stringArray.length - 1) return;
    // Filter impossible X positions
    if (position[1] < 0 || position[1] > stringArray[part.position[0]].length - 1) return;

    if (!stringArray[position[0]][position[1]].match(/[0-9]/g)) return;
    // Filter doubles
    let isAreadyAdded = false;
    blackList.forEach((p) => {
      if ((p[1] - 1 == position[1] || p[1] + 1 == position[1]) && p[0] == position[0]) {
        blackList.push(position);
        isAreadyAdded = true;
      }
    });
    if (isAreadyAdded) return;

    const number = getNumberOutOfString(stringArray[position[0]], position[1]);
    numbers.push(number);
    blackList.push(position);
  });
  return numbers;
}

function getNumberOutOfString(string, positionDigit) {
  const charArray = string.split("");
  let position = positionDigit + 1;
  let numberPostions = [positionDigit];
  while (charArray[position]?.match(/[0-9]/g)) {
    numberPostions.push(position);
    position++;
  }
  position = positionDigit - 1;
  while (charArray[position]?.match(/[0-9]/g)) {
    numberPostions.push(position);
    position--;
  }

  numberPostions = numberPostions.sort((a, b) => Number(a) - Number(b));
  const number = Number(numberPostions.map((p) => charArray[p]).join(""));
  return number;
}

main();
