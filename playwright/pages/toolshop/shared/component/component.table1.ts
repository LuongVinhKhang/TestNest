export class TableComponent {
  // No constructor, no this.page

  static cleanTableRecords(records: Record<string, string>[]): Record<string, string>[] {
    return (
      records
        .map(record => {
          const cleaned: Record<string, string> = {};
          Object.entries(record).forEach(([key, value]) => {
            if (key) cleaned[key] = value;
          });
          return cleaned;
        })
        .filter(record => Object.values(record).some(value => value !== ""))
    );
  }

  static async extractTableDataViaLocators(
    tableLocator: import("@playwright/test").Locator,
  ): Promise<Record<string, string>[]> {
    const headers = (await tableLocator.locator("thead th").allTextContents()).map(h => h.trim());
    const rows = tableLocator.locator("tbody tr");
    const rowCount = await rows.count();
    const rawRecords: Record<string, string>[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cells = await rows.nth(i).locator("td").allTextContents();
      const record: Record<string, string> = {};
      headers.forEach((header, idx) => {
        record[header] = cells[idx] || "";
      });
      rawRecords.push(record);
    }
    return TableComponent.cleanTableRecords(rawRecords);
  }

  static async clickActionButtonByColumnValueLocator(
    tableLocator: import("@playwright/test").Locator,
    columnName: string,
    value: string,
    actionLocatorBuilder: (
      row: import("@playwright/test").Locator,
    ) => import("@playwright/test").Locator,
  ): Promise<void> {
    const headers = (await tableLocator.locator("thead th").allTextContents()).map(h => h.trim());
    const columnIndex = headers.indexOf(columnName);
    if (columnIndex === -1) {
      throw new Error(`Column "${columnName}" not found in table headers.`);
    }
    const rows = tableLocator.locator("tbody tr");
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cell = await row.locator("td").nth(columnIndex).innerText();
      if (cell.trim() === value) {
        await actionLocatorBuilder(row).click();
        return;
      }
    }
    throw new Error(`Row with ${columnName}="${value}" not found or action button missing.`);
  }
}