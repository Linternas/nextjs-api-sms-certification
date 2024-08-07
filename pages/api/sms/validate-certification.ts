import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../config/db';

const deleteCertificationData = async (phoneNumber: string): Promise<void> => {
  const query = 'DELETE FROM mobile_certification WHERE phoneNumber = ?';
  await db.query(query, [phoneNumber]);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(404).json({ message: '요청하신 페이지를 찾을 수 없습니다.' });
    return;
  }

  const { phoneNumber, certNum } = req.body;

  if (!phoneNumber) {
    res.status(500).json({ message: '휴대폰 번호가 제공되지 않았습니다.' });
    return;
  }

  if (!certNum) {
    res.status(500).json({ code: '1002', field: 'certNum', message: '인증 번호가 제공되지 않았습니다.' });
    return;
  }

  try {
    const query = 'SELECT * FROM mobile_certification WHERE phoneNumber = ?';
    const [rows] = await db.query(query, [phoneNumber]);

    if (rows.length === 0) {
      res.status(500).json({ code: '1003', ok: false, message: '인증 데이터를 찾을 수 없습니다.' });
      return;
    }

    const certificationData = rows[0];
    const timestamp = Date.now();

    if (certificationData.expire_time < timestamp) {
      await deleteCertificationData(phoneNumber);
      res.status(500).json({ code: '1001', ok: false, message: '인증 시간이 초과되었습니다.' });
      return;
    }

    if (certificationData.cert_num === certNum) {
      await deleteCertificationData(phoneNumber);
      res.status(200).json({ ok: true, message: '인증이 성공적으로 완료되었습니다.' });
    } else {
      res.status(500).json({ code: '1000', ok: false, message: '인증 번호가 일치하지 않습니다.' });
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 실패', err);
    res.status(500).json({ code: '1004', message: '데이터베이스 오류가 발생했습니다.' });
  }
}
