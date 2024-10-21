import { execSync, spawnSync } from "node:child_process";
import * as fs from "node:fs";
import { Logger } from "../common/Logger";
import { EXERCISE, GRADING_ROOT, REPO_ROOT, UID } from "../common/config";
import type { StudentData } from "../common/readStudents";

type GradingConfig = {
	student: StudentData;
};

const logger = new Logger("Grading");

export function runGrading({ student }: GradingConfig) {
	logger.log(`Grading student ${student.matrikelnummer}`);
	fs.mkdirSync(`${GRADING_ROOT}/${student.matrikelnummer}`, {
		recursive: true,
	});
	try {
		const result = spawnSync(
			"docker",
			[
				"run",
				// Mount student repo
				"-v",
				`${REPO_ROOT}/${student.matrikelnummer}:/student`,
				// Mount solution repo
				"-v",
				`${GRADING_ROOT}/${student.matrikelnummer}:/results`,
				// Disable network access (npm ci is called during Building)
				"--network=none",
				// Cleanup: Remove the container after the run
				"--rm",
				// Image
				`adap-grading:${EXERCISE}`,
			],
			{
				stdio: "inherit",
			},
		);
	} catch (e) {
		logger.log(`[${student.matrikelnummer}] Failed.`, e);
	}
}
