# 📌 node-watcha

# 📌 mysql

![mysql_erd](https://github.com/smilejakdu/node-watcha/blob/main/public/erd.png)


# 📌 기술스택

express / typescript / mysql


# 📌 구현한 기능 & 구현할 기능

## 회원가입 (SignUp & SignIn)
- `bcrypt` 사용한 암호화
- JWT login

## 게시글
- Board (CRUD)
- Review (CRUD 게시글과 유저 외래키 참조를 해서 게시글에 대한 댓글 구현)

## 스케쥴
- Secheduler ( CRUD ) 