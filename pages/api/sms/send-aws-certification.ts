import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../config/db'; // 커넥션 풀
import AWS from 'aws-sdk';
import { makeRandomCertNumber } from '../../../utils/makeCertNumber';

AWS.config.update({ region: 'us-east-1' }); // 미국 오하이오 리전

const deleteCertificationData = async (phoneNumber: string): Promise<void> => {
  const query = `DELETE FROM mobile_certification WHERE phoneNumber = ?`;
  await db.query(query, [phoneNumber]);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(404).json({ message: '요청하신 페이지를 찾을 수 없습니다.' });
    return;
  }

  const { phoneNumber, hashKey = '' } = req.body;

  if (!phoneNumber) {
    res.status(400).json({ code: '1002', message: '휴대폰 번호가 없습니다.' });
    return;
  }

  const certNum = makeRandomCertNumber();
  const timestamp = Date.now();
  const expireTime = timestamp + 310000;

  const message = hashKey === '' ? `[이어] 인증번호 [${certNum}]를 입력해주세요.` : `<#> [이어] 인증번호 [${certNum}]를 입력해주세요. ${hashKey}`;

  const params = {
    Message: message,
    PhoneNumber: '+82' + phoneNumber,
  };

  try {
    const data = await new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    await deleteCertificationData(phoneNumber);

    const insertQuery = `INSERT INTO mobile_certification(phoneNumber, cert_num, expire_time) VALUES (?, ?, ?)`;
    await db.query(insertQuery, [phoneNumber, certNum, expireTime]);

    res.status(200).json({ certNum, message: '메시지를 성공적으로 보냈습니다.' });
  } catch (err) {
    console.error('메시지 전송 실패', err);
    res.status(500).json({ code: '1000', message: 'AWS에 메시지 전송 실패', userMessage: '메시지 전송 실패' });
  }
}
