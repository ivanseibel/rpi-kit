#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const VALID_MODES = new Set(["skip", "overwrite", "prompt"]);
const ROOT_PREFIXES = [".github/", ".vscode/", ".rpi/"];

const EXCLUDED_REPO_REL_PREFIXES = [".rpi/projects/"];
const EXCLUDED_REPO_REL_EXACT = new Set([".rpi/projects"]);

function usage() {
	console.log(
		"Usage: install.js [--target <path>] [--mode <skip|overwrite|prompt>] [--config <path>] [--dry-run]",
	);
	console.log("");
	console.log("Copies the RPI kit artifacts into a target repository.");
}

function isDirectory(stat) {
	return stat?.isDirectory();
}

function ensureMode(mode, context) {
	if (!VALID_MODES.has(mode)) {
		throw new Error(`Invalid mode${context ? ` ${context}` : ""}: ${mode}`);
	}
}

function resolveLink(kitRoot, baseDir, target) {
	if (target.startsWith("/")) {
		return path.join(kitRoot, target.slice(1));
	}

	for (const prefix of ROOT_PREFIXES) {
		if (target === prefix || target.startsWith(prefix)) {
			return path.join(kitRoot, target);
		}
	}

	return path.resolve(baseDir, target);
}

function toRepoRelPosix(p) {
	return p.split(path.sep).join("/");
}

function isExcludedRepoRelPath(repoRelPath) {
	const normalized = repoRelPath
		.trim()
		.replace(/^\.\//, "")
		.replace(/^\/+/g, "");

	if (EXCLUDED_REPO_REL_EXACT.has(normalized)) {
		return true;
	}

	for (const prefix of EXCLUDED_REPO_REL_PREFIXES) {
		if (normalized.startsWith(prefix)) {
			return true;
		}
	}

	return false;
}

async function listFiles(dir, filterFn) {
	const entries = await fs.promises.readdir(dir, { withFileTypes: true });
	const results = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...(await listFiles(fullPath, filterFn)));
			continue;
		}

		if (!filterFn || filterFn(fullPath)) {
			results.push(fullPath);
		}
	}

	return results;
}

async function addDirFiles(fileSet, dir) {
	if (!fs.existsSync(dir)) {
		return;
	}
	const files = await listFiles(dir);
	for (const file of files) {
		fileSet.add(file);
	}
}

function addFile(fileSet, file) {
	if (!fs.existsSync(file)) {
		return;
	}
	const stat = fs.statSync(file);
	if (stat.isFile()) {
		fileSet.add(file);
	}
}

