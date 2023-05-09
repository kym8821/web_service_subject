# 웹클라이언트 컴퓨팅 과제
20201438 김용민
<br>

# 1. 웹 서비스 개요

## 1-1. 웹 서비스 설명

### (1). 주변 식당에 대한 정보를 다양한 서비스에서 빠르게 접근할 수 있도록 한다.

### (2). 공정하고 많은 공감을 얻을 수 있는 리뷰를 작성할 수 있도록 한다.

- 이를 위해 포인트 시스템을 도입하여 공감을 얻을 수 있는 댓글을 작성할 수 있도록 유도한다.

<br>

# 2. 웹 서비스 기능

## 2-1. 회원가입 기능

### (1). 데이터베이스에 사용자 정보 저장

- 이 때, 사용자 고유 id, 아이디, 비밀번호, 이름, email이 저장됨.

### (2). 회원가입 시 사용자가 입력한 아이디와 같은 계정이 db에 있다면, 회원가입 거부

## 2-2. 로그인 기능

### (1). 데이터베이스에서 사용자의 입력 정보와 일치하는 데이터가 있다면, 로그인 처리

### (2). 로그인 하지 않고 사용자 정보가 필요한 작업을 한다면, 로그인 창으로 강제 이동됨.

- 대표적으로 로그인하지 않고 댓글, 추천, 내 정보 조회, 로그인할 때 이동함.

## 2-3. 댓글(리뷰) 기능

### (1). 사용자의 이름, 댓글의 추천수, 제목, 내용을 저장함.

### (2). 댓글 생성 기능 : 현재 식당에 대한 댓글을 생성한다.

- 한번 댓글을 작성한 식당에는 다시 댓글 달 수 없음.

### (3). 댓글 삭제 기능 : 현재 사용자가 작성한 댓글에 한해 댓글 삭제 기능 제공

### (4). 댓글 추천 기능 : 다른 사람이 작성한 댓글에 추천 버튼을 누를 수 있음.

- 한번 추천한 리뷰는 다시 추천할 수 없음.

- 자신이 작성한 리뷰에는 추천할 수 없음.

## 2-4. 검색 기능

### (1). 'main.ejs' 라는 메인 페이지를 통해 접근 가능

### (2). 사용자가 입력한 정보에 대한 검색 결과를 'restaurant.ejs' 에 띄운다.

- 현재 식당 이름에 대한 검색 기능만 구현한 상태입니다.

## 2-5. 식당 정보 조회 기능

### (1). 메뉴창의 '근처 식당' 을 통해 접근 가능

- 식당 목록을 확인 가능하고 목록을 선택하여 세부 정보를 확인 가능함.

### (2). 식당 세부정보 확인 기능

- 식당 이름, 평점, 설명 뿐만 아니라 작성된 댓글(리뷰) 수 확인 가능

- 네이버 / 구글 사이트로 접근하여 식당에 대한 추가적인 정보 획득 가능

## 2-6. 포인트 기능

### (1). 사용자의 댓글이 추천을 받으면 포인트를 얻는다 (10포인트)

### (2). 포인트를 활용하여 '포인트 영화관'에서 영화를 시청 가능하다. (이 부분은 아직 미구현)

<br>

# 3. 개발 환경

- html / css
- **Database** : MySQL
- **Framework** : Express
- javascript
- ejs

<br>

# 4. 프로젝트 설치 및 실행 방법

### (1). 데이터베이스 import 하기

#### [1]

<br>

# 5. 프로젝트 사용 방법

<br>
