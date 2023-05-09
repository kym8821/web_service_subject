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

const app = express(); // express Server

app.set("port", 3000);

const appServer = http.createServer(app);

appServer.listen(app.get("port"), () => {
  console.log(__dirname);
  console.log(`http://127.0.0.1:${app.get("port")} 에서 서버실행중.`);
});

app.use('/img', express.static(__dirname + "/img"));
app.use('/css', express.static(__dirname + "/css"));
app.use('/views', express.static(__dirname + "/views"));

// 미들웨어를 등록한다
app.use(serveStatic(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());
app.use(expressSession({secret:"my key", resave: true, saveUninitialized: true}));

//EJS를 사용할 수 있도록 설정
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mydb',
});

app.use(cors({
  origin: "*",                // 출처 허용 옵션
  credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}));

connection.connect((err) => {
  if(err){
    console.log("error while connect DB",err);
  }
  console.log("connect success with DB");
});

app.get('/', (req, res) =>{
  const login = req.session.user?1:0;
  connection.query(`SELECT * FROM restaurant WHERE grade>=4`, (err1, prefer)=>{
    connection.query(`SELECT * FROM restaurant`, (err2, near)=>{
      connection.query(`SELECT * FROM comment`, (err3, review)=>{
        if(req.session.user) return res.render("main.ejs", {"user" : req.session.user.name, "review":review, "near":near, "prefer":prefer, "login":login});
        else return res.render("main.ejs", {"user" : undefined, "review":review, "near":near, "prefer":prefer, "login":login});
      })
    })
  })
});

app.get('/search', (req, res) =>{
  res.header("Access-Control-Allow-Origin", "*");
  const query = req.body.name || req.query.name;
  const login = (req.session.user ? 1:0);
  const sql = `SELECT * FROM restaurant WHERE name LIKE ?`;
  const values = [[query]];
  connection.query(sql, values, (err, data) => {
    return res.render("restaurant.ejs", {"data":data, "login" : login});
  });
});

app.get('/login', (req, res) => {
  if(req.session.user) res.redirect('/');
  return res.render("login.ejs", {"success":1, "login" : 0});
});

app.post("/loginProcess", (req, res) => {
  console.log("로그인 함수가 실행됩니다.");

  const paramID = req.body.id || req.query.id;
  const pw = req.body.password || req.query.password;

  console.log("id : " +  paramID + " " + "password :" +  pw);
  var sql = `SELECT * FROM web_user WHERE userid="${paramID}" AND passwd="${pw}"`;
  
  connection.query(sql, (err, data) =>{
    console.log("DB : " + data[0]);
    if (req.session.user) {
      const user = req.session.user;
      // 세션에 유저가 존재한다면
      console.log("relogin : " + user);
      console.log("이미 로그인 돼있습니다! : " + data[0].name);
      //return res.render("main.ejs", {"user":user.name, "login":1});
      return res.redirect("/");
    } 
    if(data.length!=0){
      req.session.user = {
        id: data[0].id,
        userid: data[0].userid,
        passwd: data[0].passwd,
        name: data[0].name,
        authorized: true,
      };
      const user = req.session.user;

      connection.query(`SELECT * FROM restaurant WHERE grade>=4`, (err1, prefer)=>{
        connection.query(`SELECT * FROM restaurant`, (err2, near)=>{
          connection.query(`SELECT * FROM comment`, (err3, review)=>{
            return res.redirect("/");
          })
        })
      })

    } else{
      return res.render("login.ejs", {"success":0, "login":0});
    }
  })
});

app.get('/signup', (req,res)=>{
  if(req.session.user){
    return res.redirect("/");
  }
  return res.render("signup.ejs", {"error":0, "login":0});
});

app.post('/signup', (req,res)=>{
  console.log("회원가입");
  const id = req.body.id || req.query.id;
  const password = req.body.password || req.query.password;
  const name = req.body.name || req.query.name;
  const email = req.body.email || req.query.email;

  if(req.session.user) return res.redirect("/");
  connection.query(`SELECT * FROM web_user WHERE userid=?`, [id], (err, data)=>{
    if(err) console.log("회원가입 유저 조회중 오류 발생!" + err);
    if(data.length > 0) return res.render("signup.ejs", {"error":1, "login":0});
    connection.query(`INSERT INTO web_user(userid, passwd, name, email) VALUES (?,?,?,?)`, [id, password, name, email], (err, data)=>{
      if(err) console.log("회원가입 정보 저장 중 오류 발생 : " + err);
      return res.render("login.ejs", {"success":1, "login":0});
    });
  });
});

app.get("/logout", (req, res) => {
  console.log("로그아웃");

  if (req.session.user) {
    console.log("로그아웃중입니다!");
    req.session.destroy((err) => {
      if (err) {
        console.log("세션 삭제시에 에러가 발생했습니다.");
        return;
      }
      console.log("세션이 삭제됐습니다.");
      return res.redirect("/");
    });
  } else {
    console.log("로그인 되어있지 않습니다.");
    return res.redirect('/login');
  }
});

app.get('/restaurant', (req, res) => {
  const sql = `SELECT * FROM restaurant`;
  const login = req.session.user?1:0;
  connection.query(sql, (err, data) => {
    return res.render('restaurant.ejs', {"data":data, "login":login});
  });
});

app.get('/reviewTable', (req,res)=>{
  const sql = `SELECT * FROM comment`;
  const login = req.session.user?1:0;
  connection.query(sql, (err, data) =>{
    return res.render('reviewTable.ejs', {"data":data, "login":login});
  })
})

