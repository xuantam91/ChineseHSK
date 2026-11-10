import {
  StagingCurriculum,
  StagingMonth,
  StagingWeek,
  StagingDay,
  StagingLesson,
  StagingBlock,
} from './types';
import { parseGoogleDriveUrl } from '../google-drive/parser';

export interface ParseOptions {
  sourceKind?: 'markdown' | 'json' | 'csv' | 'auto';
  programSlug?: string;
  programTitle?: string;
}

/**
 * Parses Notion exported JSON string into StagingCurriculum.
 */
export function parseNotionJson(jsonStr: string): StagingCurriculum {
  const data = JSON.parse(jsonStr);

  // If already structured as StagingCurriculum
  if (Array.isArray(data.months)) {
    return {
      programSlug: data.programSlug || 'chinese-12-months',
      programTitle: data.programTitle || '12-Month Chinese Learning Journey',
      versionNumber: data.versionNumber || '1.0.0',
      months: data.months.map((m: any, mIdx: number) => ({
        monthIndex: m.monthIndex ?? m.month_index ?? mIdx + 1,
        title: m.title || `Tháng ${mIdx + 1}`,
        weeks: (m.weeks || []).map((w: any, wIdx: number) => ({
          weekIndex: w.weekIndex ?? w.week_index ?? wIdx + 1,
          title: w.title || `Tuần ${wIdx + 1}`,
          days: (w.days || []).map((d: any, dIdx: number) => ({
            dayIndex: d.dayIndex ?? d.day_index ?? dIdx + 1,
            dayType: d.dayType ?? d.day_type ?? 'learning',
            title: d.title || `Ngày ${d.dayIndex ?? dIdx + 1}`,
            estimatedMinutes: d.estimatedMinutes ?? d.estimated_minutes ?? 30,
            unlockOffsetDays: d.unlockOffsetDays ?? d.unlock_offset_days ?? dIdx,
            isRequired: d.isRequired ?? d.is_required ?? true,
            lessons: (d.lessons || []).map((l: any, lIdx: number) => ({
              title: l.title || `Bài học ${lIdx + 1}`,
              description: l.description || '',
              sortOrder: l.sortOrder ?? l.sort_order ?? lIdx + 1,
              estimatedMinutes: l.estimatedMinutes ?? l.estimated_minutes ?? 15,
              isRequired: l.isRequired ?? l.is_required ?? true,
              blocks: (l.blocks || []).map((b: any, bIdx: number) => ({
                type: b.type || 'rich_text',
                payload: b.payload ?? b.payload_jsonb ?? { content: b.content || '' },
                sortOrder: b.sortOrder ?? b.sort_order ?? bIdx + 1,
                isRequired: b.isRequired ?? b.is_required ?? true,
                estimatedMinutes: b.estimatedMinutes ?? b.estimated_minutes ?? 5,
                driveUrl: b.driveUrl ?? b.drive_url,
              })),
            })),
          })),
        })),
      })),
    };
  }

  throw new Error('Invalid Notion JSON format: missing "months" array');
}

/**
 * Parses CSV export into StagingCurriculum.
 * Expected CSV columns (with header):
 * Month,Week,Day,Lesson,BlockType,Content,DriveUrl
 */
export function parseNotionCsv(csvStr: string): StagingCurriculum {
  const lines = csvStr
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header and at least one data row');
  }

  const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const monthCol = header.indexOf('month');
  const weekCol = header.indexOf('week');
  const dayCol = header.indexOf('day');
  const lessonCol = header.indexOf('lesson');
  const typeCol = header.indexOf('blocktype');
  const contentCol = header.indexOf('content');
  const driveUrlCol = header.indexOf('driveurl');

  const monthsMap = new Map<number, StagingMonth>();

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((c) => c.trim());
    const mNum = parseInt(row[monthCol] || '1', 10);
    const wNum = parseInt(row[weekCol] || '1', 10);
    const dNum = parseInt(row[dayCol] || '1', 10);
    const lessonTitle = row[lessonCol] || `Bài ${dNum}.1`;
    const blockType = (row[typeCol] || 'rich_text') as StagingBlock['type'];
    const content = row[contentCol] || '';
    const driveUrl = row[driveUrlCol] || undefined;

    if (!monthsMap.has(mNum)) {
      monthsMap.set(mNum, {
        monthIndex: mNum,
        title: `Tháng ${mNum}`,
        weeks: [],
      });
    }

    const month = monthsMap.get(mNum)!;
    let week = month.weeks.find((w) => w.weekIndex === wNum);
    if (!week) {
      week = {
        weekIndex: wNum,
        title: `Tuần ${wNum}`,
        days: [],
      };
      month.weeks.push(week);
    }

    let day = week.days.find((d) => d.dayIndex === dNum);
    if (!day) {
      day = {
        dayIndex: dNum,
        dayType: 'learning',
        title: `Ngày ${dNum}`,
        estimatedMinutes: 30,
        unlockOffsetDays: dNum - 1,
        isRequired: true,
        lessons: [],
      };
      week.days.push(day);
    }

    let lesson = day.lessons.find((l) => l.title === lessonTitle);
    if (!lesson) {
      lesson = {
        title: lessonTitle,
        description: '',
        sortOrder: day.lessons.length + 1,
        estimatedMinutes: 20,
        isRequired: true,
        blocks: [],
      };
      day.lessons.push(lesson);
    }

    lesson.blocks.push({
      type: blockType,
      payload: { content },
      sortOrder: lesson.blocks.length + 1,
      isRequired: true,
      estimatedMinutes: 5,
      driveUrl,
    });
  }

  return {
    programSlug: 'chinese-12-months',
    programTitle: '12-Month Chinese Learning Journey',
    months: Array.from(monthsMap.values()),
  };
}

