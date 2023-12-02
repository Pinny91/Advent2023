const fs = require("fs");

async function main() {
  const textFile = await fs.readFileSync("./day1/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);
  const sum = codeParser(textArray);
  console.log(sum);
}

function codeParser(stringArray) {
  const numberArray = stringArray.map((string) => {
    let numbers = string.replace(/\D/g, "");
    if (!numbers || numbers.lenght == 0) return 0;
    
    return Number(`${numbers[0]}${numbers.at(-1)}`);
  });

  const sum = numberArray.reduce(
    (partialSum, number) => partialSum + number,
    0
  );

  return sum;
}

main();
