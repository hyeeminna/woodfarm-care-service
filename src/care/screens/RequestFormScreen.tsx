import React, { useState, useEffect } from 'react';
import type { EstimateFormData, EstimateResult, VisitRequest, VisitRequestFormFields, FormErrors, SpaceType, AppAction } from '../types';
import { validateName } from '../lib/validateName';
import { validatePhone } from '../lib/validatePhone';

interface RequestFormScreenProps {
  formData: EstimateFormData;
  result: EstimateResult;
  onAction: (action: AppAction) => void;
}

/**
 * 방문견적 신청 폼 화면 컴포넌트
 * 
 * 사용자 연락처 및 공간 정보를 입력받아 무료 방문견적을 신청합니다.
 * 
 * Requirements:
 * - 11.1: 필수/선택 필드 제공 (담당자명, 업체명, 연락처, 공간유형, 방문지역, 문의사항, 개인정보동의)
 * - 11.2: 공간 유형 선택지 제공 (사무실, 카페, 음식점, 병원, 학원, 기타)
 * - 11.3: 이름/업체명 공백 문자 유효성 검사
 * - 11.4: 연락처 숫자+하이픈 형식 검사
 * - 11.5: 필수 항목 및 동의 체크 확인
 * - 11.6: 견적 데이터 자동 포함하여 VisitRequest 구성
 * - 11.7: MVP 데모 안내 표시
 * - 11.8: 콘솔 출력 후 완료 화면 이동
 * - 14.1, 14.2: 접근성 (label, aria-invalid, aria-describedby)
 * - 15.4, 15.5, 15.6: 오류 처리 및 피드백
 */
