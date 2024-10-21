import assert from "node:assert";
import * as fs from "node:fs/promises";
import path from "node:path";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { Logger } from "./common/Logger";
import { EXERCISE, GRADING_ROOT } from "./common/config";
import { readStudents } from "./common/readStudents";

const logger = new Logger("Aggregate Exercise");

function sumUpResult(
	grades: ExerciseResult[],
	row: keyof Omit<ExerciseResult, "matrikelnummer" | "buildSuccessful">,
) {
	return grades.map((g) => g[row]).reduce((p, c) => p + c, 0);
}

const ExerciseResultSchema = z.object({
	matrikelnummer: z.string(),
	buildSuccessful: z.boolean(),
	numTotalTests: z.number().int(),
	numPassedTests: z.number().int(),
	numFailedTests: z.number().int(),
});

type ExerciseResult = z.infer<typeof ExerciseResultSchema>;

async function main() {
	logger.log(`Aggregating exercise ${EXERCISE}`);

	const students = await readStudents();

	const grades = await Promise.all(
		students.map(async (student) => {
			const resultsFile = path.resolve(
				GRADING_ROOT,
				student.matrikelnummer,
				"exercise.json",
			);
			const buildResultsFile = path.resolve(
				GRADING_ROOT,
				student.matrikelnummer,
				"build.json",
			);

			const buildSuccessful =
				// Can open
				(await fs
					.access(buildResultsFile, fs.constants.R_OK)
					.then(() => true)
					.catch(() => false)) &&
				// Proper content
				(await fs.readFile(buildResultsFile)).toString() ===
					'{ "buildSuccessful": true }';

			const grades = ExerciseResultSchema.parse({
				matrikelnummer: student.matrikelnummer,
				buildSuccessful,
				...JSON.parse((await fs.readFile(resultsFile)).toString()),
			});

			assert(
				grades.numPassedTests + grades.numFailedTests === grades.numTotalTests,
			);

			return grades;
		}),
	);

	const sum = {
		numTotalTests: sumUpResult(grades, "numTotalTests"),
		numPassedTests: sumUpResult(grades, "numPassedTests"),
		numFailedTests: sumUpResult(grades, "numFailedTests"),
	} as const satisfies Partial<ExerciseResult>;

	logger.log("Sum: ", sum);

	logger.log(
		`Passed: ${sum.numPassedTests} (${Math.round((sum.numPassedTests / sum.numTotalTests) * 100)}%)`,
	);
	logger.log(
		`Failed: ${sum.numFailedTests} (${Math.round((sum.numFailedTests / sum.numTotalTests) * 100)}%)`,
	);

	await fs.writeFile(
		`${GRADING_ROOT}/aggregated.csv`,
		stringify(grades, { header: true }),
	);
}

main().then();
