// lets say you have an array of objects
// The objects may share keys. Each key has a numeric value
// [{a: 1, b: 2}, {b: 3, c: 4}, {a: 1, b: 7}]
// this functions sums over values with similar keys and then sorts them
// and returns a Map like this
// new Map(['b', 12], ['c', 4], ['a', 2])

export default function sortCollectionByKey(collection, sortOrder = "asc") {
  let arrayOfMaps = collection.map(obj => new Map(Object.entries(obj)));
  const unsortedAccumulatedMap = arrayOfMaps.reduce((acc, current) => {
    for (let [key, value] of current) {
      const existingValue = acc.get(key);
      const currentValue = value || 0;
      if (existingValue) {
        acc.set(key, existingValue + currentValue);
      } else {
        acc.set(key, currentValue);
      }
    }
    return acc;
  }, new Map());

  const sortedArray = Array.from(unsortedAccumulatedMap).sort(
    ([key1, value1], [key2, value2]) => {
      switch (sortOrder) {
        case "desc":
          return value2 - value1;
        case "asc":
        default:
          return value1 - value2;
      }
    }
  );

  return new Map(sortedArray);
}
