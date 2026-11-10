import { describe, it, expect } from 'vitest';
import {
  parseNotionMarkdown,
  parseNotionJson,
  parseNotionCsv,
  validateStagingCurriculum,
  calculateCurriculumChecksum,
  generateStagingReport,
  commitNotionContent,
  StagingCurriculum,
} from '@/lib/notion-import';

describe('Notion Import: Staging Parser', () => {
  const sampleMarkdown = `
# Tháng 1: Nhập môn & Phát âm
## Tuần 1: Bảng chữ cái Pinyin & Thanh điệu
### Ngày 1: Giới thiệu Pinyin
#### Bài 1.1: 4 thanh điệu cơ bản
Đây là bài học đầu tiên về ngữ âm tiếng Trung.
你好 (nǐ hǎo): Xin chào
https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view

### Ngày 2: Vần mẫu căn bản
#### Bài 1.2: Các nguyên âm đơn
Tập phát âm a, o, e, i, u, ü.

### Ngày 3: Nghỉ ngơi & Ôn tập nhẹ
`;

  it('parses Notion exported Markdown into hierarchical staging curriculum', () => {
    const staging = parseNotionMarkdown(sampleMarkdown);

    expect(staging.months.length).toBe(1);
    expect(staging.months[0].title).toContain('Tháng 1');

    const week = staging.months[0].weeks[0];
    expect(week.title).toContain('Tuần 1');
    expect(week.days.length).toBe(3);

    // Day 1
    const day1 = week.days[0];
    expect(day1.title).toContain('Ngày 1');
    expect(day1.dayType).toBe('learning');
    expect(day1.lessons.length).toBe(1);

    // Day 3 (Rest)
    const day3 = week.days[2];
    expect(day3.title).toContain('Ngày 3');
    expect(day3.dayType).toBe('rest');
    expect(day3.isRequired).toBe(false);

    // Blocks in Day 1, Lesson 1
    const blocks = day1.lessons[0].blocks;
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    expect(blocks.some((b) => b.type === 'vocabulary')).toBe(true);
    expect(blocks.some((b) => b.driveUrl?.includes('drive.google.com'))).toBe(true);
  });

  it('parses Notion exported JSON format accurately', () => {
    const sampleJson = JSON.stringify({
      programSlug: 'chinese-12m',
      programTitle: 'HSK 1-6 Roadmap',
      months: [
        {
          monthIndex: 1,
          title: 'Tháng 1: Khởi động',
          weeks: [
            {
              weekIndex: 1,
              title: 'Tuần 1',
              days: [
                {
                  dayIndex: 1,
                  dayType: 'learning',
                  title: 'Ngày 1: Xin chào',
                  estimatedMinutes: 25,
                  unlockOffsetDays: 0,
                  isRequired: true,
                  lessons: [
                    {
                      title: 'Bài 1',
                      description: 'Mô tả bài 1',
                      sortOrder: 1,
                      estimatedMinutes: 20,
                      isRequired: true,
                      blocks: [
                        {
                          type: 'rich_text',
                          payload: { content: 'Chào bạn!' },
                          sortOrder: 1,
                          isRequired: true,
                          estimatedMinutes: 5,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const parsed = parseNotionJson(sampleJson);
    expect(parsed.months.length).toBe(1);
    expect(parsed.months[0].weeks[0].days[0].dayIndex).toBe(1);
  });

  it('parses Notion exported CSV format accurately', () => {
    const sampleCsv = `Month,Week,Day,Lesson,BlockType,Content,DriveUrl
1,1,1,Bài 1.1,rich_text,Nội dung chào hỏi,
1,1,1,Bài 1.1,audio,Audio phát âm,https://drive.google.com/file/d/1AudioFile1234567/view`;

    const parsed = parseNotionCsv(sampleCsv);
    expect(parsed.months.length).toBe(1);
    expect(parsed.months[0].weeks[0].days[0].lessons[0].blocks.length).toBe(2);
  });
});

describe('Notion Import: Staging Validation & Integrity Rules', () => {
  it('validates a complete, healthy staging curriculum', () => {
    const validCurriculum: StagingCurriculum = {
      programSlug: 'chinese-12m',
      programTitle: 'HSK Chinese',
      months: [
        {
          monthIndex: 1,
          title: 'Tháng 1',
          weeks: [
            {
              weekIndex: 1,
              title: 'Tuần 1',
              days: [
                {
                  dayIndex: 1,
                  dayType: 'learning',
                  title: 'Ngày 1',
                  estimatedMinutes: 30,
                  unlockOffsetDays: 0,
                  isRequired: true,
                  lessons: [
                    {
                      title: 'Bài 1',
                      sortOrder: 1,
                      estimatedMinutes: 15,
                      isRequired: true,
                      blocks: [
                        {
                          type: 'rich_text',
                          payload: { content: 'Xin chào' },
                          sortOrder: 1,
                          isRequired: true,
                          estimatedMinutes: 5,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = validateStagingCurriculum(validCurriculum);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.counts.months).toBe(1);
    expect(result.counts.days).toBe(1);
    expect(result.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it('detects duplicate dayIndex across the curriculum and marks invalid', () => {
    const invalidCurriculum: StagingCurriculum = {
      months: [
        {
          monthIndex: 1,
          title: 'Tháng 1',
          weeks: [
            {
              weekIndex: 1,
              title: 'Tuần 1',
              days: [
                {
                  dayIndex: 1,
                  dayType: 'learning',
                  title: 'Ngày 1 Lần 1',
                  estimatedMinutes: 30,
                  unlockOffsetDays: 0,
                  isRequired: true,
                  lessons: [],
                },
                {
                  dayIndex: 1, // DUPLICATE DAY INDEX!
                  dayType: 'learning',
                  title: 'Ngày 1 Lần 2 (Duplicate)',
                  estimatedMinutes: 30,
                  unlockOffsetDays: 1,
                  isRequired: true,
                  lessons: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = validateStagingCurriculum(invalidCurriculum);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((err) => err.includes('Duplicate dayIndex 1'))).toBe(true);
  });

  it('detects unverified or malicious Drive URLs during staging validation', () => {
    const maliciousCurriculum: StagingCurriculum = {
      months: [
        {
          monthIndex: 1,
          title: 'Tháng 1',
          weeks: [
            {
              weekIndex: 1,
              title: 'Tuần 1',
              days: [
                {
                  dayIndex: 1,
                  dayType: 'learning',
                  title: 'Ngày 1',
                  estimatedMinutes: 30,
                  unlockOffsetDays: 0,
                  isRequired: true,
                  lessons: [
                    {
                      title: 'Bài 1',
                      sortOrder: 1,
                      estimatedMinutes: 15,
                      isRequired: true,
                      blocks: [
                        {
                          type: 'pdf',
                          payload: {},
                          sortOrder: 1,
                          isRequired: true,
                          estimatedMinutes: 5,
                          driveUrl: 'http://malicious.evil.com/steal-creds/view', // SSRF attack
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = validateStagingCurriculum(maliciousCurriculum);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((err) => err.includes('Invalid Google Drive link'))).toBe(true);
  });
});

describe('Notion Import: Dry-Run Report & Idempotent Commit', () => {
  const healthyContent = `
# Tháng 1: Chuẩn bị & Nhập môn
## Tuần 1: Ngữ âm căn bản
### Ngày 1: Thanh điệu
#### Bài 1: 4 thanh điệu
Nội dung bài học thanh điệu.
### Ngày 2: Vần mẫu
#### Bài 2: Các vần mẫu đơn
Nội dung bài học vần mẫu.
`;

  it('runs dry-run report without committing to store', async () => {
    const report = generateStagingReport(healthyContent);
    expect(report.summary.isValid).toBe(true);
    expect(report.summary.totalMonths).toBe(1);
    expect(report.summary.totalWeeks).toBe(1);
    expect(report.summary.totalDays).toBe(2);
    expect(report.summary.totalLessons).toBe(2);

    const dryRunResult = await commitNotionContent(healthyContent, {
      dryRun: true,
      programId: 'prg-test',
    });

    expect(dryRunResult.dryRun).toBe(true);
    expect(dryRunResult.success).toBe(true);
    expect(dryRunResult.operations.programVersion).toBe('dry_run_preview');
    expect(dryRunResult.versionId).toBeUndefined();
  });

  it('commits idempotently and prevents duplicate insertions for identical checksum', async () => {
    // 1st commit
    const firstCommit = await commitNotionContent(healthyContent, {
      dryRun: false,
      programId: 'prg-idempotent-test',
      versionNumber: 'v1.0.0',
    });

    expect(firstCommit.success).toBe(true);
    expect(firstCommit.alreadyExists).toBe(false);
    expect(firstCommit.operations.programVersion).toBe('inserted');
    expect(firstCommit.versionId).toBeDefined();

    // 2nd commit with exact same content
    const secondCommit = await commitNotionContent(healthyContent, {
      dryRun: false,
      programId: 'prg-idempotent-test',
      versionNumber: 'v1.0.0',
    });

    expect(secondCommit.success).toBe(true);
    expect(secondCommit.alreadyExists).toBe(true);
    expect(secondCommit.operations.programVersion).toBe('existing_skipped');
    expect(secondCommit.versionId).toBe(firstCommit.versionId);
    expect(secondCommit.checksum).toBe(firstCommit.checksum);
  });
});
