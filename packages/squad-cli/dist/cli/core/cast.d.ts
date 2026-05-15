/**
 * Team casting engine — parses coordinator team proposals and scaffolds agent files.
 * @module cli/core/cast
 */
export interface CastMember {
    name: string;
    role: string;
    scope: string;
    emoji: string;
}
export interface CastProposal {
    members: CastMember[];
    universe: string;
    projectDescription: string;
}
export interface CastResult {
    teamRoot: string;
    membersCreated: string[];
    filesCreated: string[];
}
/** Map a role string to its emoji. Exported for reuse. */
export declare function roleToEmoji(role: string): string;
/**
 * Parse a team proposal from the coordinator's response.
 * Handles multiple formats:
 *   1. Strict INIT_TEAM: format
 *   2. Markdown code blocks wrapping INIT_TEAM
 *   3. Pipe-delimited lines without INIT_TEAM header
 *   4. Emoji-prefixed role lines (🏗️ Name — Role  Scope)
 * Returns null only if no team members could be extracted.
 */
export declare function parseCastResponse(response: string): CastProposal | null;
/**
 * Augment a parsed CastProposal with CastingEngine data if universe is recognized.
 * Maps LLM-proposed universe names to engine universe IDs, then uses the engine to:
 * - Allocate character names from the curated pool
 * - Inject template personalities and backstories
 *
 * This is an "augment" strategy: LLM proposes roles, engine assigns names/personalities.
 */
export declare function augmentWithCastingEngine(proposal: CastProposal): CastProposal;
/**
 * Create all squad agent files for a cast proposal.
 * teamRoot is the project root (parent of .squad/).
 */
export declare function createTeam(teamRoot: string, proposal: CastProposal): Promise<CastResult>;
/** Format a cast proposal as a human-readable summary. */
export declare function formatCastSummary(proposal: CastProposal): string;
//# sourceMappingURL=cast.d.ts.map