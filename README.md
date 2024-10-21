# Translators-react

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 소개

이 프로젝트는 여러 번역기를 한 번에 사용하고, 여러 언어로 동시에 번역할 수 있는 기능을 제공하는 웹 애플리케이션입니다. 사용자가 손쉽고 빠르게 원하는 언어로 문서를 번역할 수 있도록 설계되었습니다. 이 프로젝트는 제가 웹 프로그래밍을 배우고 처음 만든 앱이자, 지금도 호스팅하고 있는 가장 애착이 가는 앱입니다.

### *중요: 2024/10/21부터 AWS를 활용한 서버리스 아키텍쳐로 전환을 시작합니다.  
파일구조, 코드, 형상관리 방식 등이 대폭 변경될 예정입니다.

### <아키텍쳐 계획>  
frontend: cloudfront + S3 / React  
backend: API gateway + lambda  
DB: DynamoDB  
User 관리: Cognito(user pool) + JWT  
형상관리: Github, Github actions  


## 데모

- [Live 링크](https://www.translators24.com)

- 데모 비디오:  
  [![Watch the video](https://img.youtube.com/vi/XX2z8tZk0eI/0.jpg)](https://youtu.be/XX2z8tZk0eI)


## 주요 기능

- 여러 번역기의 번역 결과를 한 번에 확인 (Papago, Google, DeepL 지원)
- 번역 기록 저장 및 복사 기능 제공
- SPT (Speech To Text), TTS (Text To Speech) 기능 제공
- 디바운싱을 활용한 실시간 번역
- ChatGPT 기반의 Chatbot 시스템
- 익명 사용자 사용량 추적
- 간단한 Layer7 방어 기능 제공

## 기술 스택

- **프론트엔드**: React, Next.js, Typescript, Redux Toolkit, Tailwind CSS
- **백엔드**: Node.js, Express.js
- **데이터베이스**: MongoDB (세션 저장소)
- **네트워크**: HTTPS, WebSocket
- **호스팅**: AWS (EC2, ALB, Route53)

## 설치 및 실행 방법

```bash
# 리포지토리 클론
git clone https://github.com/cuziam/Translators-react.git

# 프로젝트 디렉토리로 이동
cd Translators-react

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 브랜치 전략

이 리포지토리는 기능 개발 및 안정적인 배포를 위해 Git Flow에 기반한 브랜치 전략을 사용합니다. 특히, develop 브랜치에서 기능 브랜치를 rebase하여 작업함으로써 병합 과정이 한눈에 보이지 않는 문제를 줄이고, 코드의 일관성을 유지하려고 노력하고 있습니다:

- **main**: 프로덕션 준비가 된 안정된 코드가 포함됩니다.
- **develop**: 다음 릴리스를 준비하는 데 사용되는 브랜치입니다. 새로운 기능과 변경 사항은 develop 브랜치에서 통합됩니다.
- **feature/\***: 새로운 기능을 개발하기 위한 브랜치입니다. develop 브랜치에서 파생되며, 작업이 완료되면 develop 브랜치로 병합됩니다.
- **bugfix/\***: 버그 수정을 위한 브랜치입니다. develop 브랜치에서 파생되며, 수정 후 develop에 병합됩니다.
- **release/\***: 다음 버전을 준비하는 동안 사용됩니다. 배포 전 마지막 테스트와 수정을 이 브랜치에서 진행합니다.
- **hotfix/\***: 프로덕션에서 발생한 긴급한 문제를 해결하기 위한 브랜치입니다. main에서 파생되어 수정 후 main과 develop에 병합됩니다.

브랜치 구조와 역할에 대해 명확하게 설정하여 팀 협업을 원활하게 하고, 코드의 안정성을 유지하기 위해 노력하고 있습니다.

## 프로젝트 구조

```bash
📦 Translators-react
 ┣ 📂 __test__                    # 테스트 파일들을 위한 디렉토리
 ┣ 📂 public                     # 정적 파일 (이미지, HTML 파일 등)이 위치한 디렉토리
 ┣ 📂 reference                  # 디자인 및 리소스 관련 참고 자료들이 저장된 디렉토리
 ┃ ┣ 📂 figma                    # Figma 파일 저장소
 ┃ ┣ 📂 fonts                    # 프로젝트에서 사용되는 폰트 파일들
 ┃ ┣ 📂 logos                    # 로고 이미지들
 ┃ ┣ 📂 styles                   # 스타일 참조 파일들
 ┃ ┗ 📂 ui_reference             # UI 참조 자료들
 ┃ ┃ ┣ 📜 Translators Prototype.fig # Figma 프로토타입 파일
 ┃ ┃ ┣ 📜 Translators Prototype.pdf # 프로토타입 PDF 파일
 ┃ ┃ ┗ 📜 loading.webp            # 로딩 애니메이션 파일
 ┣ 📂 src                        # 소스 파일 디렉토리
 ┃ ┣ 📂 client                   # 프론트엔드 관련 파일들
 ┃ ┃ ┣ 📂 components             # 재사용 가능한 컴포넌트 모음
 ┃ ┃ ┣ 📂 data                   # 데이터와 관련된 파일들
 ┃ ┃ ┣ 📂 store                  # 전역 상태 관리 관련 파일들
 ┃ ┃ ┣ 📜 App.tsx                # 애플리케이션의 메인 컴포넌트
 ┃ ┃ ┣ 📜 main.tsx               # 엔트리 포인트
 ┃ ┃ ┗ 📜 index.css              # 전체 스타일 파일
 ┃ ┣ 📂 server                   # 백엔드 관련 파일들
 ┃ ┃ ┣ 📂 voices                 # 음성 파일 및 처리 관련 파일들
 ┃ ┃ ┣ 📜 clientMessageHandler.js # 클라이언트 메시지 처리
 ┃ ┃ ┣ 📜 errorhandler.js        # 에러 핸들링 관련 파일
 ┃ ┃ ┣ 📜 sessionhandler.js      # 세션 처리 파일
 ┃ ┃ ┣ 📜 transcriptionHandler.js # 음성 텍스트 변환 핸들러
 ┃ ┃ ┣ 📜 translate.js           # 번역 관련 기능 파일
 ┃ ┃ ┣ 📜 translateHandler.js    # 번역 요청 핸들러
 ┃ ┃ ┣ 📜 ttsRequestHandler.js   # TTS 요청 핸들러
 ┃ ┃ ┗ 📜 util.js                # 유틸리티 함수 모음
 ┣ 📜 app.js                     # 서버 시작 파일
 ┣ 📜 index.html                 # 기본 HTML 파일
 ┣ 📜 package.json               # 프로젝트 종속성 및 스크립트 관리
 ┣ 📜 tailwind.config.js         # Tailwind CSS 설정 파일
 ┣ 📜 vite.config.ts             # Vite 빌드 도구 설정 파일
 ┗ 📜 README.md                  # 프로젝트 정보 문서
```

## 기여 방법

1. 이 리포지토리를 Fork합니다.
2. 새로운 브랜치를 만듭니다 (`git checkout -b feature/새로운기능`).
3. 변경 사항을 커밋합니다 (`git commit -m '새로운 기능 추가'`).
4. 브랜치에 푸시합니다 (`git push origin feature/새로운기능`).
5. Pull Request를 만듭니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

## 배포 및 운영

- **AWS EC2**: 기본 애플리케이션 서버로 사용되며 필요에 따라 확장 가능
- **Elastic Load Balancer (ALB)**: 트래픽 증가 시 부하 분산 적용
- **Route53**: 안정적인 도메인 접근을 위한 DNS 관리
- **HTTPS 적용**: AWS Certificate Manager (ACM)을 통해 HTTPS 통신 적용

## 문의

궁금한 점이 있거나 문제가 발생했을 경우 [yameame320@gmail.com](mailto:yameame320@gmail.com)으로 연락하거나, Issue 탭에 남겨주세요.
