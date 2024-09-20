import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { STUDENT_INFO_FILE } from "./config";

// Define the zod schema for a record
export const StudentDataSchema = z.object({
	matrikelnummer: z
		.string()
		.regex(/^\d{8}$/, { message: "Matrikelnummer must be exactly 8 digits" }),
	repo: z.string().regex(/^https:\/\/github.com\//, {
		message: "Repo must start with 'https://github.com/'",
	}),
});

export type StudentData = z.infer<typeof StudentDataSchema>;

export async function readStudents() {
	const fileContent = await readFile(STUDENT_INFO_FILE, "utf-8");
	const records: StudentData[] = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
	});

	let hasError = false;
	for (const record of records) {
		const result = StudentDataSchema.safeParse(record);
		if (!result.success) {
			console.error(
				"Error in record:",
				record,
				"\nValidation errors:",
				result.error.issues,
			);
			hasError = true;
		}
	}

	if (hasError) {
		process.exit(1);
	}

	return records;
}
