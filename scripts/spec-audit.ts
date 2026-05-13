#!/usr/bin/env tsx
/**
 * Spec Audit — verifica gap entre o que está especificado nos Epics e o que está
 * efetivamente entregue como artefatos de implementação BMAD.
 *
 * Critério: para cada Story X.Y identificada em `_bmad-output/planning-artifacts/epics.md`,
 * é obrigatório existir:
 *   - `_bmad-output/implementation-artifacts/story-epic-X.Y-*.md` (story file), E
 *   - `_bmad-output/implementation-artifacts/cr-epic-X.Y-*.md` (code review)
 *
 * Stories sem story file → ❌ NÃO IMPLEMENTADAS (falsamente reportadas como done).
 * Stories com story file mas sem CR → ⚠️ EM ANDAMENTO.
 * Stories com ambos → ✅ DONE.
 *
 * Modos:
 *   default       → report-only, exit 0 (uso humano dia-a-dia)
 *   --strict      → exit 1 se houver gap (uso em CI)
 *   --debt        → exit 1 apenas em Stories fora da allowlist `.bmad-debt.json`
 *
 * Allowlist: `.bmad-debt.json` na raiz lista stories conhecidas como brownfield
 * (código já existe, falta apenas o retrofit dos artifacts). Stories NOVAS adicionadas
 * em epics.md mas não na allowlist quebram o commit em modo --debt.
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const EPICS_PATH = join(ROOT, "_bmad-output/planning-artifacts/epics.md");
const ARTIFACTS_DIR = join(ROOT, "_bmad-output/implementation-artifacts");
const DEBT_PATH = join(ROOT, ".bmad-debt.json");

const MODE = process.argv.includes("--strict")
  ? "strict"
  : process.argv.includes("--debt")
  ? "debt"
  : "report";

interface SpecStory {
  epicNum: number;
  storyNum: number;
  storyId: string; // "8.1"
  title: string;
  acCount: number; // approx count of "**And**" / "**Then**"
  line: number;
}

interface ImplArtifact {
  filename: string;
  storyId: string | null; // matched if filename has -epic-N.M-
}

function parseEpics(): SpecStory[] {
  const content = readFileSync(EPICS_PATH, "utf-8");
  const lines = content.split("\n");
  const stories: SpecStory[] = [];

  let currentEpic = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const epicMatch = line.match(/^## Epic (\d+):/);
    if (epicMatch) {
      currentEpic = Number(epicMatch[1]);
      continue;
    }

    const storyMatch = line.match(/^### Story (\d+)\.(\d+):\s*(.+)$/);
    if (storyMatch && currentEpic > 0) {
      const epicNum = Number(storyMatch[1]);
      const storyNum = Number(storyMatch[2]);
      const title = storyMatch[3].trim();

      // Count ACs by scanning until next "###" or "##"
      let acCount = 0;
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j];
        if (/^##/.test(next)) break;
        if (/\*\*And\*\*|\*\*Then\*\*/.test(next)) acCount++;
      }

      stories.push({
        epicNum,
        storyNum,
        storyId: `${epicNum}.${storyNum}`,
        title,
        acCount,
        line: i + 1,
      });
    }
  }

  return stories;
}

function parseArtifacts(): ImplArtifact[] {
  let files: string[];
  try {
    files = readdirSync(ARTIFACTS_DIR);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const m = filename.match(/(?:story|cr)-epic-(\d+)\.(\d+[a-z]?)/);
      const storyId = m ? `${m[1]}.${m[2].replace(/[a-z]$/, "")}` : null;
      return { filename, storyId };
    });
}

function colorize(text: string, color: "red" | "yellow" | "green" | "dim" | "bold"): string {
  if (!process.stdout.isTTY) return text;
  const codes = { red: 31, yellow: 33, green: 32, dim: 2, bold: 1 };
  return `\x1b[${codes[color]}m${text}\x1b[0m`;
}

function loadDebt(): Set<string> {
  if (!existsSync(DEBT_PATH)) return new Set();
  try {
    const raw = readFileSync(DEBT_PATH, "utf-8");
    const data = JSON.parse(raw) as { allowed: string[] };
    return new Set(data.allowed ?? []);
  } catch {
    return new Set();
  }
}

