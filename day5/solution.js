const fs = require("fs");

const SEED_TO_SOIL = "seed-to-soil";
const SOIL_TO_FERTILIZER = "soil-to-fertilizer";
const FERTILIZER_TO_WATER = "fertilizer-to-water";
const WATER_TO_LIGHT = "water-to-light";
const LIGHT_TO_TEMPERATURE = "light-to-temperature";
const TEMPERATURE_TO_HUMIDITY = "temperature-to-humidity";
const HUMIDITY_TO_LOCATION = "humidity-to-location";

const TABLES = [
  SEED_TO_SOIL,
  SOIL_TO_FERTILIZER,
  FERTILIZER_TO_WATER,
  WATER_TO_LIGHT,
  LIGHT_TO_TEMPERATURE,
  TEMPERATURE_TO_HUMIDITY,
  HUMIDITY_TO_LOCATION,
];
const CODES = ["seed", "soil", "fertilizer", "water", "light", "temperature", "humidity", "location"];

async function main() {
  const textFile = await fs.readFileSync("./day5/input.txt", {
    encoding: "utf8",
    flag: "r",
  });

  textArray = textFile.split(/\r?\n/);
  codeParser(textArray);
}

function codeParser(stringArray) {
  const { data, seeds } = dataParser(stringArray);

  // Part 1
  let results = [];
  seeds.forEach((seed) => {
    const result = parseSeed(seed, data);
    results.push(result);
  });
  let minLocation = Math.min(...results.map((r) => r.location));

  console.log("Part 1: ", minLocation);

  // Part 2
  results = [];
  let seedRangeArray = [];
  for (let i = 0; i <= seeds.length - 1; i += 2) {
    seedRangeArray.push({ start: seeds[i], range: seeds[i + 1] });
  }
  seedRangeArray.forEach((seedRange) => {
    const result = parseSeedRange(seedRange, data);
    results.push(result);
  });

  const minLocations = results.map((r) => Math.min(...r.location.map((l) => l.start)));
  minLocation = Math.min(...minLocations);

  console.log("Part 2: ", minLocation);

  return 0;
}

function dataParser(stringArray) {
  // First row are seeds
  const data = {};
  const seedsString = stringArray.shift();
  seedsArrayUnfiltered = seedsString.split(" ");
  seedsArrayUnfiltered.shift();
  const seeds = seedsArrayUnfiltered.map((s) => Number(s));

  let activeDataSheet = null;
  stringArray.forEach((line) => {
    if (line.includes(SEED_TO_SOIL)) {
      activeDataSheet = SEED_TO_SOIL;
      return;
    } else if (line.includes(SOIL_TO_FERTILIZER)) {
      activeDataSheet = SOIL_TO_FERTILIZER;
      return;
    } else if (line.includes(FERTILIZER_TO_WATER)) {
      activeDataSheet = FERTILIZER_TO_WATER;
      return;
    } else if (line.includes(WATER_TO_LIGHT)) {
      activeDataSheet = WATER_TO_LIGHT;
      return;
    } else if (line.includes(LIGHT_TO_TEMPERATURE)) {
      activeDataSheet = LIGHT_TO_TEMPERATURE;
      return;
    } else if (line.includes(TEMPERATURE_TO_HUMIDITY)) {
      activeDataSheet = TEMPERATURE_TO_HUMIDITY;
      return;
    } else if (line.includes(HUMIDITY_TO_LOCATION)) {
      activeDataSheet = HUMIDITY_TO_LOCATION;
      return;
    }

    if (!activeDataSheet) return;
    if (!line) return;

    if (!data[activeDataSheet]) data[activeDataSheet] = [];
    const numberStringArray = line.split(" ");
    const fromNumber = Number(numberStringArray[1]);
    const toNumber = Number(numberStringArray[0]);
    const range = Number(numberStringArray[2]);
    data[activeDataSheet].push({ from: fromNumber, to: toNumber, range });
  });

  return { data, seeds };
}

function parseSeed(seed, data) {
  const result = {
    seed,
  };
  TABLES.forEach((table) => {
    const [fromCat, toCat] = table.split("-to-");
    data[table].forEach((converter) => {
      if (result[toCat]) return;
      if (result[fromCat] >= converter.from && result[fromCat] <= converter.from + converter.range) {
        const diff = converter.to - converter.from;
        result[toCat] = result[fromCat] + diff;
      }
    });
    if (!result[toCat]) result[toCat] = result[fromCat];
  });

  return result;
}

function parseSeedRange(seedRange, data) {
  const result = {
    seed: [seedRange],
  };
  TABLES.forEach((table) => {
    const [fromCat, toCat] = table.split("-to-");

    result[fromCat].forEach((optionRange) => {
      let currentOptionRange = { ...optionRange };

      if (!result[toCat]) result[toCat] = [];

      data[table].forEach((converter) => {
        // We have a range object now
        // 1 the seed range is in the converter range
        if (!currentOptionRange) return;

        if (
          currentOptionRange.start >= converter.from &&
          currentOptionRange.start + currentOptionRange.range - 1 <= converter.from + converter.range - 1
        ) {
          const diff = converter.to - converter.from;
          result[toCat].push({ start: currentOptionRange.start + diff, range: currentOptionRange.range });
          currentOptionRange = null;
        }

        // 2 half the seed range is in the converter range
        // First half
        else if (
          currentOptionRange.start >= converter.from &&
          currentOptionRange.start <= converter.from + converter.range - 1
        ) {
          const diff = converter.to - converter.from;
          const startFromDiff = converter.from + converter.range - currentOptionRange.start;
          result[toCat].push({ start: currentOptionRange.start + diff, range: startFromDiff });

          // Update current option range
          currentOptionRange.start = currentOptionRange.start + startFromDiff;
          currentOptionRange.range = currentOptionRange.range - startFromDiff;
        }
        // Second half
        else if (
          currentOptionRange.start + currentOptionRange.range - 1 <= converter.from + converter.range - 1 &&
          currentOptionRange.start + currentOptionRange.range - 1 >= converter.from
        ) {
          const diff = converter.to - converter.from;
          const startFromDiff = converter.from - currentOptionRange.start;

          result[toCat].push({
            start: currentOptionRange.start + startFromDiff + diff,
            range: currentOptionRange.range - startFromDiff,
          });

          // Update current option range
          currentOptionRange.range = startFromDiff;
        }
      });

      if (currentOptionRange) {
        result[toCat].push({ ...currentOptionRange });
      }
    });
  });

  return result;
}

main();
