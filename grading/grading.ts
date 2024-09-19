import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { z } from "zod";

// Define the zod schema for a record
const RecordSchema = z.object({
	matrikelnummer: z
		.string()
		.regex(/^\d{8}$/, { message: "Matrikelnummer must be exactly 8 digits" }),
	repo: z.string().regex(/^https:\/\/github.com\//, {
		message: "Repo must start with 'https://github.com/'",
	}),
});

type Record = z.infer<typeof RecordSchema>;

async function readRecords() {
	const fileContent = await readFile("input/input.csv", "utf-8");
	const records: Record[] = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
	});

	let hasError = false;
	for (const record of records) {
		const result = RecordSchema.safeParse(record);
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

async function main() {
	const records = await readRecords();
	console.log(records);
}

main().then();
