# 🧠 My Skills

My collection of agent **skills** (`SKILL.md` playbooks) for AI coding agents such as Freebuff, Claude Code, Cursor and Gemini CLI – skills I wrote myself, plus third-party skill libraries kept with their original licences.

## 📁 What's Inside

| Path | What it is |
|------|-----------|
| [`made-by-us/`](made-by-us/) | **31 original skills** – 13 distilled from open-source repos (`from-repo-analysis/`) and an 18-skill **cinematic website pack** (`cinematic-pack/`) |
| [`freebuff-coding-skills/`](freebuff-coding-skills/) | Every coding skill installed in Freebuff – **885 skills copied**, grouped by source repo with each repo's LICENSE, plus 87 listed as links only |
| [`antigravity-awesome-skills-main/`](antigravity-awesome-skills-main/) | A copy of [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) – a large installable skill library (MIT, see its LICENSE) |
| `agent-skills-main.zip` | Zipped agent-skills collection |
| `AI-DEV-KIT (2).zip` | Zipped AI dev kit |
| `ai-original-problem-solver-skill-pack.zip` | Zipped problem-solver skill pack |
| `reelmimic-original-skills-and-dependencies.zip` | Zipped ReelMimic skills and their dependencies |
| `reelmimic_original_skills_downloader.zip` | Zipped ReelMimic skills downloader |

### ✍️ made-by-us/

- **from-repo-analysis/** (13) – core techniques condensed from repos like DSPy, Aider, OpenHands, SWE-agent, PromptBreeder and Continue, written in our own words; every `SKILL.md` names its source
- **cinematic-pack/** (18) – direction, design system, motion, scroll-scrubbed film, 3D type, WebGL effects, three.js, performance budget, critique loop and showreel skills for cinematic, mobile-first websites (start with `cinematic-pack/README.md`)

### 📦 freebuff-coding-skills/

Skills from sources such as wshobson/agents, alirezarezvani/claude-skills, trailofbits/skills, android/skills, getsentry/skills, addyosmani/agent-skills, expo/skills, cloudflare/skills, anthropics/skills, stripe/ai, prisma/skills, supabase/agent-skills and more. The full table with counts and licences is in [`freebuff-coding-skills/README.md`](freebuff-coding-skills/README.md).

## 🚀 How to Use a Skill

Each skill is a folder with a `SKILL.md` (when to use it, steps, pitfalls) plus any helper files.

```bash
git clone https://github.com/shivamani-code/My-skills.git
# Global install for Freebuff / agents that read ~/.agents/skills
cp -r My-skills/made-by-us/cinematic-pack/* ~/.agents/skills/
# or per project
cp -r My-skills/made-by-us/from-repo-analysis/<skill> <project>/.agents/skills/
```

## ⚖️ Licences

Third-party skills keep their original licence and attribution and belong to their authors – see the LICENSE file inside each source folder. Skills from sources without an open licence are linked, not copied.
