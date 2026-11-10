export * from './types';
export * from './parser';
export * from './validator';
export * from './staging';
export * from './commit';

// Backward compatibility helpers for earlier endpoints
import { parseNotionExport } from './parser';
import { generateStagingReport } from './staging';
import { commitNotionContent } from './commit';
import { DryRunSummary } from '@/types/api';

export function parseNotionContent(rawContent: string) {
  const curriculum = parseNotionExport(rawContent);
  return {
    months: curriculum.months.map((m) => ({
      month_index: m.monthIndex,
      title: m.title,
      weeks: m.weeks.map((w) => ({
        week_index: w.weekIndex,
        title: w.title,
        days: w.days.map((d) => ({
          day_index: d.dayIndex,
          day_type: d.dayType,
          title: d.title,
          estimated_minutes: d.estimatedMinutes,
          unlock_offset_days: d.unlockOffsetDays,
          is_required: d.isRequired,
          lessons: d.lessons.map((l) => ({
            title: l.title,
            description: l.description || '',
            estimated_minutes: l.estimatedMinutes,
            is_required: l.isRequired,
            blocks: l.blocks.map((b) => ({
              type: b.type,
              payload: b.payload,
              is_required: b.isRequired,
              estimated_minutes: b.estimatedMinutes,
            })),
          })),
        })),
      })),
    })),
    warnings: [] as string[],
    brokenLinks: [] as string[],
  };
}

export function runDryRunValidation(rawContent: string): DryRunSummary {
  const report = generateStagingReport(rawContent);
  return {
    months_count: report.summary.totalMonths,
    weeks_count: report.summary.totalWeeks,
    days_count: report.summary.totalDays,
    lessons_count: report.summary.totalLessons,
    blocks_count: report.summary.totalBlocks,
    assets_count: report.summary.totalAssets,
    broken_links_count: report.errors.filter((e) => e.includes('Drive')).length,
    warnings: [...report.warnings, ...report.errors],
    sample_structure: report.sampleHierarchy.map((s) => ({
      month: s.monthTitle,
      week: s.weekTitle,
      days: [s.dayTitle],
    })),
  };
}

export async function commitNotionImport(
  rawContent: string,
  programId: string = 'prg-chinese-12m',
  versionLabel: string = 'v1.1.0-draft'
) {
  const result = await commitNotionContent(rawContent, {
    programId,
    versionNumber: versionLabel,
    dryRun: false,
  });

  return {
    version: {
      id: result.versionId || 'ver-mock',
      program_id: programId,
      version_number: 1, // numeric for db type compatibility
      status: 'draft' as const,
      published_at: null,
      source_url: 'Notion Import',
      content_checksum: result.checksum,
      changelog: 'Imported from Notion',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    summary: runDryRunValidation(rawContent),
  };
}
