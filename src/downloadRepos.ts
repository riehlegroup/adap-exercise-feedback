import { spawnSync } from "node:child_process";
import path from "node:path";
import { Logger } from "./common/Logger";
import { REPO_ROOT, SOLUTIONS_REPO } from "./common/config";
import { readStudents } from "./common/readStudents";

const logger = new Logger("Repo Downloader");

function cloneRepo(link: string, destination: string) {
	const fullDestination = path.join(REPO_ROOT, destination);
	logger.log(`Cloning ${link} to ${fullDestination}`);
	spawnSync("git", ["clone", link, fullDestination], {
		stdio: "inherit",
	});
}

async function main() {
	const records = await readStudents();

	cloneRepo(SOLUTIONS_REPO, "solution");

	for (const record of records) {
		cloneRepo(record.repo, record.matrikelnummer);
	}
}

main().then();
