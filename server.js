'use strict';
const express = require('express');
const https = require('https');
const fs = require('fs');

const puppeteer = require('puppeteer');
const multer = require('multer');
const path = require('path');

const app = express();
const mysql = require('mysql');
const { Console } = require('console');
app.use(express.static('public'));

const fileContent = fs.readFileSync('./enadsys.json', "utf8");
const fileJsonContent = JSON.parse(fileContent);
var db_ip=fileJsonContent.db_ip;
var db_dbase=fileJsonContent.db_dbase;
var db_ip=fileJsonContent.db_ip;
var db_dbase=fileJsonContent.db_dbase;
var db_host=fileJsonContent.db_host;

//console.clear();
console.log(fileJsonContent);


db_host='127.0.0.1';
db_user='root';
db_pass='';
db_dbase='dtr_db';


var con = mysql.createConnection({
  host: db_ip,   
  user: 'root',
  password: '',
  database: db_dbase
});
con.connect((err) => {
 if(err){
   console.log('Error connecting to Db');   
   return;
 }
 console.log('Connection established');   
});

//==================================================================================================
//==================================================================================================
// File Upload Endpoint
// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb(null, 'uploads/');
    cb(null, 'public/uploadz/');
  },
  filename: (req, file, cb) => {
    //cb(null, Date.now() + '-' + file.originalname);
    cb(null,file.originalname);
  },
});
const upload = multer({ storage });

app.post('/upload_IMG', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  //res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  res.send('OK');
});
//==================================================================================================
//==================================================================================================
// get total rlocks
app.get('/api/get_tot_lock', function(req, res){
  let jeSQL="SELECT * FROM locker";    
  con.query(jeSQL,[],function (err, result) {
    if (err) throw err;    
    else res.send(result);   
  });    
});
//==================================================================================================
//==================================================================================================
// drop all rlocks
app.delete('/api/drop_rlock', function(req, res){
  /*
  fs.writeFileSync('./records.json', JSON.stringify([], null, 2));
  res.send('All Record Locks Dropped'); 
  */
  var jeSQL="DELETE from locker";
  con.query(jeSQL,[],function (err, result) {  
    if (err) throw err;    
    res.send('All Record Locks Dropped'); 
  });
});

// get latest docno
app.get('/api/get_latest', function(req, res){    
  let trans=req.query.trans;  
  let docno=req.query.docno;  
  let new_arr=[]; let ctr_arr=0;
  let new_docno='';
  console.log('trans:'+trans+' vs docno:'+docno);
  /*
  var filepath='./records.json';
  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));
  console.log('data:'+data.length);
  //new_arr.sort(JBE_SORT_ARRAY(['descrp']));
  for(var i=0;i<data.length;i++){
    if(data[i].status=='ADD' && data[i].trans==trans){ 
      new_arr[ctr_arr]=data[i].docno;
      ctr_arr++;
    }
  }
  */

  let jeSQL="SELECT * FROM locker WHERE trans=?";    
  con.query(jeSQL,[trans],function (err, result) {
    if (err) throw err;    
    //else res.send(result);   
    else{
      //new_arr=result; 
      for(var i=0;i<result.length;i++){
        if(result[i].status=='ADD' && result[i].trans==trans){ 
          new_arr[ctr_arr]=result[i].docno;
          ctr_arr++;
        }
      }

      //console.log('new_arr:'+new_arr.length);
      if(new_arr.length > 0){
        new_arr.sort();
        new_docno=new_arr[new_arr.length-1];
      }  
      //console.log('new_docno:'+new_docno);
      res.send(new_docno);
    }
  });    
});

// get rlock NEW
/*
app.get('/api/get_rlock', function(req, res){    
  let trans=req.query.trans;  
  let docno=req.query.docno;  
  let new_arr=[];
  var filepath='./records.json';
  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));

  for(var i=0;i<data.length;i++){
    if(data[i].trans==trans && data[i].docno==docno){
      new_arr=data[i];
      break;
    }
  }
  //console.log('data:'+new_arr);
  res.send(new_arr);
});
*/

