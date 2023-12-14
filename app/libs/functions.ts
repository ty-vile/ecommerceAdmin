// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd

// modified first line to take file as buffer not text
export const generateSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const generateSKUCode = async (
  productName: string,
  productCategory: string
) => {
  const productNameWords = productName.split(" ");
  const categorySuffix = productCategory.substring(0, 2).toUpperCase();
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);

  const productNameInitials = productNameWords
    .map((word) => word.charAt(0))
    .join("");

  const skuCode = `${productNameInitials}${categorySuffix}${randomSixDigitNumber}`;

  return skuCode;
};

async function getData() {
  const res = await fetch("https://api.example.com/...");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
