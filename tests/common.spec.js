const { test, expect } = require("@playwright/test");

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
			description:
				"Each HTML page requires a unique title that encapsulates the page's context, such as <title>About</title>. See these resources for more information: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title | See course content --> A Basic HTML Page: https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#a-basic-html-page",
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
			description:
				"Each HTML page requires a unique <h1> element that serves as the most important heading on the page. See these resources for more information: https://www.seoptimer.com/blog/h1-html-tag/ | See course content --> A Basic HTML Page: https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#a-basic-html-page",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const h1 = await page.$$("h1");
				//soft will make all steps run it seems like, not fully tested
				expect.soft(h1.length).toBe(1);
			});
		}
	}
);

test(
	"check if all pages have a favicon",
	{
		annotation: {
			type: "Info",
			description:
				"Favicons should appear in the corner of the website tab for added branding. See these resources for more information: https://mailchimp.com/resources/favicon-guide/ | See course content --> A Basic HTML Page: https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#a-basic-html-page",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const favicon = await page.$('link[rel="icon"]');
				expect(favicon).not.toBeNull();
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
			description:
				"The headings should be used in hierarchical order and should not skip levels. See these resources for more information: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements | See course content --> Nav element: https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#semantics",
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
			description:
				"Each HTML page requires a unique meta description that tells the user what the web application is about. See these resources for more information: https://www.seobility.net/en/wiki/Meta_Description | See course content --> A Basic HTML Page:https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#a-basic-html-page",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const description = await page.$('meta[name="description"]');
				expect(description).not.toBeNull();
			});
		}
	}
);
test(
	"check if all pages have a viewport tag",
	{
		annotation: {
			type: "Info",
			description:
				"Each HTML page requires a meta viewport tag in order to access the viewport dimensions of the screen it is being displayed on for responsiveness. See these resources for more information: https://www.semrush.com/blog/viewport-meta-tag/ | See course content --> A Basic HTML Page: https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#a-basic-html-page",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const viewport = await page.$('meta[name="viewport"]');
				expect(viewport).not.toBeNull();
			});
		}
	}
);

test(
	"check if all pages have a lang attribute",
	{
		annotation: {
			type: "Info",
			description:
				"The 'lang' attribute needs to specify the langauge of the document as 'en' for English. For more information please see:: https://www.geeksforgeeks.org/what-is-the-difference-between-html-langen-and-html-langen-us/ | See course content --> : https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#a-basic-html-page",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const lang = await page.$("html[lang]");
				expect(lang).not.toBeNull();
			});
		}
	}
);
test(
	"check if all pages have a header, main, footer and nav element",
	{
		annotation: {
			type: "Info",
			description:
				"The HTML page needs to be semantic in that the appropriate tags are used as intended. For more information please see https://www.semrush.com/blog/semantic-html5-guide/ | See course content --> Semantics: https://mollify.noroff.dev/content/feu1/html-css/module-1/intro-html?nav=programme#semantics",
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
			description:
				"Add descriptive alt text to all <img> elements. See these resources for more information: https://www.semrush.com/blog/alt-text/ | See course content --> Images in HTML: https://mollify.noroff.dev/content/feu1/html-css/module-2/images-icons#images-in-html",
		},
	},
	async ({ page }) => {
		for (const route of routes) {
			await test.step(route, async () => {
				await page.goto(route);
				const images = await page.$$("img");
				for (const image of images) {
					const altText = await image.getAttribute("alt");
					expect(altText).not.toBeNull();
					expect(altText).not.toBe("");
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
