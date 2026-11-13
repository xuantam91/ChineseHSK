import { describe, it, expect } from 'vitest';
import {
  CURATED_MEDIA_RESOURCES,
  getMediaByLessonId,
  getMediaByCategory,
  getThematicFlashcardByLessonId,
} from '@/lib/curriculum/media-resources';
import { THEMATIC_FLASHCARD_SETS } from '@/lib/curriculum/topic-flashcards';

describe('Curated Media Resources Catalog', () => {
  it('contains at least 30 curated educational resources', () => {
    expect(CURATED_MEDIA_RESOURCES.length).toBeGreaterThanOrEqual(30);
  });

  it('ensures all media items have sanitized safe URLs with no tracking parameters', () => {
    for (const item of CURATED_MEDIA_RESOURCES) {
      expect(item.sanitizedInfo.safeUrl).not.toContain('fbclid');
      expect(item.sanitizedInfo.safeUrl).not.toContain('l.facebook.com');
      expect(item.sanitizedInfo.safeUrl.length).toBeGreaterThan(5);
    }
  });

  it('ensures YouTube video items produce embeddable URLs', () => {
    const videoItems = CURATED_MEDIA_RESOURCES.filter(
      (m) => m.sanitizedInfo.mediaType === 'youtube_video'
    );
    expect(videoItems.length).toBeGreaterThanOrEqual(10);

    for (const item of videoItems) {
      expect(item.sanitizedInfo.isEmbeddable).toBe(true);
      expect(item.sanitizedInfo.embedUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/);
    }
  });

  it('ensures Google Drive textbook folders produce embeddable view URLs', () => {
    const driveItems = CURATED_MEDIA_RESOURCES.filter(
      (m) => m.sanitizedInfo.mediaType === 'drive_folder'
    );
    expect(driveItems.length).toBeGreaterThanOrEqual(3);

    for (const item of driveItems) {
      expect(item.sanitizedInfo.isEmbeddable).toBe(true);
      expect(item.sanitizedInfo.embedUrl).toContain('drive.google.com/embeddedfolderview');
    }
  });

  it('maps supplementary media correctly to HSK 1 Lesson 01 and aliases', () => {
    const hsk1Media = getMediaByLessonId('hsk1-lesson-01');
    expect(hsk1Media.length).toBeGreaterThan(0);
    const titles = hsk1Media.map((m) => m.title);
    expect(titles.some((t) => t.includes('Pinyin') || t.includes('Sing-Alongs'))).toBe(true);

    const day01Media = getMediaByLessonId('lesson-01-01');
    expect(day01Media.length).toEqual(hsk1Media.length);
  });

  it('maps thematic flashcard sets to corresponding lesson IDs', () => {
    const clothingSet = getThematicFlashcardByLessonId('hsk1-lesson-05');
    expect(clothingSet).toBeDefined();
    expect(clothingSet?.words.length).toBeGreaterThanOrEqual(4);
    expect(clothingSet?.videoId).toBe('WmzZ_xI5ceM');

    const foodSet = getThematicFlashcardByLessonId('hsk2-lesson-01');
    expect(foodSet).toBeDefined();
    expect(foodSet?.topicVi).toContain('Món ăn');
  });

  it('filters curated media by category', () => {
    const songs = getMediaByCategory('song');
    expect(songs.length).toBeGreaterThanOrEqual(5);

    const cartoons = getMediaByCategory('cartoon');
    expect(cartoons.length).toBeGreaterThanOrEqual(5);

    const flashcards = getMediaByCategory('flashcard');
    expect(flashcards.length).toBeGreaterThanOrEqual(9);
  });
});
