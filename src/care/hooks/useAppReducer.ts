import { useReducer } from 'react';
import {
  AppState,
  AppAction,
  EstimateFormData,
  ScreenState,
} from '../types';

// ── 초기 상태 값 ──────────────────────────────────────────

export const INITIAL_FORM_DATA: EstimateFormData = {
  companySize: null,
  furniture: [],
  services: [],
  photos: [],
};

export const INITIAL_APP_STATE: AppState = {
  currentScreen: 'LANDING',
  formData: INITIAL_FORM_DATA,
  result: null,
};

// ── AppState Reducer ──────────────────────────────────────

function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_ESTIMATE':
      return {
        ...state,
        currentScreen: 'STEP1',
      };

    case 'UPDATE_FORM':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };

    case 'GO_TO_STEP':
      const stepScreenMap: Record<1 | 2 | 3 | 4, ScreenState> = {
        1: 'STEP1',
        2: 'STEP2',
        3: 'STEP3',
        4: 'STEP4',
      };
      return {
        ...state,
        currentScreen: stepScreenMap[action.step],
      };

    case 'SUBMIT_STEP':
      const nextScreenMap: Record<1 | 2 | 3 | 4, ScreenState> = {
        1: 'STEP2',
        2: 'STEP3',
        3: 'STEP4',
        4: 'LOADING',
      };
      return {
        ...state,
        currentScreen: nextScreenMap[action.step],
      };

    case 'GO_BACK':
      const backScreenMap: Record<ScreenState, ScreenState> = {
        LANDING: 'LANDING',
        STEP1: 'LANDING',
        STEP2: 'STEP1',
        STEP3: 'STEP2',
        STEP4: 'STEP3',
        LOADING: 'STEP4',
        RESULT: 'STEP4',
        REQUEST_FORM: 'RESULT',
        COMPLETE: 'REQUEST_FORM',
      };
      return {
        ...state,
        currentScreen: backScreenMap[state.currentScreen],
      };

    case 'SHOW_LOADING':
      return {
        ...state,
        currentScreen: 'LOADING',
      };

    case 'SHOW_RESULT':
      return {
        ...state,
        currentScreen: 'RESULT',
        result: action.result,
      };

    case 'GO_TO_REQUEST_FORM':
      return {
        ...state,
        currentScreen: 'REQUEST_FORM',
      };

    case 'SUBMIT_REQUEST':
      // MVP에서는 실제 외부 전송하지 않고 콘솔 출력만
      console.log('방문견적 신청 데이터:', action.visitRequest);
      return {
        ...state,
        currentScreen: 'COMPLETE',
      };

    case 'RESET_ALL':
      return {
        ...INITIAL_APP_STATE,
        currentScreen: 'LANDING',
      };

    case 'RESET_AND_RETRY':
      return {
        ...state,
        currentScreen: 'STEP1',
        result: null,
        // formData는 유지
      };

    default:
      return state;
  }
}

// ── useAppReducer 커스텀 훅 ────────────────────────────────

export function useAppReducer() {
  const [state, dispatch] = useReducer(appStateReducer, INITIAL_APP_STATE);

  return { state, dispatch };
}