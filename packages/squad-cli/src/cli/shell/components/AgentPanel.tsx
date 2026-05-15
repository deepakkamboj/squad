import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'ink';
import { getBrand } from '../../brand.js';
import { isNoColor, useLayoutTier } from '../terminal.js';
import { Separator } from './Separator.js';
import { useCompletionFlash } from '../useAnimation.js';
import { getStatusTag } from '../agent-status.js';
import type { AgentSession } from '../types.js';

function getAgentCategory(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('lead') || r.includes('supervisor') || r.includes('coordinator') || r.includes('architect')) return 'Orchestration';
  if (r.includes('test') || r.includes('qa') || r.includes('quality') || r.includes('tester') || r.includes('runner')) return 'Testing';
  if (r.includes('discover') || r.includes('triage') || r.includes('analyz') || r.includes('audit') || r.includes('report')) return 'Analysis';
  if (r.includes('dev') || r.includes('engineer') || r.includes('coding') || r.includes('code')) return 'Engineering';
  if (r.includes('release') || r.includes('ops') || r.includes('infra') || r.includes('distrib') || r.includes('deploy')) return 'Operations';
  if (r.includes('design') || r.includes('visual') || r.includes('graphic')) return 'Design';
  if (r.includes('doc') || r.includes('devrel') || r.includes('writer') || r.includes('sdk')) return 'Docs';
  return 'General';
}

interface AgentPanelProps {
  agents: AgentSession[];
  streamingContent?: Map<string, string>;
}

const PULSE_FRAMES = ['●', '◉', '○', '◉'];

/** Pulsing dot for active agents — draws the eye. Static in NO_COLOR mode. */
const PulsingDot: React.FC = () => {
  const noColor = isNoColor();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (noColor) return;
    // 800ms interval reduces re-renders vs 500ms (fix-cli-scroll-rerender-storm)
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % PULSE_FRAMES.length);
    }, 800);
    return () => clearInterval(timer);
  }, [noColor]);

  if (noColor) return <Text>●</Text>;
  return <Text color="green">{PULSE_FRAMES[frame]}</Text>;
};

/** Elapsed seconds since agent started working. */
function agentElapsedSec(agent: AgentSession): number {
  const active = agent.status === 'streaming' || agent.status === 'working';
  if (!active) return 0;
  return Math.floor((Date.now() - agent.startedAt.getTime()) / 1000);
}

