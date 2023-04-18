export const getDefaultCmdList = async () => {
  const response = await fetch("/api/cmd", {
    method: "GET",
  });
  return response.json();
};
