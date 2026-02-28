#!/usr/bin/env node
/**
 * rpi-kit project installer
 *
 * Installs the minimal RPI footprint into a target repository so agents
 * can operate the RPI workflow in that project.
 *
 * What gets installed (always):
 *   .rpi/AGENTS.md         — Governance: roles, handoff rules, recursion protocol
 *   .rpi/projects/.gitkeep — Placeholder so the directory is tracked by git
 *
 * What gets installed with --copilot:
 *   .github/copilot-instructions.md  — RPI constitution (from template)
 *   .vscode/settings.json            — Enables VS Code instruction files (skip if exists)
 *
 * Skills are NOT installed here — they live at the user level.
 * Run  node rpi-kit-user/install.js  once to set those up.
 *
 * Usage:
 *   node install.js --target <path> [--copilot] [--mode <mode>] [--dry-run]
 *
 * Options:
 *   --target <path>   Target repository root. Default: current directory (.)
 *   --copilot         Also install GitHub Copilot artifacts (.github/, .vscode/)
 *   --mode <mode>     File conflict resolution: skip | overwrite | prompt
 *                     Default: skip
 *   --dry-run         Print planned actions without writing files.
 *   -h, --help        Show this message.
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const VALID_MODES = ["skip", "overwrite", "prompt"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function usage() {
	console.log(`Usage: install.js [--target <path>] [--copilot] [--mode <mode>] [--dry-run]

Installs the minimal RPI workflow footprint into a target repository.

Options:
  --target <path>   Target repository root. Default: .
  --copilot         Also install GitHub Copilot artifacts.
  --mode <mode>     File conflict resolution: skip | overwrite | prompt
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

async function copyFileWithMode({ src, dest, mode, dryRun, label }) {
	const exists = fs.existsSync(dest);

	if (exists) {
		if (mode === "skip") {
			if (dryRun) console.log(`  dry-run: skip  ${label}`);
			return;
		}
		if (mode === "prompt") {
			if (dryRun) {
				console.log(`  dry-run: prompt  ${label}`);
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
		console.log(`  dry-run: create  ${label}`);
		return;
	}

	await fs.promises.mkdir(path.dirname(dest), { recursive: true });
	await fs.promises.copyFile(src, dest);
	const stat = await fs.promises.stat(src);
	await fs.promises.chmod(dest, stat.mode);
}

async function writeContentWithMode({ content, dest, mode, dryRun, label }) {
	const exists = fs.existsSync(dest);

	if (exists) {
		if (mode === "skip") {
			if (dryRun) console.log(`  dry-run: skip  ${label}`);
			return;
		}
		if (mode === "prompt") {
			if (dryRun) {
				console.log(`  dry-run: prompt  ${label}`);
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
		console.log(`  dry-run: create  ${label}`);
		return;
	}

	await fs.promises.mkdir(path.dirname(dest), { recursive: true });
	await fs.promises.writeFile(dest, content, "utf8");
}

// ---------------------------------------------------------------------------
// Template processing (same logic as legacy installers)
// ---------------------------------------------------------------------------
function extractTemplateTarget(content, templatePath) {
	const lines = content.split(/\r?\n/);
	if (!lines.length || lines[0] !== "---") {
		throw new Error(`Template missing frontmatter: ${templatePath}`);
	}
	let target = "";
	let i = 1;
	for (; i < lines.length; i += 1) {
		if (lines[i] === "---") break;
		if (lines[i].startsWith("target:")) {
			target = lines[i].slice("target:".length).trim();
		}
	}
	if (i >= lines.length)
		throw new Error(`Template frontmatter not closed: ${templatePath}`);
	if (!target) throw new Error(`Template missing target: ${templatePath}`);
	return target;
}

function extractRpiSection(content) {
	const lines = content.split(/\r?\n/);
	const output = [];
	let inRpi = false;
	for (const line of lines) {
		if (line.includes("<!-- RPI:START -->")) {
			inRpi = true;
			continue;
		}
		if (line.includes("<!-- RPI:END -->")) {
			inRpi = false;
			continue;
		}
		if (inRpi) output.push(line);
	}
	return `${output.join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	const args = process.argv.slice(2);

	let target = ".";
	let copilot = false;
	let mode = "skip";
	let dryRun = false;

	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === "--target") {
			target = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--copilot") {
			copilot = true;
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
			`Invalid --mode: ${mode}. Valid: ${VALID_MODES.join(", ")}`,
		);
	}

	const kitRoot = path.resolve(path.join(__dirname, ".."));
	const targetRoot = path.resolve(target);

	if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
		throw new Error(`Target directory does not exist: ${targetRoot}`);
	}

	console.log(`RPI Kit — Project installation${dryRun ? " (dry-run)" : ""}`);
	console.log(`  Kit root : ${kitRoot}`);
	console.log(`  Target   : ${targetRoot}`);
	console.log(`  Mode     : ${mode}`);
	console.log(`  Copilot  : ${copilot ? "yes" : "no"}`);
	console.log("");

	// ── Core artifacts (always) ─────────────────────────────────────────────
	console.log("── Core ─────────────────────────────────────────────");

	// .rpi/AGENTS.md
	const agentsMdSrc = path.join(__dirname, ".rpi", "AGENTS.md");
	const agentsMdDest = path.join(targetRoot, ".rpi", "AGENTS.md");
	await copyFileWithMode({
		src: agentsMdSrc,
		dest: agentsMdDest,
		mode,
		dryRun,
		label: ".rpi/AGENTS.md",
	});

	// .rpi/projects/.gitkeep
	const gitkeepDest = path.join(targetRoot, ".rpi", "projects", ".gitkeep");
	if (!fs.existsSync(gitkeepDest)) {
		if (dryRun) {
			console.log("  dry-run: create  .rpi/projects/.gitkeep");
		} else {
			await fs.promises.mkdir(path.dirname(gitkeepDest), { recursive: true });
			await fs.promises.writeFile(gitkeepDest, "", "utf8");
			console.log("  Created  .rpi/projects/.gitkeep");
		}
	}
	console.log("");

	// ── Copilot artifacts (--copilot) ───────────────────────────────────────
	if (copilot) {
		console.log("── Copilot ──────────────────────────────────────────");

		// .github/copilot-instructions.md (from template)
		const templateSrc = path.join(
			kitRoot,
			"rpi-kit-copilot",
			"templates",
			"copilot-instructions.rpi-template.md",
		);
		if (fs.existsSync(templateSrc)) {
			const tplContent = await fs.promises.readFile(templateSrc, "utf8");
			const tplTarget = extractTemplateTarget(tplContent, templateSrc);
			const rpiContent = extractRpiSection(tplContent);
			const tplDest = path.join(targetRoot, tplTarget);
			await writeContentWithMode({
				content: rpiContent,
				dest: tplDest,
				mode,
				dryRun,
				label: tplTarget,
			});
		} else {
			console.warn(
				`  [warn] Copilot instructions template not found: ${templateSrc}`,
			);
		}

		// .vscode/settings.json — only create if missing; never overwrite
		const vscodeSrc = path.join(
			kitRoot,
			"rpi-kit-copilot",
			".vscode",
			"settings.json",
		);
		const vscodeDest = path.join(targetRoot, ".vscode", "settings.json");
		if (!fs.existsSync(vscodeDest)) {
			await copyFileWithMode({
				src: vscodeSrc,
				dest: vscodeDest,
				mode: "overwrite", // safe: file doesn't exist
				dryRun,
				label: ".vscode/settings.json",
			});
		} else {
			console.log("  Skipped  .vscode/settings.json (already exists)");
		}

		console.log("");
	}

	console.log(dryRun ? "Dry-run complete." : "Installation complete.");

	if (!dryRun) {
		console.log("");
		console.log("Next steps:");
		console.log(
			"  1. Run  node rpi-kit-user/install.js  to install skills user-wide (once).",
		);
		console.log(
			"  2. Use  bash .rpi/scripts -> rpi-new.sh  or the rpi-workflow skill to start.",
		);
		if (copilot) {
			console.log(
				"  3. Open VS Code and run 'Copilot Chat: Show Customization Diagnostics'",
			);
			console.log("     to verify the RPI instructions and skills are loaded.");
		}
	}
}

main().catch((err) => {
	console.error(`Error: ${err.message}`);
	process.exitCode = 1;
});
