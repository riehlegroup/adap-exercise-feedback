import path from "node:path";
import { z } from "zod";

export const STUDENT_INFO_FILE = "data/input.csv";

export const EXERCISE = z
	.enum(["b01", "b02", "b03", "b04", "b05", "b06"], {
		message: "The first parameter must be 'b01' to 'b06'.",
	})
	.parse(process.argv[2]);

export const REPO_ROOT = path.resolve("data", EXERCISE, "repositories");
export const GRADING_ROOT = path.resolve("data", EXERCISE, "grading");

export const SOLUTIONS_REPO = "git@github.com:riehlegroup/adap-names.git";

export const UID = process.getuid?.() ?? 1000;
