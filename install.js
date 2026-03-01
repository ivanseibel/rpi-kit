#!/usr/bin/env node
/**
 * rpi-kit — Unified installer
 *
 * Installs all RPI skills to ~/.agents/skills/ (single canonical path).
 * Tool-agnostic: works with Copilot, Claude, Gemini, Cursor, Codex, or any
 * agent that reads from ~/.agents/skills/.
 *
 * What gets installed:
 *   skills/* → ~/.agents/skills/
 *
 * Usage:
 *   node install.js [options]
 *
 * Options:
 *   --target <path>   Override destination directory.
 *                     Default: ~/.agents/skills
 *   --mode <mode>     File conflict resolution: skip | overwrite | prompt
 *                     Default: skip
 *   --dry-run         Print planned actions without writing files.
 *   -h, --help        Show this message.
 */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const VALID_MODES = ["skip", "overwrite", "prompt"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function usage() {
	console.log(`Usage: install.js [options]

Installs RPI skills to ~/.agents/skills/.

Options:
  --target <path>   Override destination directory.
                    Default: ~/.agents/skills
  --mode <mode>     File conflict resolution: skip | overwrite | prompt
                    Default: skip
  --dry-run         Print planned actions without writing files.
  -h, --help        Show this message.
`);
}

async function promptYesNo(question) {
	if (!process.stdin.isTTY) {
		throw new Error(
			"Non-interactive shell; cannot prompt. Use --mode skip or --mode overwrite.",
		);
	}
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim().toLowerCase() === "y");
		});
	});
}

async function listFilesRecursive(dir) {
	const results = [];
	const entries = await fs.promises.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...(await listFilesRecursive(full)));
		} else {
			results.push(full);
		}
	}
	return results;
}

async function copyFileWithMode({ src, dest, mode, dryRun, label }) {
	const destDir = path.dirname(dest);
	const exists = fs.existsSync(dest);

	if (exists) {
		if (mode === "skip") {
			if (dryRun) console.log(`  dry-run: skip       ${label}`);
			return;
		}
		if (mode === "prompt") {
			if (dryRun) {
				console.log(`  dry-run: prompt     ${label}`);
				return;
			}
			const yes = await promptYesNo(`  Overwrite ${label}? [y/N] `);
			if (!yes) return;
		}
		if (dryRun) {
			console.log(`  dry-run: overwrite  ${label}`);
			return;
		}
	} else if (dryRun) {
		console.log(`  dry-run: create     ${label}`);
		return;
	}

	await fs.promises.mkdir(destDir, { recursive: true });
	await fs.promises.copyFile(src, dest);
	const stat = await fs.promises.stat(src);
	await fs.promises.chmod(dest, stat.mode);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	const args = process.argv.slice(2);

	let target = path.join(os.homedir(), ".agents", "skills");
	let mode = "skip";
	let dryRun = false;

	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === "--target") {
			target = path.resolve(args[i + 1]);
			i += 1;
			continue;
		}
		if (arg === "--mode") {
			mode = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--dry-run") {
			dryRun = true;
			continue;
		}
		if (arg === "-h" || arg === "--help") {
			usage();
			return;
		}
		throw new Error(`Unknown argument: ${arg}`);
	}

	if (!VALID_MODES.includes(mode)) {
		throw new Error(
			`Invalid --mode: ${mode}. Valid values: ${VALID_MODES.join(", ")}`,
		);
	}

	const kitRoot = __dirname;
	const skillsSrc = path.join(kitRoot, "skills");

	if (!fs.existsSync(skillsSrc)) {
		throw new Error(`Skills source not found: ${skillsSrc}`);
	}

	console.log(`RPI Kit — Installation${dryRun ? " (dry-run)" : ""}`);
	console.log(`  Source : ${skillsSrc}`);
	console.log(`  Target : ${target}`);
	console.log(`  Mode   : ${mode}`);
	console.log("");

	const files = (await listFilesRecursive(skillsSrc)).sort();
	let count = 0;

	for (const src of files) {
		const rel = path.relative(skillsSrc, src);
		const dest = path.join(target, rel);
		await copyFileWithMode({
			src,
			dest,
			mode,
			dryRun,
			label: rel,
		});
		count += 1;
	}

	console.log("");
	console.log(
		dryRun
			? `Dry-run complete. ${count} file(s) would be processed.`
			: `Installation complete. ${count} file(s) processed → ${target}`,
	);
}

main().catch((err) => {
	console.error(`Error: ${err.message}`);
	process.exitCode = 1;
});
