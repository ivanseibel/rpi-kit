#!/usr/bin/env node
/**
 * rpi-kit user-level installer
 *
 * Installs RPI skills, prompts, and instructions to the current user's
 * home directory so every project can reference them without any per-repo
 * setup.
 *
 * What gets installed:
 *   - Skills (skills/*) → ~/.copilot/skills/, ~/.agents/skills/, ~/.claude/skills/
 *   - VS Code user prompts (.github/prompts/rpikit.*.prompt.md) → {vscode-user}/prompts/
 *   - VS Code user instructions (.github/instructions/) → {vscode-user}/instructions/
 *   - VS Code user settings → merges "github.copilot.chat.codeGeneration.useInstructionFiles": true
 *
 * Usage:
 *   node install.js [options]
 *
 * Options:
 *   --agents <list>     Comma-separated agent IDs to install skills for.
 *                       Supported: copilot, codex, claude
 *                       Default: copilot,codex,claude
 *   --no-vscode         Skip VS Code settings, prompts, and instructions.
 *   --mode <mode>       Default file conflict resolution: skip | overwrite | prompt
 *                       Default: skip
 *   --dry-run           Print planned actions without writing any files.
 *   -h, --help          Show this message.
 */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const VALID_MODES = ["skip", "overwrite", "prompt"];

// ---------------------------------------------------------------------------
// Agent → user-level skills directory
// ---------------------------------------------------------------------------
function agentSkillsDir(agentId) {
	const home = os.homedir();
	switch (agentId) {
		case "copilot":
			return path.join(home, ".copilot", "skills");
		case "codex":
			return path.join(home, ".agents", "skills");
		case "claude":
			return path.join(home, ".claude", "skills");
		default:
			throw new Error(`Unknown agent ID: ${agentId}`);
	}
}

// ---------------------------------------------------------------------------
// VS Code user-data directory (platform-specific)
// ---------------------------------------------------------------------------
function vscodeUserDir() {
	const home = os.homedir();
	switch (process.platform) {
		case "darwin":
			return path.join(home, "Library", "Application Support", "Code", "User");
		case "win32":
			return path.join(
				process.env.APPDATA || path.join(home, "AppData", "Roaming"),
				"Code",
				"User",
			);
		default:
			// Linux and others
			return process.env.XDG_CONFIG_HOME
				? path.join(process.env.XDG_CONFIG_HOME, "Code", "User")
				: path.join(home, ".config", "Code", "User");
	}
}

