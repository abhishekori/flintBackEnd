var express=require('express');
var mongojs=require('mongojs');
var ObjectId = require('mongojs').ObjectId;
var bodyparser=require('body-parser');
//var mongoose=require('mongoose');
var app=express();
var db = mongojs('flint',['users','connections']);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.get('/',function (req,res) {

res.send("working!");
});



app.post('/checkUserName',function(req,res){
    
    db.users.find({"uname":req.body.username},function(err,docs)
        {
            if(docs.length==0)
            {
                res.json({"response":false});
            }else{
                res.json({"response":true});
            }
           // res.json({"err":err,"docs":docs.length});
        });

});

app.post('/signUpUser',function(req,res){

   

    db.users.insert({"uname":req.body.username,"fname":req.body.firstname,"mobilenumber":req.body.mobilenumber},function(err,docs){
       
       
        console.log(docs);
         console.log(docs["uname"]);
         var data={};
         data["connection"]=''+docs["uname"]+'';
         data[''+docs["uname"]+'']={};

        if(err==null)
        {


            db.connections.insert(data,function(err,docs){
                   
                res.json({"response":"suuinserted"}); 
            });
        
        }else{
            res.json({"response":"suuerror","detail":err});
        }
        
    });


})

app.post('/getContactsList',function(req,res){

   //db.connections.find({});
});

app.post('/addConnections',function(req,res){
  console.log(req.body.id);

  db.users.find({"uname":req.body.uname},function(err,docs){

    var data = {};
    data=docs[0]["connections"];
    data.push(req.body.newconnection);
    db.users.update({"uname":req.body.uname},{$set:{"connections":data}},function(err,docs){

      db.users.find({"uname":req.body.newconnection},function(err,docs){

          data = {};
          data=docs[0]["connections"];
          data.push(req.body.uname);
          db.users.update({"uname":req.body.newconnection},{$set:{"connections":data}},function(err,docs){

            res.send("done");

          })
      });

    });

  });
});



app.post('/getAllContacts',function(req,res){ 
       db.users.find({"connections":req.body.uname},function(err,docs){
res.json(docs);
       });
     
  });

app.post('/getProfileDetails',function(req,res){

db.users.find({"uname":req.body.uname},function(err,docs){
  res.json(docs);
});

});



app.listen(3001);
console.log('server running at port 3001');
