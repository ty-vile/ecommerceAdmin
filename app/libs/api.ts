// @types - body: {email:string, role:string}
export const RegisterUser = async (values: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch("api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the appropriate content-type for your data
    },
    body: JSON.stringify(values), // Convert data object to JSON string
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {email:string, role:string, task:string}
export const DeleteUser = async (body: { email: string }) => {
  const response = await fetch("/api/user", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the appropriate content-type for your data
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {email:string, role:string, task:string}
export const UpdateUserRole = async (body: {
  email: string;
  role: string;
  task: string;
}) => {
  const response = await fetch("/api/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {name: string, description: string}
export const CreateProduct = async (body: {
  name: string;
  description: string;
}) => {
  const response = await fetch("/api/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {productId: string}
export const DeleteProduct = async (body: { productId: string }) => {
  const response = await fetch("/api/product", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the appropriate content-type for your data
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {name: string}
export const CreateCategory = async (body: { name: string }) => {
  const response = await fetch("/api/product/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {productId: string, categoryId: string, createdByUser: string}
export const CreateProductCategoryJoin = async (body: {
  productId: string;
  categoryId: string;
  createdByUser: string;
}) => {
  const response = await fetch("/api/product/category/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {productId: string, sku:string}
export const CreateProductSku = async (body: {
  productId: string;
  sku: string;
}) => {
  const response = await fetch("/api/product/sku", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {skuId :string}
export const DeleteProductSku = async (body: { skuId: string }) => {
  const response = await fetch("/api/product/sku", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the appropriate content-type for your data
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {skuId :string}
export const PatchProductSku = async (body: {
  skuId: string;
  quantity: string;
}) => {
  const response = await fetch("/api/product/sku", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json", // Set the appropriate content-type for your data
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {productId: string, sku:string}
export const CreateProductSkuPrice = async (body: {
  price: number;
  skuId: string;
}) => {
  const response = await fetch("/api/product/price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {url: string, productSkuId:string}
export const CreateProductImage = async (body: {
  url: string;
  productSkuId: string;
}) => {
  const response = await fetch("/api/product/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

// @types - body: {attributes: {productAttribute: string;productAttributeValues: { name: string }[];}[];}
export const CreateAttribute = async (body: { productAttribute: string }) => {
  const response = await fetch("/api/product/attribute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {name: string, productAttributeId: string}
export const CreateAttributeValue = async (body: {
  name: string;
  productAttributeId: string;
}) => {
  const response = await fetch("/api/product/attribute/value", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {name: string, productAttributeId: string}
export const CreateAttributeSkuJoin = async (body: {
  skuId: string;
  productAttributeValueId: string;
}) => {
  const response = await fetch("/api/product/attribute/sku", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};
