Tip: Using .filter(Boolean) to Remove Falsy Values from Arrays
.filter(Boolean) is a concise way to remove all "falsy" values (false, 0, "", null, undefined, NaN) from an array in JavaScript/TypeScript.

Example:
const arr = [0, 1, false, 2, '', 3, null, undefined];
const filtered = arr.filter(Boolean); // Result: [1, 2, 3]
This is useful for cleaning up arrays before further processing.

----
for in for loop
console.log("hello world");

const car = { engine: true };
const sportsCar = Object.create(car);
sportsCar.speed = "fast";

console.log("The sportsCar object: ", sportsCar);

for (prop in sportsCar) {
  console.log("?", prop);
}

for (key of Object.keys(sportsCar)) {
  console.log("-", key, sportsCar[key]);
}

---
// spread operator
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function sum(...nums) {
  return nums.reduce((total, current) => total + current);
}
console.log(...numbers);
console.log(sum(...numbers));

// rest operator
function addTaxToPrices(taxRate, ...itemsBought) {
  return itemsBought.map((item) => taxRate * item);
}
let shoppingCart = addTaxToPrices(1.1, 46, 89, 35, 79);
console.log(shoppingCart);

---

const name = "John";
const a = `Hello, ${name}!`;
const b = `Hello, ${name.toUpperCase()}!`;

const messageMultiline = `Hello, ${name}!
How are you?`;

console.log(a); // Hello, John!
console.log(b); // Hello, JOHN!
console.log(messageMultiline);

--- desctruc
let { PI } = Math;

console.log("PI: ", PI);

console.log(PI === Math.PI);

