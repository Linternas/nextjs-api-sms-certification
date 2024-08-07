import { randomBytes } from 'crypto';

export const makeRandomCertNumber = (): string => {
  // crypto 모듈의 randomBytes 메서드를 사용하여 랜덤 숫자 생성
  const bytes = randomBytes(3);
  const number = parseInt(bytes.toString('hex'), 16);
  const certNum = number.toString().substring(0, 6);
  return certNum;
};
