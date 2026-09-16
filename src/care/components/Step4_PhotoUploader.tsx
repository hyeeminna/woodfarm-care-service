import React, { useRef, useEffect } from 'react';
import type { UploadedPhoto, UploadError } from '../types';
import { validatePhoto } from '../lib/validatePhoto';
import './Step4_PhotoUploader.css';

export interface Step4_PhotoUploaderProps {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
}

/**
 * Step 4: 사진 업로드 컴포넌트
 * 
 * 특징:
 * - 최대 5장의 사진 업로드 지원
 * - JPEG, PNG, WebP 형식만 허용
 * - 파일당 최대 10MB 제한
 * - 미리보기 기능 제공
 * - 개별 삭제 기능
 * - 유효성 검사 및 에러 표시
 */
export function Step4_PhotoUploader({ photos, onChange }: Step4_PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = React.useState<UploadError[]>([]);

  // 컴포넌트 언마운트 시 Object URL 정리
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, []);

  // 파일 선택 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newErrors: UploadError[] = [];
    const newPhotos: UploadedPhoto[] = [...photos];

    // 파일 개수 제한 확인
    const totalCount = newPhotos.length + files.length;
    if (totalCount > 5) {
      newErrors.push({
        fileName: `${files.length}개 파일`,
        reason: 'COUNT_EXCEEDED'
      });
      setErrors(newErrors);
      // 입력값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    files.forEach(file => {
      // 파일 유효성 검사
      const validationError = validatePhoto(file);
      if (validationError) {
        newErrors.push(validationError);
        return;
      }

      // 유효한 파일인 경우 UploadedPhoto 객체 생성
      const previewUrl = URL.createObjectURL(file);
      const truncatedName = file.name.length > 50 ? file.name.substring(0, 47) + '...' : file.name;
      
      newPhotos.push({
        file,
        previewUrl,
        name: truncatedName
      });
    });

    // 상태 업데이트
    setErrors(newErrors);
    onChange(newPhotos);

    // 입력값 초기화 (같은 파일 재선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 개별 사진 삭제
  const handleDeletePhoto = (index: number) => {
    const photoToDelete = photos[index];
    
    // Object URL 해제
    if (photoToDelete.previewUrl) {
      URL.revokeObjectURL(photoToDelete.previewUrl);
    }

    // 배열에서 제거
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onChange(updatedPhotos);

    // 에러 목록도 정리 (파일명이 일치하는 에러 제거)
    setErrors(prevErrors => 
      prevErrors.filter(error => error.fileName !== photoToDelete.file.name)
    );
  };

  // 파일 선택 버튼 클릭
  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 에러 메시지 생성
  const getErrorMessage = (error: UploadError): string => {
    switch (error.reason) {
      case 'INVALID_TYPE':
        return 'JPEG, PNG, WebP 형식의 파일만 업로드 가능합니다.';
      case 'SIZE_EXCEEDED':
        return '파일 크기는 10MB 이하여야 합니다.';
      case 'COUNT_EXCEEDED':
        return '최대 5장의 사진만 업로드할 수 있습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  };

  // 에러 닫기
  const dismissError = (index: number) => {
    setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
  };

  return (
    <div className="step4-photo-uploader">
      <div className="upload-section">
        <h3>사진 업로드 (선택)</h3>
        <p className="privacy-notice">
          사람의 얼굴, 연락처, 문서 등 개인정보가 포함되지 않은 사진을 권장합니다.
        </p>

        {/* 파일 입력 (숨김) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* 파일 선택 버튼 */}
        {photos.length < 5 && (
          <button
            type="button"
            onClick={handleSelectFiles}
            className="select-files-btn"
          >
            사진 선택 ({photos.length}/5)
          </button>
        )}

        {/* 에러 표시 */}
        {errors.length > 0 && (
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-filename">{error.fileName}</span>
                <span className="error-message">{getErrorMessage(error)}</span>
                <button
                  type="button"
                  onClick={() => dismissError(index)}
                  className="error-dismiss"
                  aria-label="오류 메시지 닫기"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사진 미리보기 */}
      {photos.length > 0 && (
        <div className="preview-section">
          <h4>업로드된 사진 ({photos.length}장)</h4>
          <div className="preview-grid">
            {photos.map((photo, index) => (
              <div key={index} className="preview-item">
                <img
                  src={photo.previewUrl}
                  alt={photo.name}
                  className="preview-image"
                />
                <div className="preview-info">
                  <span className="preview-filename" title={photo.file.name}>
                    {photo.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(index)}
                    className="delete-btn"
                    aria-label={`${photo.name} 삭제`}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      {photos.length === 0 && (
        <div className="no-photo-notice">
          <p>사진을 첨부하지 않아도 견적을 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}

export default Step4_PhotoUploader;