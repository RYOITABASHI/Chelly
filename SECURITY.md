# Security Policy

Chelly is an education-oriented AI creation app. It can generate project files
and run local build actions, so the default security posture is intentionally
conservative.

## Default Safety Model

- **Local AI first**: the default product direction is to run a bundled or
  locally managed Gemma-family model so classroom prompts and student projects
  do not need to leave the device for the first experience.
- **No Termux requirement**: normal projects live in Chelly's app-private
  sandbox under `/data/data/dev.chelly.app/files/home/chelly`.
- **Approval-first execution**: AI-proposed local actions are displayed as
  confirmation cards before they run.
- **Advanced auto-run is opt-in**: motivated learners can enable it in Settings,
  but it is OFF by default.
- **Blocked means blocked**: destructive or credential-related actions are
  refused even when advanced auto-run is enabled.
- **Secrets stay out of AsyncStorage**: provider API keys are stored with
  `expo-secure-store`.

## Blocked Action Classes

Chelly refuses common high-risk actions, including:

- broad deletes against `/` or `~`
- shell scripts piped from `curl` or `wget`
- commands that print likely API keys, tokens, secrets, or passwords
- credential file access in common handoff paths
- GitHub auth/secret operations and package publishing
- destructive ownership or permission changes near credential paths

The blocklist is not a security sandbox. It is a guardrail for an education
app. Chelly should still be used with real supervision in classrooms.

## API Keys

Cloud provider API keys are optional. When configured in Settings, they are
stored through `expo-secure-store`. Chelly does not operate a backend proxy for
those keys. Requests go directly to the provider selected by the user.

## Reporting

Please do not open public issues for vulnerabilities. Use GitHub private
security advisories if available, or open a minimal issue asking for a private
security contact without including exploit details.
