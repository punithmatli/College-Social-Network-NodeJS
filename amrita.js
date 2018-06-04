var ex=require('express');
var app=ex();
var ejs=require('ejs');
app.use(ex.static('public'));
app.set('view engine','ejs')
var bodyParser=require('body-parser');
var session=require('express-session');
var mongojs=require('mongojs');
var db=mongojs('mongodb://punith29:123456a@ds016718.mlab.com:16718/punith29',['admin']);
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:'now'}))
app.set('port',process.env.PORT||5000)
app.get('/signup',function(req,res) {
if(req.session.users==true){
db.admin.find({},function(error,docss){			
			res.render('alll',{result:docss,user:req.session.username});
			})		
	}
	else{
	res.sendFile(__dirname+'/public/social.html');
	}
})

app.get('/login',function(req,res) {
	if(req.session.users==true){


	db.admin.find({},function(error,docss){
				console.log('found')		
			res.render('alll',{result:docss,user:req.session.username});
			
		}
	)		
	}
	else{
	res.sendFile(__dirname+'/public/alog.html');
}
})

app.post('/ld',function(req,res){
	req.session.users=false;
	var doc2={
		email:req.body.email,password:req.body.password
	}
	db.admin.find(doc2,function (err,newdoc) {
		if(newdoc.length>0){
			req.session.username=newdoc;
			req.session.users=true;
			db.admin.find({},function(error,docss){
				console.log('found')
			res.render('alll',{result:docss,user:newdoc});
		
		}
	)}
			else{
				res.send("Username or password doesn't exist");
			}
		})
				})


app.post('/sdt',function(req,res) {
	var doc={
		name:req.body.name,
		email:req.body.email,
		username:req.body.username,
		password:req.body.password
	}
	db.admin.insert(doc,function (err,newdoc) {
		if(err){
res.send('something went wrong')

		}
		else{
		res.sendFile(__dirname+'/public/alog.html');
		console.log('inserted');
	}})
})
app.get('/profile/:usern',function (req,res) {
	console.log(req.session.users)
	var username=req.params.usern;
	if(req.session.users){
	db.admin.find({username:username},function(er,docs){
		//if(docs.length>0){
			res.render('mine',{re:docs});
		//}
	})}
	else{
		res.redirect('/login');
	}
})
app.get('/logout',function (req,res) {
	req.session.destroy(function(){
		console.log('User logged out');
			})
			res.redirect('/login');
})
app.listen(app.get('port'),function() {
	console.log('1111 listening');
})