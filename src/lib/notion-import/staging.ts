import { StagingCurriculum, StagingValidationResult } from './types';
import { parseNotionExport, ParseOptions } from './parser';
import { validateStagingCurriculum } from './validator';

export interface StagingReport {
  summary: {
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalLessons: number;
    totalBlocks: number;
    totalAssets: number;
    isValid: boolean;
    checksum: string;
  };
  warnings: string[];
  errors: string[];
  sampleHierarchy: {
    monthTitle: string;
    weekTitle: string;
    dayTitle: string;
    lessonCount: number;
  }[];
  validationResult: StagingValidationResult;
}

/**
 * Parses raw content, validates the tree, and produces a comprehensive staging report.
 */
export function generateStagingReport(
  rawContent: string,
  options?: ParseOptions
): StagingReport {
  const stagingCurriculum = parseNotionExport(rawContent, options);
  return createStagingReportFromCurriculum(stagingCurriculum);
}

/**
 * Generates staging report directly from an already parsed StagingCurriculum.
 */
export function createStagingReportFromCurriculum(
  curriculum: StagingCurriculum
): StagingReport {
  const validationResult = validateStagingCurriculum(curriculum);

  const sampleHierarchy: StagingReport['sampleHierarchy'] = [];
  for (const month of curriculum.months.slice(0, 3)) {
    for (const week of month.weeks.slice(0, 2)) {
      for (const day of week.days.slice(0, 2)) {
        sampleHierarchy.push({
          monthTitle: month.title,
          weekTitle: week.title,
          dayTitle: day.title,
          lessonCount: day.lessons.length,
        });
      }
    }
  }

  return {
    summary: {
      totalMonths: validationResult.counts.months,
      totalWeeks: validationResult.counts.weeks,
      totalDays: validationResult.counts.days,
      totalLessons: validationResult.counts.lessons,
      totalBlocks: validationResult.counts.blocks,
      totalAssets: validationResult.counts.assets,
      isValid: validationResult.isValid,
      checksum: validationResult.checksum,
    },
    warnings: validationResult.warnings,
    errors: validationResult.errors,
    sampleHierarchy,
    validationResult,
  };
}
