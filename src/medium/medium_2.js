import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/

// Loop over an Array
let length = 0;
let citySum = 0;
let highwaySum = 0;
let years = [];
let numHybrids = 0;

mpg_data.forEach(function(item, index, array){
    citySum += item.city_mpg;
    highwaySum += item.highway_mpg;
    length += 1;

    years[years.length] = item.year;

    if (item.hybrid) {
        numHybrids += 1;
    }
});

// take out all hybrids
var makerHybridArray = [];
mpg_data.forEach(function(item, index, array) {
    if(item.hybrid) {
        makerHybridArray[makerHybridArray.length] = {"make": item.make, "hybrids": item.id};
    }
});

function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      let key = obj[property]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj["hybrids"])
      return acc
    }, {})
  }

let groupByMake = groupBy(makerHybridArray, 'make');

let unorderedArray = [];
Object.keys(groupByMake).forEach(key => {
    const maker = {"make": key, "hybrids": groupByMake[key]};
    unorderedArray[unorderedArray.length] = maker;
});

unorderedArray.sort((a, b) => (a.hybrids.length < b.hybrids.length ? 1: -1))
const ordered = unorderedArray;


// avgMpgByYearAndHybrid
let lessInfo = [];
mpg_data.forEach(function(item, index, array) {
    lessInfo[lessInfo.length] = {"year": item.year, 
                                 "hybrid": item.hybrid, 
                                 "city": item.city_mpg,
                                 "highway" : item.highway_mpg}
    
});

let count = Array(30).fill().map(() => Array(2).fill(0));

function groupingBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      let key = obj[property]
      if (!acc[key]) {
        acc[key] = {"hybrid": {"city": 0, 
                               "highway": 0},
                    "notHybrid": {"city": 0,
                                  "highway": 0}
                    }
      }
      if(obj["hybrid"]) {
          count[key - 2000][0] += 1;
          acc[key]["hybrid"]["city"] += obj["city"]
          acc[key]["hybrid"]["highway"] += obj["highway"]
          
      } else {
        count[key - 2000][1] += 1;
        acc[key]["notHybrid"]["city"] += obj["city"]
        acc[key]["notHybrid"]["highway"] += obj["highway"]
        
      }
      return acc
    }, {})
  }
let groupByYear = groupingBy(lessInfo, "year");
Object.keys(groupByYear).forEach(key => {
    groupByYear[key]["hybrid"]["city"] /= count[key - 2000][0]
    groupByYear[key]["hybrid"]["highway"] /= count[key - 2000][0]
    groupByYear[key]["notHybrid"]["city"] /= count[key - 2000][1]
    groupByYear[key]["notHybrid"]["highway"] /= count[key - 2000][1]
});
export const ar = groupByYear;
/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: {"city" : citySum/length, 
             "highway" : highwaySum/length},
    allYearStats: getStatistics(years),
    ratioHybrids: numHybrids / length,
};



/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export default {
    makerHybrids: ordered,
    avgMpgByYearAndHybrid: ar
};