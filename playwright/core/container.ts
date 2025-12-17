import "reflect-metadata";
import { container } from "tsyringe";

import { TYPES } from "./types";

// PAGE IMPORTS
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage";
import { UsersPage } from "../pages/usersPage";

// COMPONENT IMPORTS
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Modal } from "../components/modal";

// SERVICE IMPORTS
import { ApiClient } from "../services/api/apiClient";
import { UserService } from "../services/api/userService";
import { ProductService } from "../services/api/productService";
import { DbService } from "../services/db/dbService";
import { TestData } from "../services/testData";

export function registerFramework() {
  // Pages
  container.register(TYPES.LoginPage, { useClass: LoginPage });
  container.register(TYPES.DashboardPage, { useClass: DashboardPage });
  container.register(TYPES.UsersPage, { useClass: UsersPage });

  // Components
  container.register(TYPES.Header, { useClass: Header });
  container.register(TYPES.Sidebar, { useClass: Sidebar });
  container.register(TYPES.Modal, { useClass: Modal });

  // Services
  container.register(TYPES.ApiClient, { useClass: ApiClient });
  container.register(TYPES.UserService, { useClass: UserService });
  container.register(TYPES.ProductService, { useClass: ProductService });
  container.register(TYPES.DbService, { useClass: DbService });
  container.register(TYPES.TestData, { useClass: TestData });
}
