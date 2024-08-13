const { test, expect } = require("@playwright/test");

const BASE_URL = `http://127.0.0.1:3000`;

// not tested enough
test(
	"Check for links to products, checkout and contact",
	{
		annotation: {
			type: "Info",
			description:
				"The home page has to have links to products, checkout and contact to pass automatic testing, refer to assignemnt brief",
		},
	},
	async ({ page }) => {
		await page.goto(BASE_URL);
		const routes = new Set();

		const linkElements = page.getByRole("link");
		const hrefs = await linkElements.evaluateAll((links) =>
			links.map((link) => link.href)
		);

		for (const link of hrefs) {
			if (link.includes(BASE_URL)) {
				routes.add(link);
			}
		}

		// LIST OF REQUIRED LINKS
		const required = ["products", "checkout", "contact"];

		for (const route of routes) {
			for (let i in required) {
				if (route.includes(required[i])) {
					required.splice(i, 1);
					break;
				}
			}
		}
		expect(required.length).toBe(0);
	}
);
