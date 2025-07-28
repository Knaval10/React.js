export const fetchUserApi = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  if (!response.ok) throw new Error("Failed to fetch user");
  return await response.json();
};
