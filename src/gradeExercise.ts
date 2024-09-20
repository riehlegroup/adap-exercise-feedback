import { buildDockerImage } from "./common/buildDockerImage";
import { readStudents } from "./common/readStudents";
import { runGrading } from "./grading/runGrading";

async function main() {
	const students = await readStudents();
	buildDockerImage();

	for (const student of students) {
		runGrading({ student });
	}
}

main().then();
