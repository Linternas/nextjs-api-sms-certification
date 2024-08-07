import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { env } from 'process';
import { makeRandomCertNumber } from '../../../utils/makeCertNumber'; // 함수 import

const makeSignature = (timestamp: string): string => {
  const space = ' ';
  const newLine = '\n';
  const method = 'POST';
  const url = `/sms/v2/services/${env.NCLOUD_SMS_SERVICE_ID}/messages`;
  const accessKey = env.NCLOUD_ACCESS_KEY || '';
  const secretKey = env.NCLOUD_SECRET_KEY || '';

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  return hmac.finalize().toString(CryptoJS.enc.Base64);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(404).json({ message: '요청하신 페이지를 찾을 수 없습니다.' });
    return;
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400).json({ message: '휴대폰 번호가 없습니다.' });
    return;
  }

  const timestamp = Date.now().toString();
  const certNum = makeRandomCertNumber();

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': env.NCLOUD_ACCESS_KEY,
    'x-ncp-apigw-signature-v2': makeSignature(timestamp),
  };

  const smsBody = {
    type: 'SMS',
    contentType: 'COMM',
    countryCode: '82',
    from: env.NEXT_PUBLIC_NAVER_SMS_FROM_PHONE_NUMBER,
    content: `[이어] 인증번호 [${certNum}]를 입력해주세요`,
    messages: [
      {
        to: phoneNumber,
      },
    ],
  };

  try {
    const response = await axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${env.NCLOUD_SMS_SERVICE_ID}/messages`, smsBody, { headers });
    res.status(200).json({ code: certNum, message: '메시지를 성공적으로 보냈습니다.' });
  } catch (error) {
    console.error('메시지 전송 실패', error.response ? error.response.data : error.message);
    res.status(500).json({ message: '메시지 전송에 실패했습니다.' });
  }
}
