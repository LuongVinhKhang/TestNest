# Mapping Test Cases to Automated Tests

Below is the mapping of Phase 1 manual test cases to Playwright automated tests. Each test case is linked to a spec file and a test block name.

## Login Test Cases
| Test Case ID | Spec File                   | Test Block Name                        |
|--------------|----------------------------|----------------------------------------|
| L-01         | tests/auth/login.spec.ts   | should login with valid credentials    |
| L-02         | tests/auth/login.spec.ts   | should show error for invalid password |
| L-03         | tests/auth/login.spec.ts   | should show error for unregistered email |
| L-04         | tests/auth/login.spec.ts   | should show error for empty fields     |

## Add to Cart & Checkout Test Cases
| Test Case ID | Spec File                           | Test Block Name                                 |
|--------------|-------------------------------------|------------------------------------------------|
| C-01         | tests/product_catalog/add_to_cart.spec.ts | should add product to cart and checkout        |
| C-02         | tests/product_catalog/add_to_cart.spec.ts | should prompt login when checking out as guest |
| C-03         | tests/product_catalog/add_to_cart.spec.ts | should remove product from cart                |
| C-04         | tests/product_catalog/add_to_cart.spec.ts | should prevent checkout with empty cart        |

---

**Next:** STOP and ask for user feedback before implementation.
