import type { UploadError } from '../types';

/**
 * 사진 파일 유효성 검사 함수
 * MIME 타입, 파일 확장자, 파일 크기를 검증
 * 
 * @param file 검증할 File 객체
 * @returns 유효한 경우 null, 오류가 있는 경우 UploadError 객체 반환
 */
export function validatePhoto(file: File): UploadError | null {
  // 허용되는 MIME 타입
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  // 허용되는 파일 확장자 (대소문자 구분 안함)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  // 최대 파일 크기: 10MB = 10 * 1024 * 1024 bytes = 10,485,760 bytes
  const maxFileSize = 10485760;
  
  // MIME 타입 검사
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      fileName: file.name,
      reason: 'INVALID_TYPE'
    };
  }
  
  // 파일 확장자 검사 (추가 보안을 위해)
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      fileName: file.name,
      reason: 'INVALID_TYPE'
    };
  }
  
  // 파일 크기 검사
  if (file.size > maxFileSize) {
    return {
      fileName: file.name,
      reason: 'SIZE_EXCEEDED'
    };
  }
  
  // 모든 검사를 통과한 경우
  return null;
}