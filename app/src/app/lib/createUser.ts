export default async function createUser(email: string, password: string) {
  const response = await fetch("http://localhost:3000/api/authApi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!data) throw new Error("create user : data is not ok");

  return data;
}
