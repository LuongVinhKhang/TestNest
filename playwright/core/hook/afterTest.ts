export async function afterTest(testInfo) {
  if (testInfo.status !== "passed") {
    console.log("Capturing logs...");
  }
}
