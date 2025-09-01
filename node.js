// Import the 'fs' (File System) module to handle file operations in Node.js
const fs = require('fs');

/**
 * Converts a string representation of a number from a given base to a BigInt decimal.
 * This function correctly handles digits beyond 9 (a, b, c, etc.) and negative numbers.
 * @param {string} valueStr The number as a string.
 * @param {number} base The base of the number.
 * @returns {BigInt} The decimal representation as a BigInt.
 */
function baseToDecimal(valueStr, base) {
    const digits = '0123456789abcdef';
    const baseBigInt = BigInt(base);
    let result = 0n;
    let isNegative = false;

    if (valueStr[0] === '-') {
        isNegative = true;
        valueStr = valueStr.substring(1);
    }

    for (const char of valueStr) {
        const digitValue = BigInt(digits.indexOf(char.toLowerCase()));
        if (digitValue === -1n || digitValue >= baseBigInt) {
            throw new Error(`Invalid digit '${char}' for base ${base}`);
        }
        result = result * baseBigInt + digitValue;
    }

    return isNegative ? -result : result;
}

// --- Main Execution ---

// 1. Get the JSON file name from the command-line arguments
const fileName = process.argv[2];

if (!fileName) {
    console.error("Error: Please provide the path to the JSON file as an argument.");
    console.error("Usage: node solve.js <filename.json>");
    process.exit(1); // Exit with an error code
}

// 2. Read and parse the JSON file
let data;
try {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    data = JSON.parse(fileContent);
} catch (error) {
    console.error(`Error reading or parsing the file '${fileName}':`, error.message);
    process.exit(1);
}

const n = data.keys.n;

// 3. Initialize the product using BigInt
let productOfRoots = 1n; // Use 'n' to denote a BigInt

// 4. Loop through each root, convert, and multiply
console.log("--- Converting Roots ---");
for (const key in data) {
    if (key !== "keys") {
        const rootData = data[key];
        const base = parseInt(rootData.base, 10);
        const value = rootData.value;
        
        const decimalRoot = baseToDecimal(value, base);
        console.log(`Root "${key}" (base ${base}): ${value} -> ${decimalRoot.toString()}`);
        
        productOfRoots *= decimalRoot;
    }
}
console.log("------------------------");


// 5. Apply the formula c = a_n * (-1)^n * product
let constantTerm = productOfRoots;

// If n is odd, the sign flips. If n is even, it stays the same.
if (n % 2 !== 0) {
    constantTerm = -constantTerm;
}

// 6. Print the final result
console.log(`\nProduct of all roots: ${productOfRoots.toString()}`);
console.log(`n = ${n}, so (-1)^n is ${n % 2 === 0 ? 1 : -1}`);
console.log("\nFinal Constant Term (c):");
console.log(constantTerm.toString());