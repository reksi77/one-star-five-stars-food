import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One-star review of Earth from an alien tourist, food compliment included.
// 197 characters, one sentence, no trailing newline.
const ENTRY =
  "Earth gets one star because the birds scream at five in the morning, " +
  "the rain soaks my third set of tentacles, and the only reason I would " +
  "come back is the woman selling grilled corn on the corner.";

// Runtime gate: the sealed scorer only accepts UTF-8 text of 1-200
// characters, not whitespace-only, as one sentence. Fail loudly instead
// of writing an entry the gate would reject.
function gate(text: string): string | null {
  if (text.length < 1 || text.length > 200)
    return `length ${text.length} outside 1-200`;
  if (text.trim().length === 0) return "whitespace-only";
  if (!/^[\x00-\x7F]*$/.test(text)) return "non-ASCII character present";
  const enders = text.match(/[.!?]/g) ?? [];
  if (enders.length !== 1 || !text.endsWith("."))
    return `expected exactly one terminal period, found ${enders.length} sentence enders`;
  if (text.endsWith("\n")) return "trailing newline";
  return null;
}

const problem = gate(ENTRY);
if (problem) {
  console.error(`entry failed gate: ${problem}`);
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Round-trip check: what landed on disk must match the entry byte for byte.
const onDisk = readFileSync("/output/entry.txt", "utf8");
if (onDisk !== ENTRY) {
  console.error("entry on disk does not match the entry in memory");
  process.exit(1);
}
console.log(`wrote ${ENTRY.length} characters to /output/entry.txt`);
