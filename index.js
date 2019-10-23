const express = require('express');
const http = require('httprequest');
var ws = require('ws');
var server = express();
var ws_port = 8081
var _ws = new ws.Server({port:ws_port});
server.use(express.static(__dirname+'/public/'));
server.use(express.static(__dirname+'/store/'));
//var h_port = process.env.PORT

var clients = {};

var table_data = {
    changed:1,
    editing:false,
    actual:true,
    workers:[
        {
            id:"kdmgs",
            surname:"Куропаткин",
            name:"Михаил",
            secondname:"Генадьевич",
            spec:"Программист",
            salary:"60 000",
            status:"Сотрудник",
            date_employed:"29.08.2018",
            isEditing:false
        },
        {
            id:"adms",
            surname:"Алексеев",
            name:"Даниил",
            secondname:"Дмитриевич",
            spec:"HR",
            salary:"70 000",
            status:"Уволен",
            date_employed:"23.10.2017",
            isEditing:false
        },
        {
            id:"adfs",
            surname:"Григорьев",
            name:"Олег",
            secondname:"Аркадьевич",
            spec:"QA",
            salary:"100 000",
            status:"Сотрудник",
            date_employed:"01.09.2019",
            isEditing:false
        }

    ]
}

var cookies_options = { 

    expires: new Date(Date.now() + 900000),
    httpOnly: true 
}

server.get('/',(req,res)=>{
    res.end();
        
})


server.get('/main',(req,res,)=>{
    console.log(req.ip)
    res.setHeader("Connection","close connection")
    res.sendFile(__dirname+'/public/html/main.html',(err)=>{res.end()});

});













_ws.on('connection',(ws)=>{
    var id = (Math.random()*100/3).toFixed(0);
    clients[id] = ws;
    //console.log("новое соединение " + id+" ip: "+clients[id]);
    ws.on('message', function(message) {
        //console.log('rcvd a message',message);
        var rcvd = JSON.parse(message)
        //console.log(rcvd);
        switch (rcvd.head) {
            case "request_table":
                    console.log('accessing the DB','get_table')
                    console.log(table_data.changed)
                    send_back("get_table",table_data,id);
                    //clients[id].send(JSON.stringify(table_data));
                break;
            case "change_status_edit": 
                    table_data.changed+=1;
                    console.log('accessing the DB','changing_status_edit')
                    console.log(table_data.changed)

                    for(var num in table_data.workers){
                        if(table_data.workers[num].id == rcvd.data.id){
                            table_data.workers[num].isEditing = rcvd.data.isEditing;
                            for(var key in clients){
                                if(key>id||key<id){

                                    send_back("update_status_edit",table_data.workers[num],key);
                                    //clients[key].send(JSON.stringify(table_data));
                                }
                            }
                            return;
                        }
                    }
                    console.log(table_data.changed)
                break;
            case "update_user_row": 
                    console.log('accessing the DB','updating_user_row')
                    table_data.changed+=1;
                    console.log(table_data.changed)

                    for(var num in table_data.workers){
                        if(table_data.workers[num].id == rcvd.data.id){
                            //console.log('updating_row',rcvd)
                            table_data.workers[num] = rcvd.data;
                            //console.log('updated',table_data.workers[num])
                            for(var key in clients){
                                if(key>id||key<id){
                                    send_back("update_user_row_client",table_data.workers[num],key);
                                }//clients[key].send(JSON.stringify(table_data));
                            }
                            return;
                        }
                    }
                    console.log(table_data.changed)
                break;

                case "create_new_user":
                        //console.log('creating',rcvd.data)
                        table_data.workers.push(rcvd.data);
                        //console.log('added',table_data.workers)
                        
                        table_data.changed+=1;
                        console.log(table_data.changed)

                        for(var key in clients){
                            if(key>id||key<id){
                            send_back("add_user",rcvd.data,key)
                            }//clients[key].send(JSON.stringify(table_data.changed));
                        }
                    break;

                case "delete_user":
                        table_data.workers.splice(rcvd.data,1);
                        
                        table_data.changed+=1;
                        console.log(table_data.changed)
                        for(var key in clients){
                            if(key>id||key<id)
                                send_back("delete_row",rcvd.data,key)
                                //clients[key].send(JSON.stringify(table_data.changed));
                        }

                    break;
            default:
                break;
        } 
    });

    ws.send(JSON.stringify(
        {
            "head":"changed",
            "data":table_data.changed
        }),(err)=>{

        console.log('data sent',table_data.changed)
    })
    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
})


function send_back(head,data,id_client){
    var response_data = {
        "head":head,
        "data":data
    }
    console.log('send_back')
    console.log(table_data.changed)

    clients[id_client].send(JSON.stringify(response_data));

}

server.listen(8080,'192.168.1.102',()=>{
    //console.log('server is running..');
});
