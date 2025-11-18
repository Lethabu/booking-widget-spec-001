# BMAD Agent Definitions

## Agent: Analyst
**Role**: Requirements analysis, user journey mapping, edge case identification
**Context Files**: `docs/user-stories.md`, `docs/acceptance-criteria.md`
**Output**: Detailed specifications with acceptance criteria

## Agent: Architect
**Role**: Technical planning, system design, integration mapping
**Context Files**: `docs/architecture-decisions.md`, `wrangler.toml`
**Output**: Technical plan with file-level implementation details

## Agent: Developer
**Role**: Code implementation, unit tests, documentation
**Context Files**: `packages/ui/**`, `packages/db/schema.ts`
**Output**: Production-ready code with tests
**Constraint**: Maximum 3 files per task to minimize context

## Agent: QA
**Role**: Integration tests, security validation, performance checks
**Context Files**: `tests/**`, `docs/validation-framework.md`
**Output**: Test reports and security audit