app.get('/api/get_rlock', function(req, res){    
  let trans=req.query.trans;  
  let docno=req.query.docno;    
  let jeSQL="SELECT * FROM locker WHERE trans=? AND docno=?";  
  
  con.query(jeSQL,[trans,docno],function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.put('/api/add_rlock', function(req, res){  
  /*
  let arr=req.query.arr;  
  var filepath='./records.json';
  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));
  data.push(JSON.parse(arr));

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  //console.log('add');
  res.send('added'); 
  */
  let arr=req.query.arr;
});

app.delete('/api/del_rlock', function(req, res){ 
  let trans=req.query.trans;  
  let docno=req.query.docno;
  
  var jeSQL="DELETE from locker where trans=? and docno=?";
  con.query(jeSQL,[trans,docno],function (err, result) {  
    if (err) throw err;    
    else res.send('Record Lock released:'+docno); 
  });

  //res.send('Record Lock released:'+docno); 
});

app.put('/api/chg_rlock', function(req, res){ 
  let trans=req.query.trans;  
  let docno=req.query.docno;  
  let new_docno=req.query.new_docno;
  //console.log(trans+' vs '+new_docno);
  /*
  var filepath='./records.json';
  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));

  for(var i=0;i<data.length;i++){
    if(data[i].trans==trans && data[i].docno==docno){
      data[i].docno=new_docno;
    }
  }
    
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  */

  let jeSQL="UPDATE locker SET docno=? WHERE trans=? AND docno=?";
  con.query(jeSQL,[new_docno,trans,docno],function (err, result) {  
    if (err) throw err;    
    else res.send('Record Docno Changed to:'+new_docno);  
  });   
});
//==================================================================================================
//==================================================================================================

// get enadsys
app.get('/api/get_system', function(req, res){  
  const filepath = './enadsys.json';
  const data = JSON.parse(fs.readFileSync(filepath));
  res.send(data);
});

app.put('/api/save_system', function(req, res){  
  let param = req.query.ob;  
  console.log('param from client '+param);
  //test connection of new ip  
  var scon = mysql.createConnection({
    host: param,   
    user: 'root',
    password: '',
    database: 'coldroom_db'
  });
  scon.connect((err) => {
   if(err){
     console.log('Error:'+param+' is unreachable...');
     console.log('Current IP is still : '+db_ip);
     res.send("FAILED");
   }else{
    con=scon;
    var filepath='./enadsys.json';
    const data = JSON.parse(fs.readFileSync(filepath));
    data.db_ip = param; //update IP
    console.log('Connection established');   
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    res.send("OK");
   }   
 });
});

// routes

app.get('/api/get_table', function(req, res){
  let tbl = req.query.tbl;  
  var jeSQL="SELECT * FROM "+tbl;
  con.query(jeSQL,function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.delete('/api/xclear_ptr', function (req, res) {
  var jeSQL="DELETE from ptr where areano=?";
  con.query(jeSQL,0,function (err, result) {  
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.get('/api/get_ptr', function(req, res){    
  var jeSQL="SELECT * FROM ptr";    
  con.query(jeSQL,function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});
app.get('/api/get_area', function(req, res){    
  var jeSQL="SELECT * FROM area";    
  con.query(jeSQL,function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.get('/api/get_userOnly', function(req, res){  
  let usercode = req.query.usercode;
  let jeSQL="SELECT * FROM user where usercode=?";    
  con.query(jeSQL,[usercode],function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.get('/api/get_user', function(req, res){  
  let userid = req.query.userid;
  let pword = req.query.pword;
  
  var jeSQL="SELECT * FROM user WHERE userid=? AND pword=?";  
  
  con.query(jeSQL,[userid,pword],function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.put('/api/upd_loc', function (req, res) {
  let lat = req.query.lat;
  let lng = req.query.lng;
  let usercode = req.query.usercode;  
  let clientno = req.query.clientno;
  let jeSQL="UPDATE user SET lat=?, lng=? WHERE usercode=? AND clientno=?";
  con.query(jeSQL,[lat,lng,usercode,clientno],function (err, result) {  
    if (err) throw err;    
    else res.send(result);    
  });  
});

app.put('/api/save_user', function (req, res) {
  let usercode = req.query.usercode;  
  let userid = req.query.userid;  
  let pword = req.query.pword;  
  let username = req.query.username;  
  let username2 = req.query.username2;  
  let fullname = req.query.fullname;  
  let addrss = req.query.addrss;  
  let photo = req.query.photo;  
  let celno = req.query.celno;  
  let usertype = req.query.usertype;  
  let lat = req.query.lat;
  let lng = req.query.lng;
  let d_active = req.query.d_active;

  console.log(username2, fullname);
    
  let jeSQL="INSERT INTO user (userid,pword,username,username2,fullname,addrss,photo,celno,usertype,lat,lng,d_active,usercode) VALUES (?,?,?,?,?, ?,?,?,?,?, ?,?,?)";  
  con.query(jeSQL,[userid,pword,username,username2,fullname,addrss,photo,celno,usertype,lat,lng,d_active,usercode],function (err, result) {  
    if (err) throw err;    
    else{
      var jeSQL="SELECT * FROM user";    
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }  
  });  
});

app.put('/api/upd_user', function (req, res) {
  let usercode = req.query.usercode;  

  let userid = req.query.userid;  
  let pword = req.query.pword;  
  let username = req.query.username;  
  let username2 = req.query.username2;  
  let fullname = req.query.fullname;  
  let addrss = req.query.addrss;  
  let photo = req.query.photoName;  
  let celno = req.query.celno;  
  let usertype = req.query.usertype;  
  let lat = req.query.lat;
  let lng = req.query.lng;
    
  let jeSQL="UPDATE user SET userid=?,pword=?,username=?,username2=?,fullname=?,addrss=?,photo=?,celno=?,usertype=?,lat=?,lng=? WHERE usercode=?";
  con.query(jeSQL,[userid,pword,username,username2,fullname,addrss,photo,celno,usertype,lat,lng, usercode],function (err, result) {  
    if (err) throw err;    
    else{
      /*
      let a =  photoImg
      let m =  a.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
      let b =  Buffer.from(m[2],'base64');
      fs.writeFile(photoName,b,function(err){
        if(!err){
          console.log("file is created")
        }
      });
      */
      //res.send(result);    
      var jeSQL="SELECT * FROM user";    
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      });     
    }
  });  
});

app.put('/api/save_setting1', function (req, res) {  
  let sysdate = req.query.sysdate;   
  
  let jeSQL="UPDATE sysfile SET sys_date=?";  
  con.query(jeSQL,[sysdate],function (err, result) {  
    if (err) throw err;    
    else{
      jeSQL="SELECT * FROM sysfile";
      con.query(jeSQL,function (err, result) {  
        if (err) throw err;    
        else res.send(result);    
      });  
    }   
  });   
});

/*
app.post('/api/save_setting2', function (req, res) {    
  let yyyy = req.query.yyyy;  
  let mm = req.query.mm;  
  let aryItems = req.query.aryItems;  
  console.log(aryItems.length);
  for(var i=0;i<aryItems.length;i++){
    console.log(i,aryItems[i]);
  }
  let jeSQL='DELETE from monthly WHERE year(date)=? and month(date)=? or (date IS NULL or date="")';   
  con.query(jeSQL,[yyyy,mm],function (err, result) {  
    if (err) throw err;   
    else{
      for(var i=0;i<aryItems.length;i++){
        jeSQL="INSERT INTO monthly (date) VALUES (?)";        
        con.query(jeSQL,aryItems[i],function (err, result) {
          if (err) throw err;                  
        });  
      }
      jeSQL='SELECT * FROM monthly';
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }
  }); 
});
*/

app.get('/api/get_all_tables', function (req, res) {    
  let aryTable = req.query.tbl;  
  let aryResult=[];    
  
  con.query('SELECT * FROM '+aryTable[0],function (err, result) {      
    if (err) throw err;   
    else{ 
      aryResult[0]=result;
      con.query('SELECT * FROM '+aryTable[1],function (err, result) {      
        if (err) throw err;   
        else{ 
          aryResult[1]=result;    
          con.query('SELECT * FROM '+aryTable[2],function (err, result) {      
            if (err) throw err;   
            else{ 
              aryResult[2]=result;    
              con.query('SELECT * FROM '+aryTable[3],function (err, result) {      
                if (err) throw err;   
                else{ 
                  aryResult[3]=result;    
                  con.query('SELECT * FROM '+aryTable[4],function (err, result) {      
                    if (err) throw err;   
                    else{ 
                      aryResult[4]=result;    
                      res.send(aryResult);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.put('/api/save_setting1', function (req, res) {  
  let sysdate = req.query.sysdate;   
  
  let jeSQL="UPDATE sysfile SET sys_date=?";  
  con.query(jeSQL,[sysdate],function (err, result) {  
    if (err) throw err;    
    else{
      jeSQL="SELECT * FROM sysfile";
      con.query(jeSQL,function (err, result) {  
        if (err) throw err;    
        else res.send(result);    
      });  
    }   
  });   
});
app.put('/api/save_setting2', function (req, res) {    
  let yyyy = req.query.yyyy;  
  let mm = req.query.mm;  
  let aryItems = JSON.parse(req.query.aryItems);  

  /*
  if(aryItems.length==0){
    res.send('wala'); 
    return;
  }
  

  //console.log(aryItems.length);
    
  for(var i=0;i<aryItems.length;i++){
    console.log(i,aryItems[i]['date']);
  }
  */
  
  let jeSQL='DELETE from monthly WHERE year(date)=? and month(date)=? or (date IS NULL or date="")';   
  con.query(jeSQL,[yyyy,mm],function (err, result) {  
    if (err) throw err;   
    else{
      for(var i=0;i<aryItems.length;i++){
        jeSQL="INSERT INTO monthly (date) VALUES (?)";        
        con.query(jeSQL,aryItems[i]['date'],function (err, result) {
          if (err) throw err;                  
        });  
      }      
      jeSQL='SELECT * FROM monthly';
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }
  }); 

});

app.post('/api/save_entry', function (req, res) {    
  let vdate = req.query.vdate;
  let usercode = req.query.usercode;
  let time1 = req.query.time1;
  let time2 = req.query.time2;
  let time3 = req.query.time3;
  let time4 = req.query.time4;
  
  let txt=req.query.dtl_txt;
  let txt_top=req.query.dtl_txt_top;
  let txt_left=req.query.dtl_txt_left;
  let txt_width=req.query.dtl_txt_width;
  let txt_fsize=req.query.dtl_txt_fsize;
  console.log('time1',time1);
  console.log('time2',time2);
  console.log('time3',time3);
  console.log('time4',time4);
  //console.log('vdate: '+vdate);
  let f_save=false;
  if(time1){ f_save=true; }
  if(time2){ f_save=true; }
  if(time3){ f_save=true; }
  if(time4){ f_save=true; }
  if(txt){ f_save=true; }
  
  let jeSQL='DELETE FROM daily WHERE date=? and usercode=?';
  con.query(jeSQL,[vdate,usercode],function (err, result) {      
    if (err) throw err;   
    else{  
      if(f_save){
        jeSQL="INSERT INTO `daily`(date,usercode, rank,time1,time2,time3,time4, txt,txt_top,txt_left,txt_width,txt_fsize) VALUES (?,?,?, ?,?,?,?, ?,?,?,?,?)";        
        con.query(jeSQL,[vdate,usercode,0,time1,time2,time3,time4, txt,txt_top,txt_left,txt_width,txt_fsize],function (err, result) {
          if (err) throw err;
        }); 
        console.log('SAVED......');
      }
  
      jeSQL='SELECT * FROM daily';
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }     
  }); 
});
//========================================================================================================
//========================================================================================================
//========================================================================================================

app.put('/api/upd_repl_fld_data', function (req, res) {
  let db=req.query.db;  
  let fld=req.query.fld;  
  let data=req.query.data;  
  let fld2=req.query.fld2;  
  let data2=req.query.data2; 
  var jeSQL='UPDATE '+db+' SET '+fld+'=? WHERE '+fld2+'=?';  
  con.query(jeSQL,[data,data2],function (err, result) {  
    if (err) throw err;    
    else{
      var jeSQL="SELECT * FROM "+db;    
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }   
  });  
});

app.put('/api/upd_loc_stock', function (req, res) {
  let bal = req.query.bal;
  let loc = req.query.loc;
  let stockno = req.query.stockno;  
  let lotno = req.query.lotno;

  let jeSQL="UPDATE transfer2 SET balance=? WHERE loc=? and stockno=? and lotno=?";
  con.query(jeSQL,[bal,loc,stockno,lotno],function (err, result) {  
    if (err) throw err;    
    else{
      var jeSQL="SELECT * FROM transfer2";    
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }     
  });  
});

//========================================================================================================
//======FM_LIB==================================================================================================
//========================================================================================================
app.get('/api/fmlib_get', function(req, res){
  let jeSQL = req.query.sql;  
  let params = req.query.fld;  
  //console.log(jeSQL);
  con.query(jeSQL,params,function (err, result) {
    if (err) throw err;    
    else res.send(result);    
  });  
});


app.post('/api/fmlib_save', function(req, res){
  let jeSQL = req.query.sql;  
  let params = req.query.fld;  
  let tbl = req.query.tbl;
  let fm_mode = req.query.fm_mode;
  
  //console.log(fm_mode+':jeSQL:'+jeSQL);
  //console.log('fld:'+params);

  con.query(jeSQL,params,function (err, result) {
    if (err) throw err;    
    //else if(fm_mode==1){
    else{
      var jeSQL='SELECT * FROM '+tbl;    
      //console.log('jeSQL 2:'+jeSQL);
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }
  });  
});

app.put('/api/fmlib_update', function(req, res){
  let jeSQL = req.query.sql;  
  let fld = req.query.fld;  
  let tbl = req.query.tbl;
  let fm_mode = req.query.fm_mode;
  
  con.query(jeSQL,fld,function (err, result) {
    if (err) throw err;    
    else{
      var jeSQL='SELECT * FROM '+tbl;
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }
  });  
});

app.delete('/api/fmlib_del', function(req, res){
  let jeSQL = req.query.sql;  
  let params = req.query.fld;  
  let tbl = req.query.tbl;
  let select = req.query.select; 
  
  //console.log('del jeSQL:'+jeSQL);
  //console.log('del fld:'+params);
  //console.log('del tbl:'+tbl);

  con.query(jeSQL,params,function (err, result) {
    if (err) throw err;    
    else{
      if(select){
        var jeSQL="SELECT * FROM "+tbl;    
        con.query(jeSQL,function (err, result) {
          if (err) throw err;    
          else res.send(result);    
        }); 
      }
    }
  });  
  
});

app.post('/api/save_transfer2', function (req, res) {
  let trano=req.query.trano;
  let loc=req.query.loc;
  let stockno=req.query.stockno;
  let lotno=req.query.lotno;
  let refno=req.query.refno;     
  let qty=req.query.qty;
  var jeSQL="INSERT INTO transfer2 (trano,loc,stockno,lotno,refno,qty) VALUES (?,?,?,?,?, ?)";  
  con.query(jeSQL,[trano,loc,stockno,lotno,refno,qty],function (err, result) {  
    if (err) throw err;    
    else{
      var jeSQL="SELECT * FROM transfer2";    
      con.query(jeSQL,function (err, result) {
        if (err) throw err;    
        else res.send(result);    
      }); 
    }  
  });  
}); 

//========================================================================================================
//========================================================================================================
//========================================================================================================

// This responds a POST request for the homepage
app.post('/', function (req, res) {
  console.log("Got a POST request for the homepage");
  res.send('Hello POST');
});

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
});

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
var server = app.listen(db_host, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("DTR App listening at http://%s:%s", host, port)
});
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