// ---------------------------------------------------------------------------
// VS Code profile directories (each named profile gets its own prompts/
// instructions/ and settings.json that live under {vsCodeUser}/profiles/<id>/)
// ---------------------------------------------------------------------------
function vscodeProfileDirs(vsCodeUser) {
	const profilesRoot = path.join(vsCodeUser, "profiles");
	if (!fs.existsSync(profilesRoot)) return [];
	return fs
		.readdirSync(profilesRoot, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => path.join(profilesRoot, d.name));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function usage() {
	console.log(`Usage: install.js [options]

Installs RPI kit artifacts to user-level directories.

Options:
  --agents <list>     Comma-separated agent IDs: copilot,codex,claude
                      Default: copilot,codex,claude
  --no-vscode         Skip VS Code settings, prompts, and instructions.
  --mode <mode>       File conflict resolution: skip | overwrite | prompt
                      Default: skip
  --dry-run           Print planned actions without writing files.
  -h, --help          Show this message.
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

async function writeFileWithMode({ src, dest, mode, dryRun, label }) {
	const destDir = path.dirname(dest);
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

	await fs.promises.mkdir(destDir, { recursive: true });
	await fs.promises.copyFile(src, dest);
	const stat = await fs.promises.stat(src);
	await fs.promises.chmod(dest, stat.mode);
}

// ---------------------------------------------------------------------------
// Install skills for one agent
// ---------------------------------------------------------------------------
async function installSkillsForAgent({ agentId, skillsSrc, mode, dryRun }) {
	const destRoot = agentSkillsDir(agentId);
	const agentLabel = agentId.padEnd(7);

	if (!fs.existsSync(skillsSrc)) {
		console.warn(`  [warn] skills source not found: ${skillsSrc}`);
		return;
	}

	const files = await listFilesRecursive(skillsSrc);
	for (const src of files.sort()) {
		const rel = path.relative(skillsSrc, src);
		const dest = path.join(destRoot, rel);
		await writeFileWithMode({
			src,
			dest,
			mode,
			dryRun,
			label: `[${agentLabel}] ${rel}`,
		});
	}

	if (!dryRun) {
		console.log(`  Skills installed → ${destRoot}`);
	}
}

// ---------------------------------------------------------------------------
// Merge VS Code user settings.json
//
// Strategy: text-level injection rather than full JSON parse/serialize.
// VS Code settings.json is JSONC (allows comments and trailing commas),
// so a strict JSON.parse can fail. Instead we:
//   1. Check whether the key already appears verbatim in the file.
//   2. If not, find the last closing `}` of the root object and insert the
//      missing entries just before it, with a trailing comma guard.
// ---------------------------------------------------------------------------
const VSCODE_SETTINGS_TO_MERGE = {
	"github.copilot.chat.codeGeneration.useInstructionFiles": true,
	"chat.promptFiles": true,
};

/**
 * Returns true if `content` already contains `key` set to `value`
 * (loose check: looks for the key string followed by : and the value).
 */
function settingAlreadyPresent(content, key, value) {
	// Match: "key" followed by optional whitespace/colon then the value
	const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const escapedValue = JSON.stringify(value).replace(
		/[.*+?^${}()|[\]\\]/g,
		"\\$&",
	);
	const re = new RegExp(`"${escapedKey}"\\s*:\\s*${escapedValue}`);
	return re.test(content);
}

async function mergeVSCodeSettings({ settingsPath, dryRun }) {
	let raw = "{}";

	if (fs.existsSync(settingsPath)) {
		raw = await fs.promises.readFile(settingsPath, "utf8");
	}

	// Determine which entries are missing
	const toAdd = Object.entries(VSCODE_SETTINGS_TO_MERGE).filter(
		([k, v]) => !settingAlreadyPresent(raw, k, v),
	);

	if (toAdd.length === 0) {
		if (dryRun) {
			console.log("  dry-run: VS Code settings already up-to-date");
		}
		return;
	}

	for (const [k, v] of toAdd) {
		if (dryRun) {
			console.log(
				`  dry-run: inject  "${k}": ${JSON.stringify(v)}  → ${settingsPath}`,
			);
		}
	}

	if (dryRun) return;

	// Build the injection snippet
	const snippet = toAdd
		.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
		.join(",\n");

	// Find the last `}` in the file (root object close) and insert before it
	const lastBrace = raw.lastIndexOf("}");
	if (lastBrace === -1) {
		// File is empty or malformed — write a minimal object
		const minimal = `{\n${snippet}\n}\n`;
		await fs.promises.mkdir(path.dirname(settingsPath), { recursive: true });
		await fs.promises.writeFile(settingsPath, minimal, "utf8");
		console.log(`  VS Code settings created → ${settingsPath}`);
		return;
	}

	// Check if we need an extra comma (if the content before the brace ends
	// with a real value rather than opening brace / only whitespace)
	const before = raw.slice(0, lastBrace).trimEnd();
	const needsComma = before.length > 1 && !before.endsWith("{");

	const merged =
		raw.slice(0, lastBrace) +
		(needsComma ? ",\n" : "") +
		snippet +
		"\n" +
		raw.slice(lastBrace);

	await fs.promises.mkdir(path.dirname(settingsPath), { recursive: true });
	await fs.promises.writeFile(settingsPath, merged, "utf8");
	console.log(`  VS Code settings merged → ${settingsPath}`);
}

// ---------------------------------------------------------------------------
// Install VS Code user prompts (rpikit.*.prompt.md)
// ---------------------------------------------------------------------------
async function installVSCodePrompts({ promptsSrc, promptsDest, mode, dryRun }) {
	if (!fs.existsSync(promptsSrc)) {
		console.warn(`  [warn] prompts source not found: ${promptsSrc}`);
		return;
	}

	const files = (await listFilesRecursive(promptsSrc)).filter(
		(f) =>
			path.basename(f).match(/^rpikit\..*\.prompt\.md$/) ||
			path.basename(f) === "USAGE.md",
	);

	for (const src of files.sort()) {
		const dest = path.join(promptsDest, path.basename(src));
		await writeFileWithMode({
			src,
			dest,
			mode,
			dryRun,
			label: `[vscode/prompts] ${path.basename(src)}`,
		});
	}

	if (!dryRun && files.length > 0) {
		console.log(`  VS Code prompts installed → ${promptsDest}`);
	}
}

// ---------------------------------------------------------------------------
// Install VS Code user instructions (*.instructions.md)
// ---------------------------------------------------------------------------
async function installVSCodeInstructions({
	instructionsSrc,
	instructionsDest,
	mode,
	dryRun,
}) {
	if (!fs.existsSync(instructionsSrc)) {
		console.warn(`  [warn] instructions source not found: ${instructionsSrc}`);
		return;
	}

	const files = (await listFilesRecursive(instructionsSrc)).filter((f) =>
		f.endsWith(".instructions.md"),
	);

	for (const src of files.sort()) {
		const dest = path.join(instructionsDest, path.basename(src));
		await writeFileWithMode({
			src,
			dest,
			mode,
			dryRun,
			label: `[vscode/instructions] ${path.basename(src)}`,
		});
	}

	if (!dryRun && files.length > 0) {
		console.log(`  VS Code instructions installed → ${instructionsDest}`);
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	const args = process.argv.slice(2);

	let agents = ["copilot", "codex", "claude"];
	let skipVSCode = false;
	let mode = "skip";
	let dryRun = false;

	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === "--agents") {
			agents = args[i + 1]
				.split(",")
				.map((a) => a.trim())
				.filter(Boolean);
			i += 1;
			continue;
		}
		if (arg === "--no-vscode") {
			skipVSCode = true;
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

	const kitRoot = path.resolve(path.join(__dirname, ".."));
	const skillsSrc = path.join(kitRoot, "skills");
	const promptsSrc = path.join(
		kitRoot,
		"rpi-kit-copilot",
		".github",
		"prompts",
	);
	const instructionsSrc = path.join(
		kitRoot,
		"rpi-kit-copilot",
		".github",
		"instructions",
	);
	const vsCodeUser = vscodeUserDir();

	console.log(`RPI Kit — User-level installation${dryRun ? " (dry-run)" : ""}`);
	console.log(`  Kit root   : ${kitRoot}`);
	console.log(`  Agents     : ${agents.join(", ")}`);
	console.log(`  Mode       : ${mode}`);
	if (!skipVSCode) {
		console.log(`  VS Code    : ${vsCodeUser}`);
	}
	console.log("");

	// 1. Skills for each agent
	console.log("── Skills ──────────────────────────────────────────");
	for (const agentId of agents) {
		console.log(`  Agent: ${agentId}`);
		await installSkillsForAgent({ agentId, skillsSrc, mode, dryRun });
	}
	console.log("");

	if (!skipVSCode) {
		// Collect all dirs to install VS Code artifacts into:
		// default user dir + each custom profile dir
		const profileDirs = vscodeProfileDirs(vsCodeUser);
		const vscodeDirs = [vsCodeUser, ...profileDirs];

		// 2. VS Code settings (default dir + each profile)
		console.log("── VS Code settings ─────────────────────────────────");
		for (const dir of vscodeDirs) {
			const settingsPath = path.join(dir, "settings.json");
			// Only merge into a profile's settings.json if it already exists
			// (absent settings.json means the profile inherits defaults)
			if (dir === vsCodeUser || fs.existsSync(settingsPath)) {
				await mergeVSCodeSettings({ settingsPath, dryRun });
			}
		}
		console.log("");

		// 3. VS Code user prompts (default dir + each profile)
		console.log("── VS Code prompts ──────────────────────────────────");
		for (const dir of vscodeDirs) {
			const promptsDest = path.join(dir, "prompts");
			await installVSCodePrompts({ promptsSrc, promptsDest, mode, dryRun });
		}
		console.log("");

		// 4. VS Code user instructions (default dir + each profile)
		console.log("── VS Code instructions ─────────────────────────────");
		for (const dir of vscodeDirs) {
			const instructionsDest = path.join(dir, "instructions");
			await installVSCodeInstructions({
				instructionsSrc,
				instructionsDest,
				mode,
				dryRun,
			});
		}
		console.log("");
	}

	console.log(dryRun ? "Dry-run complete." : "Installation complete.");
}

main().catch((err) => {
	console.error(`Error: ${err.message}`);
	process.exitCode = 1;
});
