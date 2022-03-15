const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
 
const app = express();


app.use(express.static("public")); //to access static file using public forder
app.use(bodyParser.urlencoded({extended: true}))
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})
app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url ="https://us14.api.mailchimp.com/3.0/lists/a54e061f0c";
    const options ={
        method:"POST",
        auth: "sandeep:f69b0564a3d4003441f9a269c5b2b328-us14"
    }
    const request = https.request(url,options,function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();

});
//to reroute to home page
app.post('/failure',(req,res)=>{
    res.redirect('/')
})
//for deployement in heroku
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port: "+3000);
});

//api key
//f69b0564a3d4003441f9a269c5b2b328-us14
//audience/list id
//a54e061f0c