import { StagingCurriculum } from './types';
import { generateStagingReport, StagingReport } from './staging';
import { parseNotionExport, ParseOptions } from './parser';

export interface CommitOptions {
  programId?: string;
  versionNumber?: string;
  dryRun?: boolean;
  sourceUrl?: string;
  parseOptions?: ParseOptions;
}

export interface CommitResult {
  dryRun: boolean;
  success: boolean;
  checksum: string;
  versionId?: string;
  versionNumber: string;
  alreadyExists?: boolean;
  operations: {
    programVersion: 'inserted' | 'existing_skipped' | 'dry_run_preview';
    monthsCount: number;
    weeksCount: number;
    daysCount: number;
    lessonsCount: number;
    blocksCount: number;
  };
  report: StagingReport;
  error?: string;
}

export interface CurriculumRepository {
  findVersionByChecksum(programId: string, checksum: string): Promise<{ id: string; version_number: string } | null>;
  saveCurriculumHierarchy(params: {
    programId: string;
    versionNumber: string;
    checksum: string;
    sourceUrl?: string;
    curriculum: StagingCurriculum;
  }): Promise<{ versionId: string }>;
}

// In-memory version tracker for mock / default repository
const inMemoryVersionsByChecksum = new Map<string, { id: string; version_number: string }>();

export const defaultMockRepository: CurriculumRepository = {
  async findVersionByChecksum(programId: string, checksum: string) {
    const key = `${programId}:${checksum}`;
    return inMemoryVersionsByChecksum.get(key) || null;
  },
  async saveCurriculumHierarchy(params) {
    const versionId = `ver-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const key = `${params.programId}:${params.checksum}`;
    inMemoryVersionsByChecksum.set(key, { id: versionId, version_number: params.versionNumber });
    return { versionId };
  },
};

/**
 * Commits imported Notion content idempotently into program_version.
 * Supports dry-run and skips duplicate inserts if the exact same content checksum was already committed.
 */
export async function commitNotionContent(
  rawContent: string,
  options: CommitOptions = {},
  repository: CurriculumRepository = defaultMockRepository
): Promise<CommitResult> {
  const programId = options.programId || 'prg-chinese-12m';
  const versionNumber = options.versionNumber || '1.0.0';
  const dryRun = options.dryRun ?? false;

  const curriculum = parseNotionExport(rawContent, options.parseOptions);
  const report = generateStagingReport(rawContent, options.parseOptions);

  if (!report.summary.isValid) {
    return {
      dryRun,
      success: false,
      checksum: report.summary.checksum,
      versionNumber,
      operations: {
        programVersion: dryRun ? 'dry_run_preview' : 'existing_skipped',
        monthsCount: report.summary.totalMonths,
        weeksCount: report.summary.totalWeeks,
        daysCount: report.summary.totalDays,
        lessonsCount: report.summary.totalLessons,
        blocksCount: report.summary.totalBlocks,
      },
      report,
      error: `Validation failed with ${report.errors.length} errors: ${report.errors.join('; ')}`,
    };
  }

  const checksum = report.summary.checksum;

  // Dry-run mode: return exact preview without executing database writes
  if (dryRun) {
    return {
      dryRun: true,
      success: true,
      checksum,
      versionNumber,
      operations: {
        programVersion: 'dry_run_preview',
        monthsCount: report.summary.totalMonths,
        weeksCount: report.summary.totalWeeks,
        daysCount: report.summary.totalDays,
        lessonsCount: report.summary.totalLessons,
        blocksCount: report.summary.totalBlocks,
      },
      report,
    };
  }

  // Idempotency check: see if this checksum was already committed
  const existing = await repository.findVersionByChecksum(programId, checksum);
  if (existing) {
    return {
      dryRun: false,
      success: true,
      checksum,
      versionId: existing.id,
      versionNumber: existing.version_number,
      alreadyExists: true,
      operations: {
        programVersion: 'existing_skipped',
        monthsCount: report.summary.totalMonths,
        weeksCount: report.summary.totalWeeks,
        daysCount: report.summary.totalDays,
        lessonsCount: report.summary.totalLessons,
        blocksCount: report.summary.totalBlocks,
      },
      report,
    };
  }

  // Real commit
  const saved = await repository.saveCurriculumHierarchy({
    programId,
    versionNumber,
    checksum,
    sourceUrl: options.sourceUrl || 'notion://import',
    curriculum,
  });

  return {
    dryRun: false,
    success: true,
    checksum,
    versionId: saved.versionId,
    versionNumber,
    alreadyExists: false,
    operations: {
      programVersion: 'inserted',
      monthsCount: report.summary.totalMonths,
      weeksCount: report.summary.totalWeeks,
      daysCount: report.summary.totalDays,
      lessonsCount: report.summary.totalLessons,
      blocksCount: report.summary.totalBlocks,
    },
    report,
  };
}
