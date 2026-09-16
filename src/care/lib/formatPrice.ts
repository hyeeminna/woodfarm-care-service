/**
 * 견적 금액을 사용자 친화적인 형식으로 포맷팅합니다.
 * 
 * @param min 최소 금액 (원 단위)
 * @param max 최대 금액 (원 단위)
 * @returns 포맷된 가격 범위 문자열
 * 
 * @example
 * formatPriceRange(250000, 320000) // "약 25~32만 원"
 * formatPriceRange(300000, 300000) // "약 30만 원"
 */
export function formatPriceRange(min: number, max: number): string {
  const minMan = min / 10000;
  const maxMan = max / 10000;
  
  // 소수점을 적절히 포맷팅 (정수면 정수로, 소수면 소수로)
  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toString() : num.toString();
  };
  
  return minMan === maxMan
    ? `약 ${formatNumber(minMan)}만 원`
    : `약 ${formatNumber(minMan)}~${formatNumber(maxMan)}만 원`;
}