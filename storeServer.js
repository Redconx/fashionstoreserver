let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ajay1#vinay

var port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {Client}=require("pg")
const client=new Client({
    user:"postgres",
    password:"ajay1#vinay",
    database:"postgres",
    port:5432,
    host:"db.kvmkuitonipmbujbhzqo.supabase.co"
})
client.connect(function (res,error){
    console.log("connected !!!");

})
let {storeData}=require('./storeData')

app.get("/resetData",function(req,res){
    let sql="truncate table storedata"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else{
            console.log("table emptied success")
            resetData()
            res.send('reset success')
        }
    })
})

resetData=()=>{
    let storeArray=storeData.map(ele=>[ele.id,ele.category,ele.description,ele.imgLink,ele.name,ele.price])
        storeArray.map(ele=>{
        console.log(ele);
        let sql1="INSERT INTO storedata VALUES ($1,$2,$3,$4,$5,$6)"
        client.query(sql1,ele,function(err,result){
        })
})
}

app.get('/products',function(req,res){
    let sql="SELECT * FROM storedata"
    client.query(sql,function(err,result){
        if(err)res.send(err)
        else res.send(result.rows)
    })
})

app.get('/products/:category',function(req,res){
    let {category}=req.params
    let sql="SELECT * FROM storedata"
    client.query(sql,function(err,result){
        if(err)res.send(err)
        else {
            let arr=result.rows
            let resArr=arr.filter(ele=>ele.category===category)
            res.send(resArr)
        }
    })
})
app.get("/product/:id",function(req,res) {
    console.log(req)
    let {id}=req.params
    console.log(id)
    let sql="SELECT * FROM storedata"
    client.query(sql,function(err,result){
        if(err)res.send(err)
        else {
            let arr=result.rows

            let resArr=arr.filter(ele=>ele.id==id)
            console.log(id)
            res.send(resArr)
        }
    })
})
app.post("/products",function(req,res){
    let body=req.body
    console.log(body);
    let sql="SELECT * FROM storedata"
    client.query(sql,function(err,result){
        if(err)res.send(err)
        else {
            let arr=result.rows
            let newID=+(arr[arr.length-1]).id+1
            let arr1=[newID,body.category,body.description,body.imglink,body.name,+body.price]
            let sql1='INSERT INTO storedata VALUES ($1,$2,$3,$4,$5,$6)'
            client.query(sql1,arr1,function(err1,result){
                if(err1)res.send(err1)
                else{
                    res.send(`${result.rowCount} insertion success`)
                }
            })
        }
    })
})
app.put("/products/:id",function(req,res){
    let body=req.body
    let {id}=req.params
    let arr=[body.category,body.description,body.imglink,body.name,+body.price,id]
    let sql="UPDATE storedata SET category=$1,description=$2,imglink=$3,name=$4,price=$5 WHERE id=$6"
    client.query(sql,arr,function(err,result){
        if(err)res.send(err)
        else{res.send(`${result.rows} updated`)}
    })
    
})
app.delete("/products/:id",function(req,res){
    let {id}=req.params
    console.log({id});
    console.log('indelete');
    let sql='DELETE FROM storedata WHERE id=$1'
    client.query(sql,[id],function(err,result){
        if(err)res.send(err)
        else{res.send(`${result.fields}deleted succesfully`)}
    })
})

app.post("/login",function(req,res){
    let {email,password}=req.body
    let sql='SELECT * FROM users'
    client.query(sql,function(err,result){
        if(err)res.send(err)
        else{
            let user=result.rows.find(ele=>ele.email===email&&ele.password===password)
            if(!user)res.status(401).send("Login Failed")
            else{res.send(user)}
        }
    })
})

app.post("/orders",function(req,res){
    let body=req.body

    let arr=[body.name,body.address,body.city,body.amount,body.items,body.email]
    console.log(arr);
    let sql='INSERT INTO orders VALUES ($1,$2,$3,$4,$5,$6)'
    client.query(sql,arr,function(err,result){
        if(err)res.send(err)
        else{
            res.send(`${result.rows} added succesfully`)
        }
    })
})

app.get('/orders',function(req,res){
    let sql='SELECT * FROM orders'
    client.query(sql,function(err,result){
        if(err)res.send(err)
        else{res.send(result.rows)}
    })
})

