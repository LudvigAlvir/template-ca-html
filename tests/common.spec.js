/* const { test, expect } = require("@playwright/test");
const { rules } = require("./rules.json"); */

//changed to using modules
import { test, expect } from "@playwright/test";
const rules = (
	await import("./rules.json", {
		with: { type: "json" },
	})
).default.rules;

const BASE_URL = "http://127.0.0.1:3000";

const routes = new Set();
routes.add(BASE_URL);

// Crawling through all accessible links to find all routes, will need to be changed to allow login
// Crawling should ignore paths with just extra / or #, and have some filtering for product/{id} so it does not take in to many
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

test(
	"check if all pages have a title",
	{
		annotation: {
			type: "Info",
			description: rules.html["unique-title-provided"],
		},
	},
	async ({ page }) => {
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
	}
);
test(
	"check if all pages have a unique h1",
	{
		annotation: {
			type: "Info",
			description: rules.html["unique-<h1>-provided"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const h1 = await page.$$("h1");
				//soft will make all steps run, even is step before failed it seems like, not fully tested
				expect.soft(h1.length).toBe(1);
			});
		}
	}
);

// need more testing

test(
	"check if all pages have a favicon",
	{
		annotation: {
			type: "Info",
			description: rules.html["use-favicon"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const favicon = await page.$('link[rel="icon"]');
				expect.soft(favicon).not.toBeNull();
			});
		}
	}
);
// This is not tested enough, might be incorrect in some cases
test(
	"check if all headings are in order",
	{
		annotation: {
			type: "Info",
			description: rules.html["use-heading-hierarchy"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const headingElements = await page
					.getByRole("heading")
					.elementHandles();
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
	}
);
test(
	"check if all pages have a description",
	{
		annotation: {
			type: "Info",
			description: rules.html["unique-meta-description-provided"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const description = await page.$('meta[name="description"]');
				expect.soft(description).not.toBeNull();
			});
		}
	}
);
test(
	"check if all pages have a viewport tag",
	{
		annotation: {
			type: "Info",
			description: rules.html["use-meta-viewport"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const viewport = await page.$('meta[name="viewport"]');
				expect.soft(viewport).not.toBeNull();
			});
		}
	}
);

test(
	"check if all pages have a lang attribute",
	{
		annotation: {
			type: "Info",
			description: rules.html["use-english-as-language"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const lang = await page.$("html[lang]");
				expect.soft(lang).not.toBeNull();
			});
		}
	}
);
test(
	"check if all pages have a header, main, footer and nav element",
	{
		annotation: {
			type: "Info",
			description: rules.html["use-semantic-elements"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				expect(await page.$("header")).toBeTruthy();
				expect(await page.$("nav")).toBeTruthy();
				expect(await page.$("main")).toBeTruthy();
				expect(await page.$("footer")).toBeTruthy();
			});
		}
	}
);

test(
	"check if all images have alt text",
	{
		annotation: {
			type: "Info",
			description: rules.html["include-alt-text-for-images"],
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				// Wait for content that comes from api to load, there is a better way to do this
				await page.waitForLoadState("networkidle");
				const images = await page.$$("img");
				for (const image of images) {
					const altText = await image.getAttribute("alt");
					expect.soft(altText).not.toBeNull();
					expect.soft(altText).not.toBe("");
				}
			});
		}
	}
);

// TEMPLATE for tests
/* test(
	"check if ",
	{
		annotation: {
			type: "Info",
			description: "Description",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
			});
		}
	}
);
 */
