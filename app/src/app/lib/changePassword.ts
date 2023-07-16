export default async function changePassword(
  oldPassword: string,
  newPassword: string
) {
  const response = await fetch("http://localhost:3000/api/changepassword", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  const data = await response.json();
  if (!data) {
    throw new Error("changePassword : data is not ok");
  }
  return data;
}