app.get('/diner_info/:id', (req, res) => {
  console.log("\nabout detail");
  const id = req.params.id || req.body.id;
  const login = req.session.user?1:0;
  console.log(id);
  if (isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }
  const sql = `SELECT * FROM restaurant WHERE id=${id}`;
  connection.query(sql, (err, data) => {
    if(err || data.length==0){
      console.log("cant find data..." + err);
    }
    console.log("restaurant : " + data[0].name);
    const comments = `SELECT * FROM comment WHERE restaurant_id=${id}`;
    connection.query(comments, (err2, comment)=>{
      if(err2){
        console.log("find error while searching on comments : " + err2);
      }
      console.log(comment[0]);
      if(req.session.user){
        return res.render(`diner_info.ejs`, {"diner_data":data[0], "comments":comment, "userid":req.session.user.id, "login":login});
      }
      console.log("not login yet");
      return res.render(`diner_info.ejs`, {"diner_data":data[0], "comments":comment, "userid":undefined, "login":login});
    });
  });
});

app.get('/newReview/:id', (req,res)=>{
  const id = req.params.id;
  const login = req.session.user?1:0;
  
  connection.query(`SELECT * FROM comment WHERE web_user_id=${req.session.user.id} AND restaurant_id=${id}`, (err, data)=>{
    if(err){
      // 에러 처리
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
    
    console.log(data);
    if(data.length != 0 ){
      return res.redirect(`/diner_info/${id}`);
    }
    
    connection.query(`SELECT * FROM restaurant WHERE id=${id}`, (err, data) =>{
      if(err){
        // 에러 처리
        console.log(err);
        return res.status(500).send('Internal Server Error');
      }
      
      return res.render('newReview.ejs',{"diner_data" : data[0], "login":login});
    });
  });
});


app.post('/saveComment/:id', (req, res)=>{
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const login = req.session.user?1:0;
  console.log(id + " " + title + " " + content); 

  connection.query(`SELECT * FROM restaurant WHERE id=${id}`,(err, res_name)=>{
    console.log("restaurant_name : " + res_name);
    var sql = `INSERT INTO comment (title, comments, author, restaurant, restaurant_id, web_user_id) VALUES ?`;
    var values = [[title, content, req.session.user.name, res_name[0].name, id, req.session.user.id]];
    connection.query(sql, [values], (err, data) =>{
      if(err){
        console.log("err while saving comment : " + err);
      }
      if(err) throw err;
      console.log("success : " + data);
    });
  });

  return res.redirect(`/diner_info/${id}`);
});

app.post('/deleteReview', (req, res)=>{ //id : 리뷰의 아이디
  const cid = req.query.cid;
  const did = req.query.did;
  const login = req.session.user?1:0;
  console.log(cid + " " + did);
  var sql = `DELETE FROM comment WHERE idcomment=?`;
  var values = [[cid]];
  connection.query(sql, values, (err, data)=>{
    if(err) console.log("error occured while deleting data" + err);
  });

  var sql2 = `SELECT * FROM restaurant WHERE id=?`;
  var values2 = [[did]];
  return res.redirect(`/diner_info/${did}`);
});

app.post('/prefer', (req, res) =>{
  const login = req.session.user?1:0;
  let web_user_id = req.query.web_user_id || req.body.web_user_id;
  let restaurant_id = req.query.restaurant_id || req.body.restaurant_id;
  console.log("\nprefer process : " + web_user_id + " " + restaurant_id)
  connection.query(`SELECT * FROM liker WHERE liker=?`,[req.session.user.userid], (err, data)=>{
    if(err) console.log("err ooccured while searching liker" + err);
    if(data.length>0) return res.redirect(`/diner_info/${restaurant_id}`);
    console.log("not commented yet")
    connection.query(`UPDATE web_user SET point = point+10, prefer=prefer+1 WHERE id=${web_user_id}`, (err,data)=>{
      if(err) console.log("update data failed : " + err);
      console.log(`${req.session.user.name} point +=10`);
      connection.query(`SELECT * FROM comment WHERE web_user_id=${web_user_id} AND restaurant_id=${restaurant_id}`, (err, data)=>{
        if(err){
          console.log("err occured while finding data in comment" + err);
        }
        console.log("comment : " + data[0]);
        if(data.length==0){
          console.log("no data about comment");
        }
        const idcomment = data[0].idcomment;
        connection.query(`INSERT INTO liker(liker, web_user_id, restaurant_id, idcomment) VALUES (?,?,?,?)`, [req.session.user.userid, Number(web_user_id), Number(restaurant_id), Number(idcomment)]);
        connection.query(`UPDATE comment SET prefer=prefer+1 WHERE web_user_id=${web_user_id} AND restaurant_id=${restaurant_id}`);
      })
      return res.redirect(`/diner_info/${restaurant_id}`);
    });
  })
})

app.get("/mypage", (req,res)=>{
  const login = req.session.user?1:0;
  let id = req.session.user.id;
  if(req.session.user){
    connection.query(`SELECT * FROM web_user WHERE id=${id}`,(err,user)=>{
      connection.query(`SELECT * FROM comment WHERE web_user_id=${id}`, (err,comment)=>{
        return res.render("mypage.ejs", {"user":user, "comment":comment, "login":login});  
      });
    });
  }else{
    return res.redirect('/login');
  }
})

app.get("/shop", (req, res)=>{
  const login = req.session.user?1:0;
  connection.query(`SELECT * FROM product`, (err, products)=>{
    connection.query(`SELECT * FROM web_user WHERE id=${req.session.user.id}`, (err, users)=>{
      const currnet_user = users[0];
      return res.render("shop.ejs", {"products":products, "user":currnet_user, "login":login});
    });
  }); 
});