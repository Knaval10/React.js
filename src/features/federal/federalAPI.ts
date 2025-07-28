export const fetchProvincialData = async () => {
  const response = await fetch("https://bipadportal.gov.np/api/v1/province/");
  return await response.json();
};
