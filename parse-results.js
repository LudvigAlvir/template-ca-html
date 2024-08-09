const fs = require("fs");

try {
	// Read the Playwright JSON report
	const report = JSON.parse(fs.readFileSync("playwright-report.json", "utf-8"));

	// Extract test results
	const testResults = report.suites[0].specs.map(
		(spec) => spec.tests[0].results[0].status
	);
	const totalTests = testResults.length;
	const passedTests = testResults.filter(
		(status) => status === "passed"
	).length;
	const score = passedTests;

	// Output the results
	console.log(`::set-output name=total::${totalTests}`);
	console.log(`::set-output name=passed::${score}`);
	console.log(`::set-output name=score::${score}`);
} catch (error) {
	console.error("Error parsing Playwright report:", error);
	process.exit(1);
}
