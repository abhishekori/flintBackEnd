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

//console.log(docs[0]["connections"]);
var data = {};
data=docs[0]["connections"];
data.push(req.body.newconnection);
db.users.update({"uname":req.body.uname},{$set:{"connections":data}},function(err,docs){
res.send("done");

});

});
//db.users.update({"uname":req.body.uname},{$set:{"connection"}});

   /* var data={};
    data["_id"]=ObjectId(""+req.body.id+"");
    console.log(data);*/
    /*db.connections.find({"connection":req.body.uname},function(err,docs){
        
        
        var data=docs[0][""+req.body.uname+""];
        data.push(""+req.body.newconnection+"");
        

        var updatedata={};
        updatedata[""+req.body.uname+""]=data;

        db.connections.update({"connection":req.body.uname},{$set:updatedata},function(err,docs) {
            //res.send(docs);

        
            db.connections.find({"connection":req.body.newconnection},function(err,docs){
                console.log("new connection");
                data=docs[0][""+req.body.newconnection+""];
                data.push(""+req.body.uname+"");

                var upDateNewConnection={};
                upDateNewConnection[""+req.body.newconnection+""]=data;
                console.log(upDateNewConnection);
                
              db.connections.update({"connection":req.body.newconnection},{$set:upDateNewConnection},function(err,docs){
                console.log(docs);

                res.send(docs);
              });


             });
        });


      

    });*/
   /* db.connections.find({"connection":req.body.newconnection},function(err,docs){
                data=docs[0][""+req.body.newconnection+""];
                data.push(""+req.body.uname+"");

                var upDateNewConnection={};
                upDateNewConnection[""+req.body.newconnection+""]=data;
                
              db.connections.update({"connections":req.body.newconnection},{$set:upDateNewConnection},function(err,docs){

                res.send(docs);
              });


             });*/
});


var getAllContactsData=[];
app.post('/getAllContacts',function(req,res,next){

  db.connections.find({connection:""+req.body.uname+""},function(err,docs){
    var result=docs[0][""+req.body.uname+""];
    

    for(var i=0; i< result.length;i++){
     
      db.users.find({"uname":result[i]},function(err,docs){
        console.log(docs[0]);
        getAllContactsData.push(docs[0]);
        console.log(getAllContactsData)
  
         
      });

       
     }
    
       
     
  });next();
},function(req,res){

    res.send(getAllContactsData); 
  });


app.listen(3001);
console.log('server running at port 3001');
