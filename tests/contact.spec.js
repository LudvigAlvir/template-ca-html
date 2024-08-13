const { test, expect } = require("@playwright/test");

const BASE_URL = `http://127.0.0.1:3000/contact`;

test("Check if page has fields with id: name and message", async ({ page }) => {
	await page.goto(BASE_URL);
	expect(await page.$("#name")).toBeTruthy();
	expect(await page.$("#message")).toBeTruthy();
});
