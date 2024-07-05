const express = require("express");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(morgan("dev"));
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});
app.use(cookieParser());
app.use(session({
    resave: true,   // request 할 때 변경사항이 없다면 session 을 다시 저장, default 값이 true - 일반적으로 false
    saveUninitialized: false,    // request 가 들어오면 해당 request 에서 새로 생성된 session 에 아무 내용이 없는 상황.
    secret: 'wwg0523'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res)=>{
    const { member } = req.session;
    console.dir(req.session);
    if( member ){
        res.render("index", { member });
        return;
    }
    res.render('login');
});

app.post("/", (req, res)=>{
    const { userid } = req.body;
    // res.cookie("member", userid).redirect('/');
    req.session.member = userid;
    res.redirect("/");
});

// 세션 삭제
app.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/");
});

// 세션 데이터 추가
app.get("/addSession", (req, res)=>{
    req.session.addData = 'session_data';
    res.redirect("/");
});

//세션 데이터 보기
app.get("/viewSession", (req, res)=>{
    res.render("viewSession", { sessions: req.session })
});

app.listen(8080, ()=>{
    console.log('서버 8080포트에서 리스닝...');
});