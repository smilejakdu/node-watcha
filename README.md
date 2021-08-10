# 📌 node-watcha

# 📌 mysql

![mysql_erd](https://github.com/smilejakdu/node-watcha/blob/main/public/erd.png)


# 📌 기술스택

express / typescript / mysql


# 📌 구현한 기능 

## 👉 회원가입 (SignUp & SignIn)
- `bcrypt` 사용한 암호화
- JWT login : 로그인시 `Token` Response

## 👉 게시글
- Board (CRUD)
- Review (CRUD 게시글과 유저 외래키 참조를 해서 게시글에 대한 댓글 구현)
- `JWT` 유무에 따라 CRUD

## 👉 스케쥴

- Secheduler ( CRUD ) 
- `JWT` 유무에 따라 CRUD
- analysis : 모든 user 중에서 어떤 장르 영화를 많이 봤는지 데이터
- polar : 내가 어떤 장르 영화를 많이 봤는지 데이터