/**
 * Parses Notion exported Markdown string into structured staging hierarchy:
 * Months (# Tháng ...) -> Weeks (## Tuần ...) -> Days (### Ngày ...) -> Lessons (#### Bài ...) -> Blocks
 */
export function parseNotionMarkdown(markdownStr: string): StagingCurriculum {
  const lines = markdownStr.split(/\r?\n/);
  const months: StagingMonth[] = [];

  let currentMonth: StagingMonth | null = null;
  let currentWeek: StagingWeek | null = null;
  let currentDay: StagingDay | null = null;
  let currentLesson: StagingLesson | null = null;

  let globalDayIndex = 1;
  let unlockOffsetCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Heading 1: Month (# Tháng ... or # Month ...)
    if (/^#\s+(tháng|month)/i.test(trimmed)) {
      const title = trimmed.replace(/^#\s*/, '');
      const matchNum = title.match(/\d+/);
      const monthIndex = matchNum ? parseInt(matchNum[0], 10) : months.length + 1;

      currentMonth = {
        monthIndex,
        title,
        weeks: [],
      };
      months.push(currentMonth);
      currentWeek = null;
      currentDay = null;
      currentLesson = null;
      continue;
    }

    // Heading 2: Week (## Tuần ... or ## Week ...)
    if (/^##\s+(tuần|week)/i.test(trimmed)) {
      if (!currentMonth) {
        currentMonth = {
          monthIndex: 1,
          title: 'Tháng 1',
          weeks: [],
        };
        months.push(currentMonth);
      }
      const title = trimmed.replace(/^##\s*/, '');
      const matchNum = title.match(/\d+/);
      const weekIndex = matchNum ? parseInt(matchNum[0], 10) : currentMonth.weeks.length + 1;

      currentWeek = {
        weekIndex,
        title,
        days: [],
      };
      currentMonth.weeks.push(currentWeek);
      currentDay = null;
      currentLesson = null;
      continue;
    }

    // Heading 3: Day (### Ngày ... or ### Day ...)
    if (/^###\s+(ngày|day)/i.test(trimmed)) {
      if (!currentWeek) {
        if (!currentMonth) {
          currentMonth = { monthIndex: 1, title: 'Tháng 1', weeks: [] };
          months.push(currentMonth);
        }
        currentWeek = { weekIndex: 1, title: 'Tuần 1', days: [] };
        currentMonth.weeks.push(currentWeek);
      }

      const title = trimmed.replace(/^###\s*/, '');
      const matchNum = title.match(/\d+/);
      const dayIndex = matchNum ? parseInt(matchNum[0], 10) : globalDayIndex++;

      const lower = title.toLowerCase();
      const isRest = lower.includes('nghỉ') || lower.includes('rest');
      const isReview = lower.includes('ôn tập') || lower.includes('review');
      const isCheckpoint = lower.includes('checkpoint') || lower.includes('kiểm tra');

      let dayType: StagingDay['dayType'] = 'learning';
      if (isRest) dayType = 'rest';
      else if (isReview) dayType = 'review';
      else if (isCheckpoint) dayType = 'checkpoint';

      currentDay = {
        dayIndex,
        dayType,
        title,
        estimatedMinutes: isRest ? 15 : 30,
        unlockOffsetDays: unlockOffsetCounter++,
        isRequired: !isRest,
        lessons: [],
      };
      currentWeek.days.push(currentDay);
      currentLesson = null;
      continue;
    }

    // Heading 4 or bullet lesson: (#### Bài ... or - Bài ...)
    if (/^####\s+/i.test(trimmed) || /^-\s+(bài|lesson)/i.test(trimmed)) {
      if (!currentDay) {
        // Auto-create day if orphaned
        if (!currentWeek) {
          if (!currentMonth) {
            currentMonth = { monthIndex: 1, title: 'Tháng 1', weeks: [] };
            months.push(currentMonth);
          }
          currentWeek = { weekIndex: 1, title: 'Tuần 1', days: [] };
          currentMonth.weeks.push(currentWeek);
        }
        currentDay = {
          dayIndex: globalDayIndex++,
          dayType: 'learning',
          title: `Ngày ${globalDayIndex}`,
          estimatedMinutes: 30,
          unlockOffsetDays: unlockOffsetCounter++,
          isRequired: true,
          lessons: [],
        };
        currentWeek.days.push(currentDay);
      }

      const title = trimmed.replace(/^####\s*/, '').replace(/^-\s*/, '');
      currentLesson = {
        title,
        description: '',
        sortOrder: currentDay.lessons.length + 1,
        estimatedMinutes: 20,
        isRequired: true,
        blocks: [],
      };
      currentDay.lessons.push(currentLesson);
      continue;
    }

    // Inside a lesson: parse content into blocks
    if (currentLesson) {
      // Check for Google Drive links
      const driveMatch = trimmed.match(/https?:\/\/(?:drive|docs)\.google\.com[^\s\)]+/);
      if (driveMatch) {
        const driveUrl = driveMatch[0];
        const parsed = parseGoogleDriveUrl(driveUrl);
        let blockType: StagingBlock['type'] = 'pdf';
        if (parsed.mimeTypeGuess?.startsWith('audio/')) {
          blockType = 'audio';
        } else if (parsed.mimeTypeGuess?.startsWith('video/')) {
          blockType = 'video';
        }

        currentLesson.blocks.push({
          type: blockType,
          payload: {
            title: blockType === 'audio' ? 'File nghe' : blockType === 'video' ? 'Video' : 'Tài liệu Drive',
            drive_url: driveUrl,
            file_id: parsed.fileId,
          },
          sortOrder: currentLesson.blocks.length + 1,
          isRequired: true,
          estimatedMinutes: 10,
          driveUrl,
        });
        continue;
      }

      // Check for vocabulary syntax: e.g. "你好 (nǐ hǎo): Xin chào" or tables
      if (trimmed.includes('(') && trimmed.includes(')') && trimmed.includes(':')) {
        const vocabMatch = trimmed.match(/^([^(\n]+)\s*\(([^)\n]+)\)\s*:\s*(.+)$/);
        if (vocabMatch) {
          currentLesson.blocks.push({
            type: 'vocabulary',
            payload: {
              items: [
                {
                  hanzi: vocabMatch[1].trim(),
                  pinyin: vocabMatch[2].trim(),
                  meaning_vi: vocabMatch[3].trim(),
                },
              ],
            },
            sortOrder: currentLesson.blocks.length + 1,
            isRequired: true,
            estimatedMinutes: 5,
          });
          continue;
        }
      }

      // Standard text -> append to last rich_text block or create one
      const lastBlock = currentLesson.blocks[currentLesson.blocks.length - 1];
      if (lastBlock && lastBlock.type === 'rich_text') {
        lastBlock.payload.content += `\n${trimmed}`;
      } else {
        currentLesson.blocks.push({
          type: 'rich_text',
          payload: { content: trimmed },
          sortOrder: currentLesson.blocks.length + 1,
          isRequired: true,
          estimatedMinutes: 5,
        });
      }
    }
  }

  return {
    programSlug: 'chinese-12-months',
    programTitle: '12-Month Chinese Learning Journey',
    months,
  };
}

/**
 * Main parser entry point: automatically detects format (JSON, CSV, or Markdown).
 */
export function parseNotionExport(
  rawContent: string,
  options?: ParseOptions
): StagingCurriculum {
  const content = rawContent.trim();
  const kind = options?.sourceKind || 'auto';

  if (kind === 'json' || (kind === 'auto' && content.startsWith('{'))) {
    try {
      return parseNotionJson(content);
    } catch (err) {
      if (kind === 'json') throw err;
      // If auto-detection failed, fall through
    }
  }

  if (kind === 'csv' || (kind === 'auto' && /^month\s*,/i.test(content))) {
    try {
      return parseNotionCsv(content);
    } catch (err) {
      if (kind === 'csv') throw err;
    }
  }

  return parseNotionMarkdown(content);
}
