import { execSync, spawnSync } from "node:child_process";
import { EXERCISE } from "./config";

export function buildDockerImage() {
	spawnSync(
		"docker",
		[
			"build",
			"--build-arg",
			`EXERCISE=${EXERCISE}`,
			"-t",
			`adap-grading:${EXERCISE}`,
			".",
		],
		{
			stdio: "inherit",
		},
	);
}