async function promptYesNo(question) {
	if (!process.stdin.isTTY) {
		throw new Error("Non-interactive shell; cannot prompt");
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

async function copyFileWithMode({
	src,
	rel,
	destRoot,
	mode,
	override,
	dryRun,
}) {
	const dest = path.join(destRoot, rel);
	const destDir = path.dirname(dest);
	await fs.promises.mkdir(destDir, { recursive: true });

	const effectiveMode = override || mode;
	const exists = fs.existsSync(dest);

	if (exists) {
		if (effectiveMode === "skip") {
			if (dryRun) {
				console.log(`dry-run: skip ${rel}`);
			}
			return;
		}

		if (effectiveMode === "prompt") {
			if (dryRun) {
				console.log(`dry-run: prompt ${rel}`);
				return;
			}
			const shouldOverwrite = await promptYesNo(`Overwrite ${rel}? [y/N] `);
			if (!shouldOverwrite) {
				return;
			}
		}

		if (dryRun) {
			console.log(`dry-run: overwrite ${rel}`);
			return;
		}
	} else if (dryRun) {
		console.log(`dry-run: create ${rel}`);
		return;
	}

	await fs.promises.copyFile(src, dest);
	const srcStat = await fs.promises.stat(src);
	await fs.promises.chmod(dest, srcStat.mode);
}

function extractTemplateTarget(content, templatePath) {
	const lines = content.split(/\r?\n/);
	if (lines.length === 0 || lines[0] !== "---") {
		throw new Error(`Template missing frontmatter: ${templatePath}`);
	}

	let target = "";
	let i = 1;
	for (; i < lines.length; i += 1) {
		const line = lines[i];
		if (line === "---") {
			break;
		}
		if (line.startsWith("target:")) {
			target = line.slice("target:".length).trim();
		}
	}

	if (i >= lines.length) {
		throw new Error(`Template frontmatter not closed: ${templatePath}`);
	}

	if (!target) {
		throw new Error(`Template missing target: ${templatePath}`);
	}

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
		if (inRpi) {
			output.push(line);
		}
	}

	return `${output.join("\n")}\n`;
}

async function writeTemplate({
	content,
	rel,
	destRoot,
	mode,
	override,
	dryRun,
}) {
	const dest = path.join(destRoot, rel);
	const destDir = path.dirname(dest);
	await fs.promises.mkdir(destDir, { recursive: true });

	const effectiveMode = override || mode;
	const exists = fs.existsSync(dest);

	if (exists) {
		if (effectiveMode === "skip") {
			if (dryRun) {
				console.log(`dry-run: skip ${rel}`);
			}
			return;
		}

		if (effectiveMode === "prompt") {
			if (dryRun) {
				console.log(`dry-run: prompt ${rel}`);
				return;
			}
			const shouldOverwrite = await promptYesNo(
				`Overwrite ${rel} from template? [y/N] `,
			);
			if (!shouldOverwrite) {
				return;
			}
		}

		if (dryRun) {
			console.log(`dry-run: overwrite ${rel}`);
			return;
		}
	} else if (dryRun) {
		console.log(`dry-run: create ${rel}`);
		return;
	}

	await fs.promises.writeFile(dest, content, "utf8");
}

async function main() {
	const args = process.argv.slice(2);
	let mode = "skip";
	let modeSet = false;
	let target = ".";
	let config = "";
	let dryRun = false;

	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === "--target") {
			target = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--mode") {
			mode = args[i + 1];
			modeSet = true;
			i += 1;
			continue;
		}
		if (arg === "--config") {
			config = args[i + 1];
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

	ensureMode(mode, "before config");

	const kitRoot = path.resolve(__dirname);
	const targetRoot = path.resolve(target);

	if (!fs.existsSync(targetRoot) || !isDirectory(fs.statSync(targetRoot))) {
		throw new Error(`Target directory does not exist: ${targetRoot}`);
	}

	if (!fs.existsSync(path.join(kitRoot, ".github"))) {
		throw new Error("Kit is missing .github; run from kit root.");
	}

	const fileOverrides = new Map();

	if (config) {
		if (!fs.existsSync(config)) {
			throw new Error(`Config file not found: ${config}`);
		}

		const raw = fs.readFileSync(config, "utf8");
		const lines = raw.split(/\r?\n/);

		for (const rawLine of lines) {
			const stripped = rawLine.split("#")[0].trim();
			if (!stripped) {
				continue;
			}

			if (stripped.startsWith("default=")) {
				if (!modeSet) {
					mode = stripped.slice("default=".length).trim();
				}
				continue;
			}

			if (stripped.startsWith("file:")) {
				const entry = stripped.slice("file:".length);
				const splitIndex = entry.indexOf("=");
				if (splitIndex === -1) {
					throw new Error(`Invalid config entry: ${rawLine}`);
				}
				const filePath = entry.slice(0, splitIndex).trim();
				const value = entry.slice(splitIndex + 1).trim();
				ensureMode(value, "in config override");
				fileOverrides.set(filePath, value);
				continue;
			}

			throw new Error(`Unknown config line: ${rawLine}`);
		}
	}

	ensureMode(mode, "after config");

	const fileSet = new Set();
	const templateTargets = new Set();

	const includeRoots = [
		path.join(kitRoot, ".github"),
		path.join(kitRoot, ".vscode"),
		path.join(kitRoot, ".rpi"),
	];

	for (const item of includeRoots) {
		if (fs.existsSync(item) && isDirectory(fs.statSync(item))) {
			await addDirFiles(fileSet, item);
			continue;
		}
		addFile(fileSet, item);
	}

	const scanDirs = [
		path.join(kitRoot, ".github/instructions"),
		path.join(kitRoot, ".github/skills"),
	];

	for (const scanDir of scanDirs) {
		if (!fs.existsSync(scanDir) || !isDirectory(fs.statSync(scanDir))) {
			continue;
		}

		const markdownFiles = await listFiles(scanDir, (file) =>
			file.endsWith(".md"),
		);
		for (const file of markdownFiles) {
			const content = await fs.promises.readFile(file, "utf8");
			const linkRegex = /\]\(([^)]+)\)/g;
			let match = null;
			while (true) {
				match = linkRegex.exec(content);
				if (match === null) break;
				const rawTarget = match[1];
				let targetPath = rawTarget.split("#")[0].split("?")[0];
				targetPath = targetPath.trim();
				if (!targetPath) {
					continue;
				}
				if (/^(https?:\/\/|mailto:)/i.test(targetPath)) {
					continue;
				}

				const resolved = resolveLink(kitRoot, path.dirname(file), targetPath);
				if (!fs.existsSync(resolved)) {
					continue;
				}
				const stat = fs.statSync(resolved);
				if (stat.isDirectory()) {
					await addDirFiles(fileSet, resolved);
				} else if (stat.isFile()) {
					fileSet.add(resolved);
				}
			}
		}
	}

	const templateDir = path.join(kitRoot, "templates");
	if (fs.existsSync(templateDir) && isDirectory(fs.statSync(templateDir))) {
		const templateFiles = await listFiles(templateDir, (file) =>
			file.endsWith(".rpi-template.md"),
		);
		templateFiles.sort();

		for (const template of templateFiles) {
			const content = await fs.promises.readFile(template, "utf8");
			const targetPath = extractTemplateTarget(content, template);

			if (isExcludedRepoRelPath(targetPath)) {
				continue;
			}

			templateTargets.add(targetPath);

			const rpiContent = extractRpiSection(content);
			const override = fileOverrides.get(targetPath);
			await writeTemplate({
				content: rpiContent,
				rel: targetPath,
				destRoot: targetRoot,
				mode,
				override,
				dryRun,
			});
		}
	}

	const files = Array.from(fileSet).sort();
	for (const src of files) {
		const rel = path.relative(kitRoot, src);
		const relPosix = toRepoRelPosix(rel);
		if (isExcludedRepoRelPath(relPosix)) {
			continue;
		}
		if (rel.startsWith(".github/workflows/")) {
			continue;
		}
		if (templateTargets.has(rel)) {
			continue;
		}

		const override = fileOverrides.get(rel);
		await copyFileWithMode({
			src,
			rel,
			destRoot: targetRoot,
			mode,
			override,
			dryRun,
		});
	}

	if (dryRun) {
		console.log(`RPI kit dry-run complete: ${targetRoot}`);
	} else {
		console.log(`RPI kit installation complete: ${targetRoot}`);
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
