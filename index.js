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

//get all tasks
app.get('/tasks', function(req, res){ 
    fs.readFile('db.json', 'utf8', function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else { 
            var responseData = (result != '') ? JSON.parse(result).tasks : [];
            res.send(responseData);
        }
    })
})

//add new task
app.post('/task', function(req, res){  

    var finalObj = {};
    finalObj.tasks = [];

    var postObj = {
        id: getUuid(),
        player_shirt: req.body.player_shirt,
        player_name: req.body.player_name,
        position: req.body.position,
        player_image: req.body.player_image
    }

    fs.readFile('db.json', 'utf8', function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else { 

            finalObj.tasks = (result != '') ? JSON.parse(result).tasks : [];

            finalObj.tasks.push(postObj);

            fs.writeFile('db.json', JSON.stringify(finalObj), (err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Something went wrong'
                    });
                }else{
                    res.json(postObj);
                }
            });

        }
    })
})

//delete post
app.delete('/task/:id', function(req, res){
    console.log(req.params.id);

    var postId = req.params.id;

    fs.readFile('db.json', 'utf8', function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else { 
            var tasks = (result != '') ? JSON.parse(result).tasks : [];

            var filteredData = tasks.filter(function (e) {
                return e.id !==  postId;
            }); 

            var finalObj = {};
            finalObj.tasks = filteredData;

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