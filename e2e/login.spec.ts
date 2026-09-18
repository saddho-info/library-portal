import { expect, test } from "@playwright/test";

test.describe("Library login", () => {
  test("renders branded sign-in on desktop and mobile", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("PubTrack")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Library sign in" }),
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });
});
