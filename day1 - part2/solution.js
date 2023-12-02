const fs = require("fs");

const numberParserArray = [
  { text: "one", value: 1 },
  { text: "two", value: 2 },
  { text: "three", value: 3 },
  { text: "four", value: 4 },
  { text: "five", value: 5 },
  { text: "six", value: 6 },
  { text: "seven", value: 7 },
  { text: "eight", value: 8 },
  { text: "nine", value: 9 },
];

async function main() {
  const textFile = await fs.readFileSync("./day2 - part2/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);

  const sum = codeParser(textArray);
  console.log(sum);
}

function codeParser(stringArray) {
  const numberArray = stringArray.map((string) => {
    const digetsToAdd = {};
    numberParserArray.forEach((diget) => {
      if (string.includes(diget.text)) {
        let startIndex = 0;
        let index;

        // While is needed because same number can be in the string twice
        while ((index = string.indexOf(diget.text, startIndex)) > -1) {
          digetsToAdd[index] = diget.value;
          startIndex = index + 1;
        }
      }
    });

    const charArray = string.split("");
    Object.keys(digetsToAdd)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((position, indexDigetToAdd) => {
        charArray.splice(Number(position) + indexDigetToAdd, 0, digetsToAdd[position]);
      });

    string = charArray.join("");

    let numbers = string.replace(/\D/g, "");
    if (!numbers || numbers.lenght == 0) return 0;

    console.log(string, `${numbers[0]}${numbers.at(-1)}`, JSON.stringify(digetsToAdd));
    return Number(`${numbers[0]}${numbers.at(-1)}`);
  });
  console.log(numberArray);
  const sum = numberArray.reduce((partialSum, number) => partialSum + number, 0);

  return sum;
}

main();
