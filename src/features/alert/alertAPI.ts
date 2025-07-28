export const fetchAlertData = async () => {
  //   try {
  const response = await fetch(
    "https://bipadportal.gov.np/api/v1/alert/?rainBasin=&rainStation=&riverBasin=&riverStation=&hazard=&inventoryItems=&started_on__gt=2025-07-18T00%3A00%3A00%2B05%3A45&started_on__lt=2025-07-25T23%3A59%3A59%2B05%3A45&expand=event&ordering=-started_on"
  );
  return await response.json();
  //   } catch (error) {
  //     console.log("error", error);
  //   }
};
