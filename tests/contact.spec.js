/* const { test, expect } = require("@playwright/test"); */

//changed to using modules
import { test, expect } from "@playwright/test";
const BASE_URL = `http://127.0.0.1:3000/contact`;

test(
	"Check if page has fields with id: name and message",
	{
		annotation: {
			type: "Info",
			description:
				"The contact page has to have fields the user can type into with id: name and message to pass automatic testing, refer to assignemnt brief",
		},
	},
	async ({ page }) => {
		await page.goto(BASE_URL);
		expect(await page.$("#name")).toBeTruthy();
		expect(await page.$("#message")).toBeTruthy();
	}
);
