import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Step4_PhotoUploader } from './Step4_PhotoUploader';
import type { UploadedPhoto } from '../types';

// Object URL 모킹
const mockObjectURL = 'mock-object-url';
const mockCreateObjectURL = vi.fn(() => mockObjectURL);
const mockRevokeObjectURL = vi.fn();

Object.defineProperty(global.URL, 'createObjectURL', {
  value: mockCreateObjectURL,
});

Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
});

describe('Step4_PhotoUploader', () => {
  const mockOnChange = vi.fn();

  // 테스트용 파일 생성 헬퍼
  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('빈 상태에서 올바르게 렌더링된다', () => {
    render(<Step4_PhotoUploader photos={[]} onChange={mockOnChange} />);

    expect(screen.getByText('사진 업로드 (선택)')).toBeInTheDocument();
    expect(screen.getByText(/사람의 얼굴, 연락처, 문서 등/)).toBeInTheDocument();
    expect(screen.getByText('사진 선택 (0/5)')).toBeInTheDocument();
    expect(screen.getByText('사진 없이 견적 보기')).toBeInTheDocument();
    expect(screen.queryByText('다음')).not.toBeInTheDocument();
  });

  it('사진이 있을 때 다음 버튼을 표시한다', () => {
    const mockPhotos: UploadedPhoto[] = [
      {
        file: createMockFile('test.jpg', 'image/jpeg', 1000),
        previewUrl: 'mock-url',
        name: 'test.jpg'
      }
    ];

    render(<Step4_PhotoUploader photos={mockPhotos} onChange={mockOnChange} />);

    expect(screen.getByText('다음')).toBeInTheDocument();
    expect(screen.queryByText('사진 없이 견적 보기')).not.toBeInTheDocument();
  });

  it('개인정보 보호 안내를 표시한다', () => {
    render(<Step4_PhotoUploader photos={[]} onChange={mockOnChange} />);
    
    expect(screen.getByText('사람의 얼굴, 연락처, 문서 등 개인정보가 포함되지 않은 사진을 권장합니다.')).toBeInTheDocument();
  });

  it('사진 개수를 올바르게 표시한다', () => {
    const mockPhotos: UploadedPhoto[] = [
      {
        file: createMockFile('test1.jpg', 'image/jpeg', 1000),
        previewUrl: 'mock-url-1',
        name: 'test1.jpg'
      },
      {
        file: createMockFile('test2.jpg', 'image/jpeg', 2000),
        previewUrl: 'mock-url-2',
        name: 'test2.jpg'
      }
    ];

    render(<Step4_PhotoUploader photos={mockPhotos} onChange={mockOnChange} />);

    expect(screen.getByText('사진 선택 (2/5)')).toBeInTheDocument();
    expect(screen.getByText('업로드된 사진 (2장)')).toBeInTheDocument();
  });

  it('최대 5장일 때 선택 버튼을 숨긴다', () => {
    const mockPhotos: UploadedPhoto[] = Array.from({ length: 5 }, (_, i) => ({
      file: createMockFile(`test${i}.jpg`, 'image/jpeg', 1000),
      previewUrl: `mock-url-${i}`,
      name: `test${i}.jpg`
    }));

    render(<Step4_PhotoUploader photos={mockPhotos} onChange={mockOnChange} />);

    expect(screen.queryByText(/사진 선택/)).not.toBeInTheDocument();
  });

  it('파일 입력이 올바른 속성을 가진다', () => {
    render(<Step4_PhotoUploader photos={[]} onChange={mockOnChange} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    expect(fileInput.accept).toBe('image/jpeg,image/png,image/webp');
    expect(fileInput.multiple).toBe(true);
    expect(fileInput.style.display).toBe('none');
  });

  it('사진 미리보기를 올바르게 표시한다', () => {
    const mockPhotos: UploadedPhoto[] = [
      {
        file: createMockFile('test-image.jpg', 'image/jpeg', 1000),
        previewUrl: 'mock-preview-url',
        name: 'test-image.jpg'
      }
    ];

    render(<Step4_PhotoUploader photos={mockPhotos} onChange={mockOnChange} />);

    const previewImage = screen.getByAltText('test-image.jpg');
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute('src', 'mock-preview-url');
    
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByLabelText('test-image.jpg 삭제')).toBeInTheDocument();
  });

  it('삭제 버튼 클릭 시 onChange가 호출된다', () => {
    const mockPhotos: UploadedPhoto[] = [
      {
        file: createMockFile('test.jpg', 'image/jpeg', 1000),
        previewUrl: 'mock-url',
        name: 'test.jpg'
      }
    ];

    render(<Step4_PhotoUploader photos={mockPhotos} onChange={mockOnChange} />);

    const deleteButton = screen.getByLabelText('test.jpg 삭제');
    fireEvent.click(deleteButton);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('컴포넌트 언마운트 시 Object URL을 정리한다', () => {
    const mockPhotos: UploadedPhoto[] = [
      {
        file: createMockFile('test1.jpg', 'image/jpeg', 1000),
        previewUrl: 'mock-url-1',
        name: 'test1.jpg'
      },
      {
        file: createMockFile('test2.jpg', 'image/jpeg', 2000),
        previewUrl: 'mock-url-2',
        name: 'test2.jpg'
      }
    ];

    const { unmount } = render(
      <Step4_PhotoUploader photos={mockPhotos} onChange={mockOnChange} />
    );

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url-1');
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url-2');
  });
});