export function RequestFormScreen({ formData, result, onAction }: RequestFormScreenProps) {
  const [formFields, setFormFields] = useState<VisitRequestFormFields>({
    managerName: '',
    companyName: '',
    phone: '',
    spaceType: 'OFFICE' as SpaceType,
    region: '',
    inquiry: '',
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof VisitRequestFormFields, boolean>>>({});

  // 공간 유형 선택지 (한국어 표시명과 내부 값)
  const spaceTypeOptions: { value: SpaceType; label: string }[] = [
    { value: 'OFFICE', label: '사무실' },
    { value: 'CAFE', label: '카페' },
    { value: 'RESTAURANT', label: '음식점' },
    { value: 'HOSPITAL', label: '병원' },
    { value: 'ACADEMY', label: '학원' },
    { value: 'OTHER', label: '기타' },
  ];

  // 필드 유효성 검사
  const validateField = (fieldName: keyof VisitRequestFormFields, value: any): string | undefined => {
    switch (fieldName) {
      case 'managerName':
        return !validateName(value as string) ? '담당자명은 공백만으로 구성될 수 없습니다.' : undefined;
      case 'companyName':
        return !validateName(value as string) ? '업체명은 공백만으로 구성될 수 없습니다.' : undefined;
      case 'phone':
        return !validatePhone(value as string) ? '연락처는 숫자와 하이픈(-)만 입력할 수 있습니다.' : undefined;
      case 'region':
        return !validateName(value as string) ? '방문 지역을 입력해주세요.' : undefined;
      default:
        return undefined;
    }
  };

  // 전체 폼 유효성 검사
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // 필수 필드 검사
    const requiredFields: (keyof VisitRequestFormFields)[] = ['managerName', 'companyName', 'phone', 'region'];
    
    for (const field of requiredFields) {
      const error = validateField(field, formFields[field]);
      if (error) {
        newErrors[field] = error;
      }
    }

    return newErrors;
  };

  // 제출 가능 여부 확인
  const canSubmit = (): boolean => {
    const currentErrors = validateForm();
    const hasErrors = Object.keys(currentErrors).length > 0;
    return !hasErrors && formFields.privacyConsent;
  };

  // 필드 값 변경 처리
  const handleFieldChange = (fieldName: keyof VisitRequestFormFields, value: any) => {
    setFormFields(prev => ({ ...prev, [fieldName]: value }));
    
    // 실시간 유효성 검사 (터치된 필드만)
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  // 필드 blur 처리
  const handleFieldBlur = (fieldName: keyof VisitRequestFormFields) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const error = validateField(fieldName, formFields[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 모든 필드를 터치됨으로 표시
    const allTouched = Object.keys(formFields).reduce((acc, key) => {
      acc[key as keyof VisitRequestFormFields] = true;
      return acc;
    }, {} as Partial<Record<keyof VisitRequestFormFields, boolean>>);
    setTouched(allTouched);
    
    // 최종 유효성 검사
    const finalErrors = validateForm();
    setErrors(finalErrors);
    
    if (Object.keys(finalErrors).length === 0 && formFields.privacyConsent) {
      // VisitRequest 객체 구성
      const visitRequest: VisitRequest = {
        ...formFields,
        formData,
        result,
        submittedAt: new Date().toISOString(),
      };

      // 콘솔에 출력 (MVP 데모)
      console.log('방문견적 신청 데이터:', visitRequest);
      
      // 완료 화면으로 이동
      onAction({ type: 'SUBMIT_REQUEST', visitRequest });
    }
  };

  // 이전 버튼 처리
  const handleBack = () => {
    onAction({ type: 'GO_BACK' });
  };

  const styles = {
    screen: {
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '20px',
    } as React.CSSProperties,
    
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    } as React.CSSProperties,
    
    header: {
      marginBottom: '32px',
      textAlign: 'center',
    } as React.CSSProperties,
    
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#2b2d42',
      margin: '0 0 8px 0',
    } as React.CSSProperties,
    
    subtitle: {
      fontSize: '16px',
      color: '#6c757d',
      margin: 0,
    } as React.CSSProperties,
    
    mvpNotice: {
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '24px',
      fontSize: '14px',
      color: '#856404',
    } as React.CSSProperties,
    
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    } as React.CSSProperties,
    
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    } as React.CSSProperties,
    
    label: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#2b2d42',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    } as React.CSSProperties,
    
    required: {
      color: '#e74c3c',
      fontSize: '14px',
    } as React.CSSProperties,
    
    input: {
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.2s ease',
    } as React.CSSProperties,
    
    inputError: {
      borderColor: '#e74c3c',
      background: '#fef7f7',
    } as React.CSSProperties,
    
    textarea: {
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '16px',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s ease',
    } as React.CSSProperties,
    
    select: {
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '16px',
      background: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease',
    } as React.CSSProperties,
    
    errorMessage: {
      fontSize: '14px',
      color: '#e74c3c',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    } as React.CSSProperties,
    
    checkboxGroup: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '2px solid #e9ecef',
    } as React.CSSProperties,
    
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
    } as React.CSSProperties,
    
    checkboxLabel: {
      fontSize: '14px',
      color: '#2b2d42',
      cursor: 'pointer',
      lineHeight: 1.5,
      flex: 1,
    } as React.CSSProperties,
    
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    } as React.CSSProperties,
    
    button: {
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
    } as React.CSSProperties,
    
    backButton: {
      background: '#e9ecef',
      color: '#495057',
      flex: '0 0 auto',
    } as React.CSSProperties,
    
    submitButton: {
      background: '#6c5ce7',
      color: 'white',
      flex: 1,
    } as React.CSSProperties,
    
    submitButtonDisabled: {
      background: '#adb5bd',
      color: '#6c757d',
      cursor: 'not-allowed',
    } as React.CSSProperties,
  };

  // 반응형 스타일
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  if (isMobile) {
    styles.container.padding = '24px 20px';
    styles.screen.padding = '16px';
    styles.buttonGroup.flexDirection = 'column';
    styles.backButton.flex = '1';
  }

  return (
    <div style={styles.screen}>
      <div style={styles.container}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h1 style={styles.title}>무료 방문견적 신청</h1>
          <p style={styles.subtitle}>연락처와 공간 정보를 입력해주시면 전문가가 방문하여 정확한 견적을 안내드립니다.</p>
        </div>

        {/* MVP 데모 안내 */}
        <div style={styles.mvpNotice}>
          현재 화면은 MVP 데모이며 실제 접수 기능은 추후 연결 예정입니다.
        </div>

        {/* 폼 */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* 담당자명 (필수) */}
          <div style={styles.fieldGroup}>
            <label htmlFor="managerName" style={styles.label}>
              담당자명 <span style={styles.required}>*</span>
            </label>
            <input
              id="managerName"
              type="text"
              value={formFields.managerName}
              onChange={(e) => handleFieldChange('managerName', e.target.value)}
              onBlur={() => handleFieldBlur('managerName')}
              style={{
                ...styles.input,
                ...(errors.managerName ? styles.inputError : {}),
              }}
              aria-invalid={errors.managerName ? 'true' : 'false'}
              aria-describedby={errors.managerName ? 'managerName-error' : undefined}
              placeholder="담당자 성함을 입력해주세요"
            />
            {errors.managerName && (
              <div id="managerName-error" style={styles.errorMessage} role="alert">
                ⚠️ {errors.managerName}
              </div>
            )}
          </div>

          {/* 업체명 (필수) */}
          <div style={styles.fieldGroup}>
            <label htmlFor="companyName" style={styles.label}>
              업체명 또는 공간명 <span style={styles.required}>*</span>
            </label>
            <input
              id="companyName"
              type="text"
              value={formFields.companyName}
              onChange={(e) => handleFieldChange('companyName', e.target.value)}
              onBlur={() => handleFieldBlur('companyName')}
              style={{
                ...styles.input,
                ...(errors.companyName ? styles.inputError : {}),
              }}
              aria-invalid={errors.companyName ? 'true' : 'false'}
              aria-describedby={errors.companyName ? 'companyName-error' : undefined}
              placeholder="회사명 또는 공간명을 입력해주세요"
            />
            {errors.companyName && (
              <div id="companyName-error" style={styles.errorMessage} role="alert">
                ⚠️ {errors.companyName}
              </div>
            )}
          </div>

          {/* 연락처 (필수) */}
          <div style={styles.fieldGroup}>
            <label htmlFor="phone" style={styles.label}>
              연락처 <span style={styles.required}>*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formFields.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              style={{
                ...styles.input,
                ...(errors.phone ? styles.inputError : {}),
              }}
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              placeholder="010-1234-5678"
            />
            {errors.phone && (
              <div id="phone-error" style={styles.errorMessage} role="alert">
                ⚠️ {errors.phone}
              </div>
            )}
          </div>

          {/* 공간 유형 (필수) */}
          <div style={styles.fieldGroup}>
            <label htmlFor="spaceType" style={styles.label}>
              공간 유형 <span style={styles.required}>*</span>
            </label>
            <select
              id="spaceType"
              value={formFields.spaceType}
              onChange={(e) => handleFieldChange('spaceType', e.target.value as SpaceType)}
              style={styles.select}
            >
              {spaceTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 방문 지역 (필수) */}
          <div style={styles.fieldGroup}>
            <label htmlFor="region" style={styles.label}>
              방문 지역 <span style={styles.required}>*</span>
            </label>
            <input
              id="region"
              type="text"
              value={formFields.region}
              onChange={(e) => handleFieldChange('region', e.target.value)}
              onBlur={() => handleFieldBlur('region')}
              style={{
                ...styles.input,
                ...(errors.region ? styles.inputError : {}),
              }}
              aria-invalid={errors.region ? 'true' : 'false'}
              aria-describedby={errors.region ? 'region-error' : undefined}
              placeholder="서울시 강남구, 경기도 성남시 등"
            />
            {errors.region && (
              <div id="region-error" style={styles.errorMessage} role="alert">
                ⚠️ {errors.region}
              </div>
            )}
          </div>

          {/* 문의사항 (선택) */}
          <div style={styles.fieldGroup}>
            <label htmlFor="inquiry" style={styles.label}>
              문의사항 (선택)
            </label>
            <textarea
              id="inquiry"
              value={formFields.inquiry}
              onChange={(e) => handleFieldChange('inquiry', e.target.value)}
              style={styles.textarea}
              placeholder="추가 문의사항이나 특이사항이 있으시면 입력해주세요"
            />
          </div>

          {/* 개인정보 동의 (필수) */}
          <div style={styles.checkboxGroup}>
            <input
              id="privacyConsent"
              type="checkbox"
              checked={formFields.privacyConsent}
              onChange={(e) => handleFieldChange('privacyConsent', e.target.checked)}
              style={styles.checkbox}
              required
            />
            <label htmlFor="privacyConsent" style={styles.checkboxLabel}>
              개인정보 수집·이용에 동의합니다. <span style={styles.required}>*</span>
              <br />
              <small style={{ color: '#6c757d' }}>
                수집항목: 담당자명, 업체명, 연락처, 공간정보 / 이용목적: 방문견적 서비스 제공 / 보관기간: 서비스 완료 후 1년
              </small>
            </label>
          </div>

          {/* 버튼 그룹 */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                ...styles.button,
                ...styles.backButton,
              }}
            >
              이전
            </button>
            <button
              type="submit"
              disabled={!canSubmit()}
              style={{
                ...styles.button,
                ...styles.submitButton,
                ...(canSubmit() ? {} : styles.submitButtonDisabled),
              }}
            >
              무료 방문견적 신청
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}