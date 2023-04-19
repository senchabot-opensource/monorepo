export const getDefaultCmdList = async () => {
  const response = await fetch("/api/cmd", {
    method: "GET",
  });
  return response.json();
};

export const getFeatureList = async () => {
  const response = await fetch("/api/features", {
    method: "GET",
  });
  return response.json();
}