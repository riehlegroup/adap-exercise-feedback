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
	const result = spawnSync(
		"docker",
		[
			"run",
			"-v",
			`${REPO_ROOT}/${student.matrikelnummer}:/student`,
			"-v",
			`${GRADING_ROOT}/${student.matrikelnummer}:/results`,
			"--rm",
			`adap-grading:${EXERCISE}`,
		],
		{
			stdio: "inherit",
		},
	);
}
