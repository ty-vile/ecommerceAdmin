// @types - body: {email:string, role:string}
export const RegisterUser = async (values: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch("/api/user/register", {
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

// @types - email:string
export const DeleteUser = async (email: string) => {
  const response = await fetch("/api/user/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the appropriate content-type for your data
    },
    body: JSON.stringify(email),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.statusText);
};

// @types - body: {email:string, role:string}
export const UpdateUserRole = async (body: { email: string; role: string }) => {
  const response = await fetch("/api/user/role", {
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
  const response = await fetch("/api/product/create", {
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

// @types - body: {name: string}
export const CreateCategory = async (body: { name: string }) => {
  const response = await fetch("/api/product/category/create", {
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
export const ProductCategoryJoin = async (body: {
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
  const response = await fetch("/api/product/sku/create", {
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
  const response = await fetch("/api/product/image/create", {
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
