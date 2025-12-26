import { TableComponent } from "../shared/component/component.table";
import { AdminBasePage } from "./page.admin-base";

type UserTableRow = {
  id: string;
  name: string;
  email: string;
};

export class AdminUsersPage extends AdminBasePage {
  get elements() {
    return {
      ...super.elements,
      userTable: () => this.page.locator("table"),
    };
  }

  async getUsersTableData(): Promise<UserTableRow[]> {
    const rawRows = await TableComponent.extractTableDataViaLocators(this.elements.userTable());
    return rawRows.map((row: Record<string, string>) => ({
      id: row["Id"],
      name: row["Name"],
      email: row["Email"],
    }));
  }

  async editUserByEmail(email: string) {
    await TableComponent.clickActionButtonByColumnValueLocator(
      this.elements.userTable(),
      "Email",
      email,
      row => row.getByRole("link", { name: "Edit" }),
    );
    await this.page.waitForLoadState("networkidle");
  }
}
