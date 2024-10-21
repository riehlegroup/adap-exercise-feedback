export class Logger {
	constructor(private readonly name: string) {}

	private getDate(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const day = String(now.getDate()).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	log(...args: unknown[]) {
		const date = `\x1b[90m${this.getDate()}\x1b[0m`; // Light gray
		const name = `\x1b[1m[${this.name}]\x1b[0m`; // Bold

		console.log(`${date} ${name}`, ...args);
	}

	error(...args: unknown[]) {
		const date = `\x1b[90m${this.getDate()}\x1b[0m`; // Light gray
		const name = `\x1b[1m[${this.name}]\x1b[0m`; // Bold

		console.log(`${date} ${name}`, ...args);
	}
}