function audit() {
  const specStories = parseEpics();
  const artifacts = parseArtifacts();
  const debtAllowlist = loadDebt();

  const grouped = new Map<string, SpecStory[]>();
  for (const s of specStories) {
    const key = `Epic ${s.epicNum}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(s);
  }

  let totalSpec = 0;
  let totalDone = 0;
  let totalInProgress = 0;
  let totalMissing = 0;
  const missingStories: SpecStory[] = [];

  console.log(colorize("\n━━━ BMAD Spec Audit ━━━\n", "bold"));
  console.log(`Epics file: ${EPICS_PATH}`);
  console.log(`Artifacts dir: ${ARTIFACTS_DIR}\n`);

  for (const [epic, stories] of grouped) {
    console.log(colorize(epic, "bold"));
    for (const s of stories) {
      totalSpec++;

      const storyFile = artifacts.find(
        (a) => a.filename.startsWith(`story-epic-${s.storyId}`) || a.filename.includes(`epic-${s.storyId}-`),
      );
      const crFile = artifacts.find(
        (a) => a.filename.startsWith(`cr-epic-${s.storyId}`) || a.filename.includes(`epic-${s.storyId}-cr`),
      );

      let status: string;
      let mark: string;
      if (storyFile && crFile) {
        status = "DONE";
        mark = colorize("✅", "green");
        totalDone++;
      } else if (storyFile) {
        status = "IN PROGRESS (story file ok, sem CR)";
        mark = colorize("⚠️ ", "yellow");
        totalInProgress++;
      } else {
        status = "MISSING (sem story file — não foi implementada via pipeline)";
        mark = colorize("❌", "red");
        totalMissing++;
        missingStories.push(s);
      }

      const acInfo = s.acCount > 0 ? colorize(`(${s.acCount} ACs)`, "dim") : "";
      console.log(`  ${mark}  Story ${s.storyId} — ${s.title} ${acInfo}`);
      if (status !== "DONE") {
        console.log(colorize(`         ${status}`, "dim"));
      }
    }
    console.log();
  }

  console.log(colorize("━━━ Resumo ━━━", "bold"));
  console.log(`Total Stories no spec:  ${totalSpec}`);
  console.log(colorize(`✅ Done (story + CR):    ${totalDone}`, "green"));
  console.log(colorize(`⚠️  In progress:          ${totalInProgress}`, "yellow"));
  console.log(colorize(`❌ Missing (gap):         ${totalMissing}`, "red"));
  console.log();

  const completionRate = totalSpec > 0 ? Math.round((totalDone / totalSpec) * 100) : 0;
  console.log(`Conformidade BMAD: ${completionRate}% (${totalDone}/${totalSpec})`);

  if (missingStories.length === 0) {
    console.log(colorize("✓ Auditoria passou — zero Stories em débito.", "green"));
    process.exit(0);
  }

  // Classify missing stories: known debt vs new violations
  const knownDebt: SpecStory[] = [];
  const newViolations: SpecStory[] = [];
  for (const s of missingStories) {
    if (debtAllowlist.has(s.storyId)) knownDebt.push(s);
    else newViolations.push(s);
  }

  console.log();
  if (knownDebt.length > 0) {
    console.log(colorize(`Débito conhecido (em .bmad-debt.json — ${knownDebt.length} stories):`, "yellow"));
    for (const s of knownDebt) console.log(colorize(`  • Story ${s.storyId} — ${s.title}`, "dim"));
    console.log();
  }
  if (newViolations.length > 0) {
    console.log(colorize(`VIOLAÇÕES NOVAS (não autorizadas em .bmad-debt.json — ${newViolations.length} stories):`, "red"));
    for (const s of newViolations) console.log(colorize(`  • Story ${s.storyId} — ${s.title}`, "red"));
    console.log();
    console.log(colorize("Toda Story nova em epics.md exige story file em _bmad-output/implementation-artifacts/.", "red"));
    console.log(colorize("Se for brownfield (código já existe), adicione o storyId em .bmad-debt.json.", "dim"));
  }

  if (MODE === "strict") {
    console.log(colorize("\n[--strict] Exit 1: existem stories em débito.", "red"));
    process.exit(1);
  }
  if (MODE === "debt" && newViolations.length > 0) {
    console.log(colorize("\n[--debt] Exit 1: violações novas detectadas.", "red"));
    process.exit(1);
  }
  console.log(colorize("\n(modo report — exit 0; use --debt em pre-commit ou --strict em CI)", "dim"));
  process.exit(0);
}

audit();
