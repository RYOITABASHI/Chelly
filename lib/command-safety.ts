export type SafetyLevel = "SAFE" | "WRITE" | "DESTRUCTIVE" | "BLOCKED";

const BLOCKLIST = [
  /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?(-[a-zA-Z]*r[a-zA-Z]*\s+)?\//,
  /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?(-[a-zA-Z]*r[a-zA-Z]*\s+)?~/,
  /\bdd\s+if=/,
  /\bcurl\s.*\|\s*(sh|bash)/,
  /\bwget\s.*\|\s*(sh|bash)/,
  /\b(cat|printenv|env)\b.*(API_KEY|TOKEN|SECRET|PASSWORD|AUTH)/i,
  /\b(chmod|chown)\s+.*(\.ssh|\.config|\.credentials|auth\.json|token|key)/i,
  /\b(git\s+push|gh\s+auth|gh\s+secret|npm\s+publish)\b/,
  /\/sdcard\/Download\/.*(credential|token|secret|auth|key)/i,
];

const DESTRUCTIVE_PATTERNS = [
  /\brm\b/, /\brmdir\b/, /\bchmod\b/, /\bchown\b/,
  /\bkill\b/, /\bkillall\b/, /\bmkfs\b/, /\bformat\b/,
];

export function classifyCommand(cmd: string): SafetyLevel {
  const trimmed = cmd.trim();
  if (BLOCKLIST.some((p) => p.test(trimmed))) return "BLOCKED";
  if (DESTRUCTIVE_PATTERNS.some((p) => p.test(trimmed))) return "DESTRUCTIVE";
  if (/\bcat\s.*>|>>|\btee\b|\bmkdir\b|\btouch\b|\bcp\b|\bmv\b|\bpip\b|\bnpm\b|\bgit\s+(commit|push|merge)/.test(trimmed)) return "WRITE";
  return "SAFE";
}

export function getBlockMessage(): string {
  return "この操作は安全上の理由で実行できません。別の方法を試します。";
}

export function getConfirmMessage(cmd: string, desc: string): string {
  return desc || `このコマンドを実行してもよろしいですか？`;
}
