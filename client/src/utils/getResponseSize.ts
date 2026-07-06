export const getResponseSize = <T>(data: T) => {
  const sizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);

  console.log("Response size:", sizeInBytes, "bytes");
  console.log("Response size:", sizeInKB, "KB");
};
