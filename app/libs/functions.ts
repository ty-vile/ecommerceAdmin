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

export const generateSKUCode = async (productName: string) => {
  const productNameWords = productName.split(" ");
  const randomTenDigitCombination = generateRandomString(10);

  const productNameInitials = productNameWords
    .map((word) => word.charAt(0))
    .join("");

  const skuCode = `${productNameInitials}${randomTenDigitCombination}`;

  return skuCode;
};

const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const toggleFormStep = async (
  trigger: any,
  directionStep: string,
  currStep: number,
  setFormStep: (index: number) => void,
  fields?: any[]
) => {
  if (directionStep === "next") {
    try {
      const isValid = await trigger(fields!);

      if (isValid) {
        setFormStep(currStep + 1);
      }
    } catch (error) {
      console.error("Error during form validation:", error);
    }
  }

  if (directionStep === "previous") {
    setFormStep(currStep - 1);
  }
};
