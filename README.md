# 인증번호 발급 및 검증 시스템

이 프로그램은 사용자의 휴대폰 번호로 인증번호를 발급하고, 발급된 인증번호를 검증하는 시스템입니다. AWS SNS와 NAVER Cloud SMS API를 사용하여 메시지를 전송합니다.

## 프로젝트 구조

### 1. 인증번호 발급 (AWS SNS)

**파일**: `pages/api/send-aws-certification.ts`

**설명**: 발급한 인증번호를 AWS SNS를 통해 전송합니다. 인증번호는 데이터베이스에 저장됩니다.

### 2. 인증번호 발급 (NAVER Cloud SMS)

**파일**: `pages/api/send-naver-certification.ts`

**설명**: 발급한 인증번호를 Naver Cloud SMS를 통해 전송합니다. 인증번호는 데이터베이스에 저장됩니다.

### 3. 인증번호 검증

**파일**: `pages/api/validate-certification.ts`

**설명**: 사용자가 입력한 인증번호를 데이터베이스에 저장된 인증번호와 비교하여 검증합니다. 인증이 완료되면 해당 인증 데이터를 삭제합니다.

## 설치 및 사용법

1. **프로젝트 클론 및 종속성 설치**

git clone https://github.com/your-repo/project.git cd project npm install

2. **환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

DB_USER=your_db_user  
DB_PASSWORD=your_db_password  
DB_HOST=your_db_host  
DB_PORT=your_db_port  
DB=your_db_name 

NCLOUD_ACCESS_KEY=your_ncloud_access_key  
NCLOUD_SECRET_KEY=your_ncloud_secret_key  
NCLOUD_SMS_SERVICE_ID=your_ncloud_sms_service_id  
NEXT_PUBLIC_NAVER_SMS_FROM_PHONE_NUMBER=your_naver_sms_from_phone_number  
NEXT_PUBLIC_AWS_SMS_URL=your_aws_sms_url 

3. **서버 실행**

npm run dev

로컬 서버가 실행되고, API 엔드포인트를 통해 인증번호 발급 및 검증 기능을 사용할 수 있습니다.

## 유틸리티

### 인증번호 생성 함수

**파일**: `utils/makeCertNumber.ts`

**설명**: Crypto 라이브러리를 사용해 고유한 6자리 인증번호를 생성합니다.

## 데이터베이스 설정

데이터베이스 연결 설정은 `config/db.ts` 파일에서 이루어집니다. MySQL을 사용하며, 커넥션 풀을 설정하여 데이터베이스에 접근합니다.

## 주의사항

- 이 프로그램은 학습 목적으로 만들어졌으며, 실제 서비스에서는 추가적인 보안 및 예외 처리 로직이 필요할 수 있습니다.
- 환경 변수 설정 시, 중요한 정보는 외부에 노출되지 않도록 주의하세요.
