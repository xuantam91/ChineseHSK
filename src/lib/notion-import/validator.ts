import { createHash } from 'crypto';
import {
  StagingCurriculum,
  StagingValidationResult,
  StagingValidationCounts,
} from './types';
import { parseGoogleDriveUrl } from '../google-drive/parser';

/**
 * Computes a deterministic SHA-256 checksum of the staging curriculum.
 */
export function calculateCurriculumChecksum(curriculum: StagingCurriculum): string {
  // Normalize curriculum representation for consistent hashing
  const normalized = {
    months: curriculum.months.map((m) => ({
      monthIndex: m.monthIndex,
      title: m.title.trim(),
      weeks: m.weeks.map((w) => ({
        weekIndex: w.weekIndex,
        title: w.title.trim(),
        days: w.days.map((d) => ({
          dayIndex: d.dayIndex,
          dayType: d.dayType,
          title: d.title.trim(),
          unlockOffsetDays: d.unlockOffsetDays,
          isRequired: d.isRequired,
          lessons: d.lessons.map((l) => ({
            title: l.title.trim(),
            sortOrder: l.sortOrder,
            isRequired: l.isRequired,
            blocks: l.blocks.map((b) => ({
              type: b.type,
              payload: b.payload,
              sortOrder: b.sortOrder,
              isRequired: b.isRequired,
              driveUrl: b.driveUrl,
            })),
          })),
        })),
      })),
    })),
  };

  return createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('hex');
}

/**
 * Validates the staging curriculum tree:
 * - Checks required fields
 * - Detects duplicate day_indexes across the entire program version
 * - Validates Drive URLs and flags malformed/inaccessible URLs
 * - Checks unlock_offset_days ordering and validity
 * - Calculates content checksum
 */
export function validateStagingCurriculum(
  curriculum: StagingCurriculum
): StagingValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const counts: StagingValidationCounts = {
    months: curriculum.months.length,
    weeks: 0,
    days: 0,
    lessons: 0,
    blocks: 0,
    assets: 0,
  };

  if (!curriculum.months || curriculum.months.length === 0) {
    errors.push('Curriculum contains no months.');
  }

  const seenDayIndexes = new Set<number>();
  let prevUnlockOffset = -1;

  for (const month of curriculum.months) {
    if (!month.title || month.title.trim() === '') {
      errors.push(`Month ${month.monthIndex} is missing a title.`);
    }

    if (!month.weeks || month.weeks.length === 0) {
      warnings.push(`Month "${month.title}" contains no weeks.`);
    }

    counts.weeks += month.weeks.length;

    for (const week of month.weeks) {
      if (!week.title || week.title.trim() === '') {
        errors.push(`Week ${week.weekIndex} in Month ${month.monthIndex} is missing a title.`);
      }

      if (!week.days || week.days.length === 0) {
        warnings.push(`Week "${week.title}" contains no days.`);
      }

      counts.days += week.days.length;

      for (const day of week.days) {
        if (!day.title || day.title.trim() === '') {
          errors.push(`Day ${day.dayIndex} is missing a title.`);
        }

        // Check duplicate day_indexes
        if (seenDayIndexes.has(day.dayIndex)) {
          errors.push(
            `Duplicate dayIndex ${day.dayIndex} found at "${day.title}". Day indexes must be globally unique.`
          );
        } else {
          seenDayIndexes.add(day.dayIndex);
        }

        // Check unlock_offset_days
        if (day.unlockOffsetDays < 0) {
          errors.push(
            `Day ${day.dayIndex} ("${day.title}") has negative unlockOffsetDays: ${day.unlockOffsetDays}.`
          );
        }

        if (day.unlockOffsetDays < prevUnlockOffset) {
          warnings.push(
            `Day ${day.dayIndex} ("${day.title}") unlockOffsetDays (${day.unlockOffsetDays}) is less than previous day (${prevUnlockOffset}).`
          );
        }
        prevUnlockOffset = day.unlockOffsetDays;

        if (day.estimatedMinutes <= 0) {
          warnings.push(
            `Day ${day.dayIndex} ("${day.title}") estimatedMinutes is ${day.estimatedMinutes}; expected positive integer.`
          );
        }

        counts.lessons += day.lessons.length;

        for (const lesson of day.lessons) {
          if (!lesson.title || lesson.title.trim() === '') {
            errors.push(`Lesson in Day ${day.dayIndex} is missing a title.`);
          }

          counts.blocks += lesson.blocks.length;

          for (const block of lesson.blocks) {
            if (!block.type) {
              errors.push(`Block in lesson "${lesson.title}" is missing a type.`);
            }

            // Check Drive URL validation if present
            if (block.driveUrl) {
              counts.assets++;
              const parsed = parseGoogleDriveUrl(block.driveUrl);
              if (!parsed.valid) {
                errors.push(
                  `Invalid Google Drive link in lesson "${lesson.title}": ${block.driveUrl} (${parsed.error})`
                );
              }
            }

            if (block.type === 'video' || block.type === 'audio' || block.type === 'pdf') {
              const url = block.payload?.drive_url || block.driveUrl;
              if (url) {
                const parsed = parseGoogleDriveUrl(url);
                if (!parsed.valid) {
                  errors.push(
                    `Malformed media/pdf URL in lesson "${lesson.title}": ${url} (${parsed.error})`
                  );
                }
              } else {
                warnings.push(
                  `Media block of type "${block.type}" in lesson "${lesson.title}" has no drive_url specified.`
                );
              }
            }
          }
        }
      }
    }
  }

  const checksum = calculateCurriculumChecksum(curriculum);

  return {
    isValid: errors.length === 0,
    counts,
    warnings,
    errors,
    checksum,
    staging: {
      ...curriculum,
      contentChecksum: checksum,
    },
  };
}
