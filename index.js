const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8090;

app.get('/', function(req, res){
    res.json({ 
        message: 'App is working fine'
    });
});

//get all posts
app.get('/posts', function(req, res){ 
    fs.readFile('db.json', 'utf8', function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else { 
            var responseData = (result != '') ? JSON.parse(result).posts : [];
            res.send(responseData);
        }
    })
})

//add new post
app.post('/post', function(req, res){  

    var finalObj = {};
    finalObj.posts = [];

    var postObj = {
        id: getUuid(),
        shirt_number: req.body.shirt_number,
        player_name: req.body.player_name,
        position: req.body.position,
        image: req.body.image
    }

    fs.readFile('db.json', 'utf8', function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else { 

            finalObj.posts = (result != '') ? JSON.parse(result).posts : [];

            finalObj.posts.push(postObj);

            fs.writeFile('db.json', JSON.stringify(finalObj), (err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Something went wrong'
                    });
                }else{
                    res.json({
                        success: true,
                        message: 'Data saved successfully'
                    });
                }
            });

        }
    })
})

//delete post
app.delete('/post/:id', function(req, res){
    console.log(req.params.id);

    var postId = req.params.id;

    fs.readFile('db.json', 'utf8', function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else { 
            var posts = (result != '') ? JSON.parse(result).posts : [];

            var filteredData = posts.filter(function (e) {
                return e.id !==  postId;
            }); 

            var finalObj = {};
            finalObj.posts = filteredData;

            fs.writeFile('db.json', JSON.stringify(finalObj), (err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Something went wrong'
                    });
                }else{
                    res.json({
                        success: true,
                        message: 'Post deleted successfully'
                    });
                }
            });

        }
    }); 
})

function getUuid(){
    return uuidv4().replace(/-/g, ''); 
}

app.listen(port, function(req, res){
    console.log('App server listening on port ' + port);
});