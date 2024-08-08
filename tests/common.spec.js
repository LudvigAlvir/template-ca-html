const { test, expect } = require("@playwright/test");

const BASE_URL = "http://127.0.0.1:3000";
const routes = new Set();
routes.add(BASE_URL);

// Crawling through all accessible links to find all routes, will need to be changed to allow login
test.beforeAll(async ({ browser }) => {
	const page = await browser.newPage();
	await page.goto(BASE_URL);

	const linkElements = page.getByRole("link");
	const hrefs = await linkElements.evaluateAll((links) =>
		links.map((link) => link.href)
	);

	for (const link of hrefs) {
		if (link.includes(BASE_URL)) {
			routes.add(link);
		}
	}
	for (const route of routes) {
		await page.goto(route);
		const newLinkElements = page.getByRole("link");
		const newHrefs = await newLinkElements.evaluateAll((links) =>
			links.map((link) => link.href)
		);
		for (const link of newHrefs) {
			if (link.includes(BASE_URL)) {
				routes.add(link);
			}
		}
	}
});

test("check if all pages have a title", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			await expect(page).not.toHaveTitle("Document");
			await expect(page).not.toHaveTitle("Untitled");
			await expect(page).not.toHaveTitle("Error");
			await expect(page).not.toHaveTitle("404");
			await expect(page).not.toHaveTitle("Not Found");
			await expect(page).not.toHaveTitle("Forbidden");
			await expect(page).not.toHaveTitle("Unauthorized");
			await expect(page).not.toHaveTitle("Bad Request");
			await expect(page).not.toHaveTitle("Internal Server Error");
			await expect(page).not.toHaveTitle("Service Unavailable");
			await expect(page).not.toHaveTitle("Gateway Timeout");
			await expect(page).not.toHaveTitle("Too Many Requests");
			await expect(page).not.toHaveTitle("Not Implemented");
			await expect(page).not.toHaveTitle("Not Acceptable");
			await expect(page).not.toHaveTitle("Not Found");
			await expect(page).not.toHaveTitle("");
		});
	}
});
test("check if all pages have a unique h1", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			const h1 = await page.$$("h1");
			expect(h1.length).toBe(1);
		});
	}
});

test("check if all pages have a favicon", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			const favicon = await page.$('link[rel="icon"]');
			expect(favicon).not.toBeNull();
		});
	}
});

test("check if all headings are in order", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			const headingElements = await page.getByRole("heading").elementHandles();
			const headings = await Promise.all(
				headingElements.map(async (element) => ({
					tag: await element.evaluate((node) => node.tagName),
					text: await element.evaluate((node) => node.innerText),
				}))
			);
			const getHeadingLevel = (tag) => parseInt(tag.substring(1), 10);
			let previousLevel = 0;
			for (const heading of headings) {
				const currentLevel = getHeadingLevel(heading.tag);

				if (currentLevel > previousLevel) {
					expect(currentLevel).toBe(previousLevel + 1);
				} else {
					expect(currentLevel).toBeLessThanOrEqual(previousLevel);
				}
				previousLevel = currentLevel;
			}
		});
	}
});
test("check if all pages have a description", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			const description = await page.$('meta[name="description"]');
			expect(description).not.toBeNull();
		});
	}
});
test("check if all pages have a viewport tag", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			const viewport = await page.$('meta[name="viewport"]');
			expect(viewport).not.toBeNull();
		});
	}
});
test("check if all pages have a lang attribute", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			const lang = await page.$("html[lang]");
			expect(lang).not.toBeNull();
		});
	}
});
test("check if all pages have a header, main, footer and nav element", async ({
	page,
}) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			expect(await page.$("header")).toBeTruthy();
			expect(await page.$("nav")).toBeTruthy();
			expect(await page.$("main")).toBeTruthy();
			expect(await page.$("footer")).toBeTruthy();
		});
	}
});

test("check if all images have alt text", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
			//this could probably be one line but I'm not sure how to do that :)
			await expect(page.getByRole("img")).not.toHaveAttribute("alt", "");
			await expect(page.getByRole("img")).toHaveAttribute("alt");
		});
	}
});

// TEMPLATE
/* test("check if ", async ({ page }) => {
	for (const route of routes) {
		await test.step(route, async () => {
			await page.goto(route);
		});
	}
}); */
