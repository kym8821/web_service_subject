import express from "express";
import cors from "cors";
import mysql from "mysql2";
import url from "url";
import http from "http";
import path from "path";
const __dirname = path.resolve();
import cookieParser from 'cookie-parser';
import expressSession from "express-session";
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import { connect } from 'http2';
import { dir, log } from 'console';

//express 서버 실행
const app = express();

//port는 3000으로
app.set("port", 3000);

// HTTP 서버 생성
const appServer = http.createServer(app);

// 서버를 지정된 포트로 바인딩하고 실행
appServer.listen(app.get("port"), () => {
  console.log(__dirname);
  console.log(`http://127.0.0.1:${app.get("port")} 에서 서버실행중.`);
});

// '/img' 디렉토리 내의 파일들을 정적 파일로 제공
app.use('/img', express.static(__dirname + "/img"));
// '/css' 디렉토리 내의 파일들을 정적 파일로 제공
app.use('/css', express.static(__dirname + "/css"));
// '/views' 디렉토리 내의 파일들을 정적 파일로 제공
app.use('/views', express.static(__dirname + "/views"));

// 미들웨어를 등록한다
app.use(serveStatic(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// 요청 쿠키 파싱을 위해 cookie-parser 미들웨어 사용
app.use(cookieParser());
// 세션 관리를 위한 express-session 미들웨어 사용
app.use(expressSession({secret:"my key", resave: true, saveUninitialized: true}));
//EJS를 사용할 수 있도록 설정
app.set('view engine', 'ejs');

// MySQL 서버와 연결할 정보를 객체 형태로 생성한다.
const connection = mysql.createConnection({
  host: 'localhost',  // MySQL 서버의 호스트 이름
  user: 'root',       // MySQL 사용자 이름
  password: '1234',   // MySQL 사용자 비밀번호
  database: 'mydb',   // 연결할 데이터베이스 이름
});

// 외부에서 접근 가능한 모든 출처(origin)에 대해 CORS(Cross-Origin Resource Sharing) 정책 허용 ( 응답 상태 : 200 )
app.use(cors({
  origin: "*",                
  credentials: true,          // Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200,  // 응답 상태를 200으로 설정
}));

// MySQL 서버와 연결을 시도
connection.connect((err) => {
  if(err) console.log("error while connect DB",err); //연결 실패시 에러 출력
  console.log("connect success with DB"); //연결 성공시 로그 출력
});

app.get('/', (req, res) =>{//메인 페이지 이동 (get)
  const login = req.session.user?1:0;
  
  // 쿼리문으로 테이블에서 정보 받아옴 (SELECT문) --> 비동기 처리이므로 3중 쿼리문으로 진행
  connection.query(`SELECT * FROM restaurant WHERE grade>=4`, (err1, prefer)=>{ 
    connection.query(`SELECT * FROM restaurant`, (err2, near)=>{
      connection.query(`SELECT * FROM comment`, (err3, review)=>{
        //로그인 했으면 유저 정보도 같이 보냄
        if(req.session.user) return res.render("main.ejs", {"user" : req.session.user.name, "review":review, "near":near, "prefer":prefer, "login":login});

        //로그인 안했으면 undefined
        else return res.render("main.ejs", {"user" : undefined, "review":review, "near":near, "prefer":prefer, "login":login});
      })
    })
  })
});

app.get('/search', (req, res) =>{ //검색 기능 (get)
  const query = req.body.name || req.query.name; // 검색어
  const login = (req.session.user ? 1:0); // 로그인 여부
  connection.query(`SELECT * FROM restaurant WHERE name LIKE ?`,[query], (err, data) => {
    // restaurant.ejs에 식당 정보, 검색어 보내기
    return res.render("restaurant.ejs", {"data":data, "login" : login});
  });
});

app.get('/login', (req, res) => { // 로그인 페이지 이동 (get)
  if(req.session.user) res.redirect('/'); // 로그인 되어있다면 다시 메인 페이지로 이동
  return res.render("login.ejs", {"success":1, "login" : 0}); // 로그인 페이지로 이동( success:에러 여부 / login : 로그인 여부)
});

app.post("/loginProcess", (req, res) => { // 로그인 처리 (post)
  const paramID = req.body.id || req.query.id; //paramID : 사용자 id 입력값
  const pw = req.body.password || req.query.password; //pa : 사용자 비밀번호 입력값

  //web_user 테이블에서 userid=paramID && passwd=pw인 정보를 찾기 위한 쿼리문 실행
  connection.query(`SELECT * FROM web_user WHERE userid="${paramID}" AND passwd="${pw}"`, (err, data) =>{
    if (req.session.user) { // 이미 로그인 되어있다면 메인 페이지로 이동
      const user = req.session.user;
      console.log("이미 로그인 돼있습니다! : " + data[0].name);
      return res.redirect("/");
    } 
    if(data.length!=0){ // userid=paramID && passwd=pw인 정보가 있다면 user 세션 추가
      req.session.user = { // 1. 세션 추가 : 
        id: data[0].id, // id : 고유 id값
        userid: data[0].userid, // userid : 유저 id
        passwd: data[0].passwd, // passwd : 유저 pw
        name: data[0].name, // name : 유저 이름
        authorized: true, // 인증된 사용자인가 : true
      };
      return res.redirect("/"); // 2. 메인 페이지로 이동
    } else{
      // 사용자 정보 없다 --> success(성공_여부 : 0) / login(로그인_여부 : 0)
      return res.render("login.ejs", {"success":0, "login":0});
    }
  })
});

app.get('/signup', (req,res)=>{ // 회원가입 기능 (get)
  if(req.session.user){ //로그인 되어있다면 메인 페이지로 이동
    return res.redirect("/");
  }
  // 로그인 되어있지 않으면 회원가입 페이지로 이동 (error_여부:0, 로그인_여부:0)
  return res.render("signup.ejs", {"error":0, "login":0});
});

app.post('/signup', (req,res)=>{ // 회원가입 정보 처리
  const id = req.body.id || req.query.id; // id : 사용자 id 입력
  const password = req.body.password || req.query.password; // password : 사용자 password 입력
  const name = req.body.name || req.query.name; // name : 사용자 이름 입력
  const email = req.body.email || req.query.email; // email : 사용자 이메일 입력

  //로그인 되어있다면 메인 페이지로 이동
  if(req.session.user) return res.redirect("/");

  // 쿼리문으로 userid 중복되는지 확인 (SELECT)
  connection.query(`SELECT * FROM web_user WHERE userid=?`, [id], (err, data)=>{
    if(err) console.log("회원가입 유저 조회중 오류 발생!" + err);
    
    //해당 데이터가 있다면 회원가입 페이지로 이동 (error여부:1 login여부:0)
    if(data.length > 0) return res.render("signup.ejs", {"error":1, "login":0});

    //쿼리문으로 db에 회원 정보 저장(INSERT INTO table VALUES [values])
    connection.query(`INSERT INTO web_user(userid, passwd, name, email) VALUES (?,?,?,?)`, [id, password, name, email], (err, data)=>{
      if(err) console.log("회원가입 정보 저장 중 오류 발생 : " + err);
      // 정보 저장 후 login.ejs로 이동 ( 성공여부:1 && 따로 로그인을 해주지 않는다. )
      return res.render("login.ejs", {"success":1, "login":0});
    });
  });
});

app.get("/logout", (req, res) => { //로그 아웃 처리 (get)
  if (req.session.user) { // 사용자 세션 존재 == 로그인 되어있다.
    console.log("로그아웃중입니다");

    req.session.destroy((err) => { // req의 세션 제거 (:user)
      if (err) {
        console.log("세션 삭제시에 에러가 발생했습니다.");
        return;
      }
      // 세션 제거 후 메인 페이지로 이동
      return res.redirect("/");
    });
  } else { // 로그인 되어있지 않다면 로그인 페이지로 이동
    return res.redirect('/login');
  }
});

app.get('/restaurant', (req, res) => { // 식당 목록 페이지로 이동 (get)
  const login = req.session.user?1:0; //login : 로그인 여부 저장

  //쿼리문으로 모든 식당 목록을 가져옴 (SELECT)
  connection.query(`SELECT * FROM restaurant`, (err, data) => {
    //render로 식당 목록 전달 && login여부 : login값
    return res.render('restaurant.ejs', {"data":data, "login":login});
  });
});

app.get('/reviewTable', (req,res)=>{ // 식당 리뷰 목록 페이지로 이동 (get)
  const login = req.session.user?1:0; //login : 로그인 여부 저장

  // 쿼리문으로 모든 comment 데이터 가져옴
  connection.query(`SELECT * FROM comment`, (err, data) =>{
    // 모든 comment 데이터를 갖고 식당 리뷰 목록 페이지로 이동 (login : 로그인 여부)
    return res.render('reviewTable.ejs', {"data":data, "login":login});
  })
})

app.get('/diner_info/:id', (req, res) => { // 식당 정보 페이지로 이동 (get)
  const id = req.params.id || req.body.id; // id : 식당 고유 id
  const login = req.session.user?1:0; // login : 로그인 여부

  //쿼리문으로 db에서 현재 식당 정보 가져옴
  connection.query(`SELECT * FROM restaurant WHERE id=${id}`, (err, data) => {
    if(err || data.length==0){
      console.log("cant find data..." + err);
    }

    //쿼리문으로 db에서 현재 식당에 대한 댓글 가져옴
    connection.query(`SELECT * FROM comment WHERE restaurant_id=${id}`, (err2, comment)=>{
      if(err2){
        console.log("find error while searching on comments : " + err2);
      }
      if(req.session.user){ //이미 로그인했다면 사용자 id를 함께 보냄
        return res.render(`diner_info.ejs`, {"diner_data":data[0], "comments":comment, "userid":req.session.user.id, "login":login});
      }
      //로그인되어있지 않다면 사용자 id : undefined
      return res.render(`diner_info.ejs`, {"diner_data":data[0], "comments":comment, "userid":undefined, "login":login});
    });
  });
});

app.get('/newReview/:id', (req,res)=>{ // 새 리뷰 작성 페이지로 이동
  const id = req.params.id; //id : 식당 고유 아이디
  const login = req.session.user?1:0; //login : 로그인 여부

  //쿼리문으로 comment에서 현재 사용자가 해당 식당에 리뷰를 작성했는지 확인 (SELECT)
  connection.query(`SELECT * FROM comment WHERE web_user_id=${req.session.user.id} AND restaurant_id=${id}`, (err, data)=>{
    if(err){
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
    if(data.length != 0 ){// 이미 해당 식당에 리뷰를 작성했다면 다시 식당 정보 페이지로 이동
      return res.redirect(`/diner_info/${id}`);
    }
    //작성하지 않았다면 새 리뷰 작성 페이지로 이동
    //쿼리문으로 현재 식당 정보 가져움 (SELECT)
    connection.query(`SELECT * FROM restaurant WHERE id=${id}`, (err, data) =>{
      if(err){
        console.log(err);
        return res.status(500).send('Internal Server Error');
      }
      // diner_data(식당 정보) && login(로그인 여부) 를 갖고 새 리뷰 작성 페이지로 이동
      return res.render('newReview.ejs',{"diner_data" : data[0], "login":login});
    });
  });
});

app.post('/saveComment/:id', (req, res)=>{ // 작성한 리뷰 저장 처리 (post)
  const id = req.params.id; // id : 식당 고유 id
  const title = req.body.title; // title : 사용자 입력 제목
  const content = req.body.content; // content : 사용자 입력 내용
  const login = req.session.user?1:0; // login : 로그인 여부

  // 현재 식당 id를 통해 쿼리문으로 식당 이름 추출 (SELECT)
  connection.query(`SELECT * FROM restaurant WHERE id=${id}`,(err, res_name)=>{
    //쿼리문으로 리뷰 내용 db에 저장 (INSERT INTO table VALUES valuse)
    var sql = `INSERT INTO comment (title, comments, author, restaurant, restaurant_id, web_user_id) VALUES ?`;
    var values = [[title, content, req.session.user.name, res_name[0].name, id, req.session.user.id]];
    connection.query(sql, [values], (err, data) =>{
      if(err){
        console.log("err while saving comment : " + err);
      }
    });
  });
  // 식당 정보 페이지로 이동
  return res.redirect(`/diner_info/${id}`);
});

app.post('/deleteReview', (req, res)=>{ // 작성한 리뷰 제거 기능 (post)
  const cid = req.query.cid; // cid : 리뷰 고유 아이디
  const did = req.query.did; // did : 식당 고유 아이디

  //쿼리문으로 cid에 해당하는 리뷰 제거 (DELETE)
  connection.query(`DELETE FROM comment WHERE idcomment=?`, [cid], (err, data)=>{
    if(err) console.log("error occured while deleting data" + err);
  });
  // 식당 정보 페이지로 이동
  return res.redirect(`/diner_info/${did}`);
});

app.post('/prefer', (req, res) =>{ // 좋아요 기능 (post)
  console.log("prefer seq");
  let web_user_id = req.query.web_user_id || req.body.web_user_id; //web_user_id : 리뷰 작성자 고유 id
  let restaurant_id = req.query.restaurant_id || req.body.restaurant_id; // restaurant_id : 식당 고유 id
  let idcomment = req.query.idcomment || req.body.idcomment; //idcomment : 리뷰 고유 id
  //로그인 되어있지 않다면, 로그인 페이지로 이동
  if(!req.session.user) return res.redirect("/login");

  //쿼리문으로 현재 사용자가 현재 리뷰에 좋아요를 눌렀는지 확인
  connection.query(`SELECT * FROM liker WHERE liker=? AND idcomment=? `,[req.session.user.userid, idcomment], (err, data)=>{
    if(err) console.log("err ooccured while searching liker" + err);
    console.log(data[0]);
    //만약 이미 좋아요를 눌렀다면, 식당 정보 페이지로 이동
    if(data.length>0) return res.redirect(`/diner_info/${restaurant_id}`);

    console.log("not comment yet");
    //쿼리문으로 리뷰 작성자에게 10포인트, 받은 추천수에 1 추가 (UPDATE)
    connection.query(`UPDATE web_user SET point = point+10, prefer=prefer+1 WHERE id=${web_user_id}`, (err,data)=>{
      if(err) console.log("update data failed : " + err);
      //쿼리문으로 db에서 현재 리뷰 정보를 갖고오고, 리뷰 고유 아이디 추출
      connection.query(`SELECT * FROM comment WHERE web_user_id=${web_user_id} AND restaurant_id=${restaurant_id}`, (err, data)=>{
        if(err){
          console.log("err occured while finding data in comment" + err);
        }
        const idcomment = data[0].idcomment; // idcomment : 현재 리뷰 고유 아이디

        //쿼리문으로 liker(리뷰 작성자 정보 테이블)에 현재 사용자 정보 저장 (INSERT)
        connection.query(`INSERT INTO liker(liker, web_user_id, restaurant_id, idcomment) VALUES (?,?,?,?)`, [req.session.user.userid, Number(web_user_id), Number(restaurant_id), Number(idcomment)]);
        console.log("insert data success!");
        //쿼리문으로 현재 리뷰의 추천수 1 증가 (UPDATE)
        connection.query(`UPDATE comment SET prefer=prefer+1 WHERE web_user_id=${web_user_id} AND restaurant_id=${restaurant_id}`);
        console.log("success to prefer!");
      })
      //식당 정보 페이지로 이동
      return res.redirect(`/diner_info/${restaurant_id}`);
    });
  })
})

app.get("/mypage", (req,res)=>{ // 내 정보 페이지로 이동 (get)
  const login = req.session.user?1:0; //login : 로그인 여부 저장
  let id = req.session.user.id; //id : 현재 사용자 고유 id
  
  if(req.session.user){ // 로그인 되어있다면 내 정보 페이지로 이동

    // 쿼리문으로 db에서 현재 사용자 정보 가져옴 (SELECT)
    connection.query(`SELECT * FROM web_user WHERE id=${id}`,(err,user)=>{
      //쿼리문으로 db에서 현재 사용자가 작성한 리뷰 목록 가져옴 (SELECT)
      connection.query(`SELECT * FROM comment WHERE web_user_id=${id}`, (err,comment)=>{
        // 현재 사용자 정보와 리뷰 목록을 갖고 내 정보 페이지로 이동
        return res.render("mypage.ejs", {"user":user, "comment":comment, "login":login});  
      });
    });
  }else{ // 로그인 되어있지 않다면 로그인 페이지로 이동
    return res.redirect('/login');
  }
})

app.get("/shop", (req, res)=>{ // 포인트 상점 페이지로 이동 (get)
  const login = req.session.user?1:0; // login : 로그인 여부 저장

  // 쿼리문으로 db에서 상품 목록 가져옴 (SELECT)
  connection.query(`SELECT * FROM product`, (err, products)=>{
    if(login>0){ //로그인 되어 있다면, 쿼리문으로 사용자 정보도 가져옴 (SELECT)
      connection.query(`SELECT * FROM web_user WHERE id=${req.session.user.id}`, (err, users)=>{
        const currnet_user = users[0];
        // 사용자 정보, 상품 목록을 갖교 상점 페이지로 이동
        return res.render("shop.ejs", {"products":products, "user":currnet_user, "login":login});
      });
    } else{ // 로그인 되어 있지 않다면, 상품 목록만 갖고 상점 페이지로 이동
      return res.render("shop.ejs", {"products":products, "user":undefined, "login":login});
    }
  }); 
});