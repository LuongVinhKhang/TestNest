import { Reporter } from "@playwright/test/reporter";

class JsonReporter implements Reporter {
  onEnd(result) {
    require("fs").writeFileSync("report.json", JSON.stringify(result, null, 2));
  }
}
export default JsonReporter;