/** Format elapsed time for display. */
function formatElapsed(seconds: number): string {
  if (seconds < 1) return '';
  return `${seconds}s`;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ agents, streamingContent }) => {
  const noColor = isNoColor();
  const tier = useLayoutTier();
  const accent = getBrand().accentColor;

  // Re-render gate: store elapsed strings in a ref so the timer only triggers
  // a React re-render (via the tick counter) when a visible value changes.
  const elapsedRef = useRef(new Map<string, string>());
  const [, setElapsedTick] = useState(0);

  useEffect(() => {
    const hasActive = agents.some(a => a.status === 'working' || a.status === 'streaming');
    if (!hasActive) return;
    const timer = setInterval(() => {
      let changed = false;
      for (const a of agents) {
        if (a.status === 'working' || a.status === 'streaming') {
          const display = formatElapsed(agentElapsedSec(a));
          if (elapsedRef.current.get(a.name) !== display) {
            elapsedRef.current.set(a.name, display);
            changed = true;
          }
        }
      }
      if (changed) setElapsedTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [agents]);

  // Completion flash: brief "✓ Done" when agent finishes work
  const completionFlash = useCompletionFlash(agents);

  if (agents.length === 0) {
    return (
      <Box flexDirection="column" paddingX={1} marginTop={1}>
        <Text dimColor>No agents active.</Text>
        <Text><Text bold>Send a message</Text><Text dimColor> to start. </Text><Text bold>/help</Text><Text dimColor> for commands.</Text></Text>
      </Box>
    );
  }

  const activeAgents = agents.filter(a => a.status === 'streaming' || a.status === 'working');

  // Narrow layout: minimal single-line per agent, no hints
  if (tier === 'narrow') {
    return (
      <Box flexDirection="column" paddingX={1} marginTop={1}>
        {agents.map((agent) => {
          const active = agent.status === 'streaming' || agent.status === 'working';
          const errored = agent.status === 'error';
          const statusLabel = getStatusTag(agent.status);
          const nameColor = noColor ? undefined : active ? 'green' : errored ? 'red' : 'white';
          return (
            <Box key={agent.name} gap={0}>
              {!noColor && <Text color={active ? 'green' : errored ? 'red' : accent}>◆ </Text>}
              {noColor && <Text>◆ </Text>}
              <Text bold={active} color={nameColor}>
                {agent.name}
              </Text>
              {active && <><Text> </Text><PulsingDot /></>}
              {errored && <Text color={noColor ? undefined : 'red'} bold> ERR</Text>}
              {completionFlash.has(agent.name) && (
                noColor
                  ? <Text bold> ✓ Done</Text>
                  : <Text color="green" bold> ✓ Done</Text>
              )}
              {!active && !errored && !completionFlash.has(agent.name) && <Text dimColor> {statusLabel}</Text>}
            </Box>
          );
        })}
        <Separator marginTop={1} />
      </Box>
    );
  }

  // Normal layout: compact, abbreviated hints
  if (tier === 'normal') {
    return (
      <Box flexDirection="column" paddingX={1} marginTop={1}>
        {agents.map((agent) => {
          const active = agent.status === 'streaming' || agent.status === 'working';
          const errored = agent.status === 'error';
          const statusLabel = getStatusTag(agent.status);
          const nameColor = noColor ? undefined : active ? 'green' : errored ? 'red' : 'white';
          return (
            <Box key={agent.name} gap={0}>
              {!noColor && <Text color={active ? 'green' : errored ? 'red' : accent}>◆ </Text>}
              {noColor && <Text>◆ </Text>}
              <Text bold={active} color={nameColor}>
                {agent.name}
              </Text>
              {active && <><Text> </Text><PulsingDot />{agent.activityHint && <Text bold> {agent.activityHint.slice(0, 30)}</Text>}</>}
              {errored && <Text color={noColor ? undefined : 'red'} bold> {statusLabel}</Text>}
              {completionFlash.has(agent.name) && <Text color={noColor ? undefined : 'green'} bold> ✓ Done</Text>}
              {!active && !errored && !completionFlash.has(agent.name) && <Text dimColor> {statusLabel}</Text>}
            </Box>
          );
        })}
        {/* Show simple status line for active agents at normal width */}
        {activeAgents.length > 0 && (
          <Box flexDirection="column">
            {activeAgents.map(a => {
              const sec = agentElapsedSec(a);
              const elapsed = formatElapsed(sec);
              const hint = a.activityHint ?? 'working';
              return (
                <Text key={a.name} color={noColor ? undefined : 'yellow'} dimColor>
                  {' '}{hint.slice(0, 40)}{elapsed ? ` (${elapsed})` : ''}
                </Text>
              );
            })}
          </Box>
        )}
        <Separator marginTop={1} />
      </Box>
    );
  }

  // Wide layout: vertical list grouped by category
  const categories = new Map<string, AgentSession[]>();
  for (const agent of agents) {
    const cat = getAgentCategory(agent.role);
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(agent);
  }

  return (
    <Box flexDirection="column" paddingX={1} marginTop={1}>
      {Array.from(categories.entries()).map(([cat, catAgents], catIdx) => (
        <Box key={cat} flexDirection="column" marginTop={catIdx === 0 ? 0 : 1}>
          <Text dimColor>{cat.toUpperCase()}</Text>
          {catAgents.map((agent) => {
            const active = agent.status === 'streaming' || agent.status === 'working';
            const errored = agent.status === 'error';
            const elapsed = elapsedRef.current.get(agent.name);
            return (
              <Box key={agent.name} paddingLeft={2}>
                {!noColor && <Text color={active ? 'green' : errored ? 'red' : accent}>◆ </Text>}
                {noColor && <Text>◆ </Text>}
                <Text
                  bold={active}
                  color={noColor ? undefined : active ? 'green' : errored ? 'red' : 'white'}
                >
                  {agent.name}
                </Text>
                <Text dimColor>  {agent.role}</Text>
                {active && (
                  <>
                    <Text> </Text>
                    <PulsingDot />
                    {agent.activityHint && <Text color={noColor ? undefined : 'green'}> {agent.activityHint.slice(0, 30)}</Text>}
                    {elapsed && <Text dimColor> ({elapsed})</Text>}
                    {agent.model && <Text dimColor> [{agent.model}]</Text>}
                  </>
                )}
                {errored && <Text color={noColor ? undefined : 'red'} bold> [ERR]</Text>}
                {completionFlash.has(agent.name) && (
                  noColor ? <Text bold> ✓ Done</Text> : <Text color="green" bold> ✓ Done</Text>
                )}
                {!active && !errored && !completionFlash.has(agent.name) && (
                  <Text dimColor>  {getStatusTag(agent.status)}</Text>
                )}
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Progress for active agents */}
      {activeAgents.length > 0 ? (
        <Box flexDirection="column" marginTop={1}>
          {activeAgents.length > 1 && (
            <Text dimColor> {activeAgents.length} agents working in parallel</Text>
          )}
          {activeAgents.map(a => {
            const sec = agentElapsedSec(a);
            const elapsed = formatElapsed(sec);
            const hint = a.activityHint ?? 'working';
            return (
              <Text key={a.name} color={noColor ? undefined : 'yellow'}>
                {' '}◆ {a.name} — {hint}{elapsed ? ` (${elapsed})` : ''}
              </Text>
            );
          })}
        </Box>
      ) : (
        <Box marginTop={1}>
          <Text dimColor>{' '}{agents.length} agent{agents.length !== 1 ? 's' : ''} ready</Text>
        </Box>
      )}

      <Separator marginTop={1} />
    </Box>
  );
};
