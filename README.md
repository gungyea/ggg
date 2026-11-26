# 스트레스 펀치 🥊

사진 한 장을 넣으면 그 얼굴이 실사풍 3D 몸에 붙고, 여러 도구로 때리면서 스트레스를 푸는 웹 게임입니다.

- **사진 → 몸 만들기 → 때리기** 3단계
- 몸 조절: 성별, 키(100–220cm), 몸무게(30–200kg, BMI에 따라 체형 변화), 근육, 머리 크기, 머리카락 색, 옷 6종
- 도구 10종: 펀치, 싸대기, 발차기(충전), 잡아 던지기, 고무망치, 방망이, 토마토, 크림 파이, 날계란, 전기 충격
- 물리 래그돌: 맞으면 휘청이고 쓰러졌다가 스스로 일어남 (cannon-es)
- 콤보, 스트레스 게이지, 결과 화면, 화면 흔들림·타격 정지·진동·합성 효과음
- **사진은 기기 밖으로 나가지 않음.** 서버 없이 브라우저에서만 처리
- 외부 CDN을 전혀 쓰지 않음 (three.js, cannon-es, 모델, 텍스처, 소리 모두 사이트 안에 포함)

## 구조

```
public/                  배포되는 정적 사이트 (빌드 단계 없음)
  index.html, css/, js/
  models/{male,female}.glb + .json   블렌더에서 만든 리깅된 몸 + 메타데이터
  vendor/                three.js r170, cannon-es 0.20 (MIT)
tools/blender/build_character.py   3D 몸 생성 스크립트
tools/test/              물리 시뮬레이션 테스트, 브라우저 E2E 테스트
assets-src/              MakeHuman CC0 원본 (메시, 뼈대, 가중치, 체형 타깃)
```

## 3D 모델 다시 만들기

블렌더 4.2 필요.

```
blender -b -P tools/blender/build_character.py -- male public/models/male.glb [preview.png]
blender -b -P tools/blender/build_character.py -- female public/models/female.glb
```

MakeHuman 기본 메시에 성별/인종 타깃을 적용하고, 163개 뼈 가중치를 래그돌용 15개 뼈로 합치고,
체형 셰이프키(fat/thin/muscle), 옷 재질, 얼굴 사진 투영 UV(왼쪽 절반 = 앞얼굴, 오른쪽 절반 = 뒤통수)를 만들어 GLB로 내보냅니다.

## 실행 / 테스트

```
npm run serve            # http://localhost:8765
npm run test:physics     # 서기·맞기·쓰러짐·일어남 안정성 (node)
npm run test:e2e         # playwright, 서버 실행 중일 때
```

## 배포 (Cloudflare Pages)

```
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npm run deploy
```

## 라이선스 / 출처

- 사람 메시·뼈대·체형 타깃: [MakeHuman](http://www.makehumancommunity.org) 에셋, CC0 1.0
- three.js (MIT), cannon-es (MIT)

## 얼굴 자동 맞춤

`public/vendor/mediapipe/`의 MediaPipe Face Landmarker(Apache 2.0)가 브라우저 안에서 사진의 얼굴 점 478개를 찾습니다.
같은 점들을 3D 머리 정면 렌더에서도 미리 찾아 `models/<성별>.json`의 `mesh`에 저장해 두었고,
게임은 사진을 삼각형 단위로 변형해 두 점 집합을 일치시킵니다.

모델을 다시 만든 뒤에는 기준점도 다시 만들어야 합니다.

```
blender -b -P tools/blender/render_face_template.py -- public/models/male.glb /tmp/tmpl-male.png
python3 tools/face_template.py /tmp/tmpl-male.png public/models/male.json face_landmarker.task
```
