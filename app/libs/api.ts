export const RegisterUser = async (values: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch("/api/register", {
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

  return { msg: response.status };
};
