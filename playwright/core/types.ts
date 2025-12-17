export const TYPES = {
  Page: Symbol.for("Page"),

  // Pages
  LoginPage: Symbol.for("LoginPage"),
  DashboardPage: Symbol.for("DashboardPage"),
  UsersPage: Symbol.for("UsersPage"),

  // Components
  Header: Symbol.for("Header"),
  Sidebar: Symbol.for("Sidebar"),
  Modal: Symbol.for("Modal"),

  // Services
  ApiClient: Symbol.for("ApiClient"),
  UserService: Symbol.for("UserService"),
  ProductService: Symbol.for("ProductService"),
  DbService: Symbol.for("DbService"),
  TestData: Symbol.for("TestData"),
};
