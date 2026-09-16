import { describe, it, expect } from 'vitest';
import { validatePhoto } from './validatePhoto';

describe('validatePhoto', () => {
  // 유효한 파일을 생성하는 헬퍼 함수
  const createFile = (
    name: string, 
    type: string, 
    size: number = 1000000 // 기본 1MB
  ): File => {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
  };

  describe('유효한 파일 타입', () => {
    it('JPEG 파일을 허용한다', () => {
      const jpegFile = createFile('photo.jpg', 'image/jpeg');
      expect(validatePhoto(jpegFile)).toBe(null);
      
      const jpegFile2 = createFile('photo.jpeg', 'image/jpeg');
      expect(validatePhoto(jpegFile2)).toBe(null);
    });

    it('PNG 파일을 허용한다', () => {
      const pngFile = createFile('photo.png', 'image/png');
      expect(validatePhoto(pngFile)).toBe(null);
    });

    it('WEBP 파일을 허용한다', () => {
      const webpFile = createFile('photo.webp', 'image/webp');
      expect(validatePhoto(webpFile)).toBe(null);
    });

    it('JPG MIME 타입을 허용한다', () => {
      const jpgFile = createFile('photo.jpg', 'image/jpg');
      expect(validatePhoto(jpgFile)).toBe(null);
    });
  });

  describe('파일 타입 검증', () => {
    it('허용되지 않는 MIME 타입을 거부한다', () => {
      const pdfFile = createFile('document.pdf', 'application/pdf');
      const result = validatePhoto(pdfFile);
      expect(result).toEqual({
        fileName: 'document.pdf',
        reason: 'INVALID_TYPE'
      });

      const textFile = createFile('text.txt', 'text/plain');
      const result2 = validatePhoto(textFile);
      expect(result2).toEqual({
        fileName: 'text.txt',
        reason: 'INVALID_TYPE'
      });
    });

    it('허용되지 않는 파일 확장자를 거부한다', () => {
      // MIME 타입은 올바르지만 확장자가 잘못된 경우
      const gifFile = createFile('image.gif', 'image/gif');
      const result = validatePhoto(gifFile);
      expect(result).toEqual({
        fileName: 'image.gif',
        reason: 'INVALID_TYPE'
      });

      const bmpFile = createFile('image.bmp', 'image/bmp');
      const result2 = validatePhoto(bmpFile);
      expect(result2).toEqual({
        fileName: 'image.bmp',
        reason: 'INVALID_TYPE'
      });
    });

    it('대소문자를 구분하지 않고 확장자를 검증한다', () => {
      const jpegFile = createFile('PHOTO.JPEG', 'image/jpeg');
      expect(validatePhoto(jpegFile)).toBe(null);

      const pngFile = createFile('Photo.PNG', 'image/png');
      expect(validatePhoto(pngFile)).toBe(null);

      const webpFile = createFile('photo.WEBP', 'image/webp');
      expect(validatePhoto(webpFile)).toBe(null);
    });
  });

  describe('파일 크기 검증', () => {
    it('10MB 이하 파일을 허용한다', () => {
      const maxSize = 10485760; // 10MB
      const validFile = createFile('photo.jpg', 'image/jpeg', maxSize);
      expect(validatePhoto(validFile)).toBe(null);

      // 10MB 보다 작은 파일
      const smallFile = createFile('photo.jpg', 'image/jpeg', maxSize - 1);
      expect(validatePhoto(smallFile)).toBe(null);
    });

    it('10MB 초과 파일을 거부한다', () => {
      const maxSize = 10485760; // 10MB
      const oversizedFile = createFile('large.jpg', 'image/jpeg', maxSize + 1);
      const result = validatePhoto(oversizedFile);
      expect(result).toEqual({
        fileName: 'large.jpg',
        reason: 'SIZE_EXCEEDED'
      });

      // 훨씬 큰 파일
      const veryLargeFile = createFile('huge.png', 'image/png', 50000000); // 50MB
      const result2 = validatePhoto(veryLargeFile);
      expect(result2).toEqual({
        fileName: 'huge.png',
        reason: 'SIZE_EXCEEDED'
      });
    });

    it('0 바이트 파일을 허용한다', () => {
      const emptyFile = createFile('empty.jpg', 'image/jpeg', 0);
      expect(validatePhoto(emptyFile)).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('확장자가 없는 파일을 거부한다', () => {
      const noExtFile = createFile('filename', 'image/jpeg');
      const result = validatePhoto(noExtFile);
      expect(result).toEqual({
        fileName: 'filename',
        reason: 'INVALID_TYPE'
      });
    });

    it('여러 확장자가 있는 파일을 올바르게 처리한다', () => {
      const multiExtFile = createFile('photo.backup.jpg', 'image/jpeg');
      expect(validatePhoto(multiExtFile)).toBe(null);
    });

    it('점으로 시작하는 파일명을 처리한다', () => {
      const hiddenFile = createFile('.hidden.jpg', 'image/jpeg');
      expect(validatePhoto(hiddenFile)).toBe(null);
    });
  });
});