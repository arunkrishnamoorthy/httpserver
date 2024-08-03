
const http = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const port = 8000;
const { addTask, getTaskById, getTasks } = require('taskprocessor-ak456');

addTask("Title1" , "Description 1", new Date());
addTask("Title2" , "Description 2", new Date());

const sendResonse = (res, statusCode, data) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.write(JSON.stringify(data));
    res.end();
}

const loggingMiddleware = (req, res, next) => {
    console.log(`HTTP method: ${req.method} and url: ${req.url}`);
    next();
}

const parseRequestBody = (req, res, next) => {
    if(req.method === "POST") {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            req.body = JSON.parse(body);
            next();
        });
    } else {
        next();
    }
}

const server = http.createServer((req,res) => {
    loggingMiddleware(req,res, () => {
        parseRequestBody(req, res, () => {
            if(!req) {
                return;
            }
            const { method, url } = req;
            const parsedUrl = path.parse(url);
            switch(method) {
                case "GET":
                    if(parsedUrl.dir === "/" && parsedUrl.name === "tasks") {
                        // GET: Query
                        sendResonse(res, 200, getTasks());
                    } else {
                        // GET: READ
                        let taskId = parseInt(parsedUrl.base);
                        let task = getTaskById(taskId);
                        sendResonse(res,200, task);
                    }

                case "POST": 
                    const { title, description, dueDate } = req.body;
                    addTask(title,description,dueDate);
                    // let tasks = getTasks();
                    let createdTask = tasks[tasks.length - 1];
                    sendResonse(res,200, createdTask);
                

            }
        });
    });
});

server.listen(port,  () => {
    console.log(`Server running on port ${port}`);
});
