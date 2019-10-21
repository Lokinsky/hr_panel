



//import {mapActions} from 'vuex'

var web = new WebSocket('ws://localhost:8081/','echo-protocol');
var data = {
    actions:{
        append_data(context){
            var local_table;
            console.log('is exist local_table:',localStorage.getItem("local_table")!=null)
            if(localStorage.getItem("local_table")!=null)
                local_table = JSON.parse(localStorage.getItem("local_table"))
            else
                local_table = {changed:0}
            console.log('status_local_actual',local_table.changed);

            web.onmessage = function(event) {
                    
                var rcvd = JSON.parse(event.data);
                console.log(rcvd);
                switch (rcvd.head) {
                    case "changed":
                        console.log('status_server_actual',rcvd);
                        if(local_table.changed!=rcvd.data){
                            web.send(
                                JSON.stringify({"head":'request_table',"data":"null"})
                                );
                            console.log('req');
                            }
                            else{
                                console.log('local upl',local_table)
                                context.commit('set_local_table',local_table);
                            }
                        break;
                    case 'get_table':
                            console.log("getting table")
                            
                            context.commit('set_table',rcvd.data)
                        break;
                    case 'add_user':
                        context.commit('add_new_user',rcvd.data)
                        break;
                    case 'update_user_row_client':
                        console.log('updating,vuex')
                        context.commit('update_local_user_row',rcvd.data)
                        break;
                    case 'update_status_edit':
                        console.log('update_status_edit')
                        context.commit('update_status_edit_user',rcvd.data);
                        break;
                    case 'delete_row':
                        console.log('deleting user row')
                        context.commit('delete_user',rcvd.data)
                        break;
                    default:
                        break;
                }                     
            };
        },
        begin_editing_user(context, user){

            var _user = {
                id:user.id,
                surname:user.surname,
                name:user.name,
                secondname:user.secondname,
                spec:user.spec,
                salary:user.salary,
                status:user.status,
                date_employed:user.date_employed,
                isEditing:true
            }
            context.commit('change_edit_status',_user);
        },
        end_edit(context,user){
            //console.log('end edit')
            context.commit('update_user_row',user);
            
        },
        create_user(context,new_user){

            if(new_user!=null){
                console.log('creating new user')
                context.commit('end_creation',new_user);
            }
        },
        delete_user(context,user){
            context.commit('delete_user_row',user);
        },
        add_unsaved_rows(context,index_row){
            context.commit('add_index_rows',index_row);
        },
        remove_unsaved_rows(context,index_row){
            context.commit('remove_index_rows',index_row);
        }
    },
    mutations:{
        set_table(state,table){
            state.workers = table.workers
            state.changed = table.changed
            localStorage.removeItem('local_table');
            localStorage.setItem("local_table",JSON.stringify(table));
        },
        set_local_table(state,local_table){
            state.workers = local_table.workers
            state.changed = local_table.changed
            state.unsaved_rows = local_table.unsaved_rows
        },
        change_edit_status(state,user){
            state.changed+=1;
            send("change_status_edit",user,state);
        },
        update_status_edit_user(state,user){
            for(var num in state.workers)
                if(state.workers[num].id == user.id)
                    {
                        state.workers[num].isEditing = user.isEditing
                        state.changed+=1;
                        localStorage.removeItem('local_table')
                        localStorage.setItem('local_table',JSON.stringify(state))
                        return;
                    }
        },
        update_user_row(state,user_row){
            for(var num in state.workers)
                if(state.workers[num].id==user_row.id){
                    state.workers[num] = user_row
                    state.changed+=1;
                    send("update_user_row",state.workers[num],state);
                }
        },
        update_local_user_row(state,user_row_remote){
            
            for(var num in state.workers)
                if(state.workers[num].id==user_row_remote.id){
                    console.log(user_row_remote)
                    state.workers[num].isEditing = user_row_remote.isEditing
                    state.workers[num].surname = user_row_remote.surname
                    state.workers[num].name = user_row_remote.name
                    state.workers[num].salary = user_row_remote.salary
                    state.workers[num].secondname = user_row_remote.secondname
                    state.workers[num].date_employed = user_row_remote.date_employed
                    state.workers[num].spec = user_row_remote.spec
                    state.workers[num].status = user_row_remote.status
                    state.changed+=1;
                    localStorage.removeItem('local_table')
                    localStorage.setItem('local_table',JSON.stringify(state))
                    console.log(state.workers)
                    return;
                }
        },
        end_creation(state,new_user){
            state.workers.push(new_user);
            state.changed+=1;    
            console.log(new_user)
            send("create_new_user",new_user,state);
        },
        add_new_user(state,add_new_user){
            state.workers.push(add_new_user);
            state.changed+=1;
            localStorage.removeItem('local_table')
            localStorage.setItem('local_table',JSON.stringify(state))
        },
        delete_user_row(state,user_index){
            state.workers.splice(user_index,1);
            state.changed+=1;
            send("delete_user",user_index,state);
        },
        delete_user(state,delete_row_index){
            state.workers.splice(delete_row_index,1);
            state.changed+=1;
            localStorage.removeItem('local_table')
            localStorage.setItem('local_table',JSON.stringify(state))
        },
        add_index_rows(state,index_row){
            console.log('add_unsaved')
            state.unsaved_rows.push(index_row);
            localStorage.removeItem('local_table')
            localStorage.setItem('local_table',JSON.stringify(state))
        },
        remove_index_rows(state,index_row){

            for(var num in state.unsaved_rows)
                if(state.unsaved_rows[num]==index_row)
                    state.unsaved_rows.splice(num,1);

            console.log(state.unsaved_rows)
            localStorage.removeItem('local_table')
            localStorage.setItem('local_table',JSON.stringify(state))
        }
    },
    state:{
        workers:[],
        actual:false,
        changed:0,
        editing:false,
        unsaved_rows:[-1]
     },
    getters:{
        getData(state){
            return state.workers;
        },
        get_actual(state){
            return state.changed;
        },
        is_editing(state){
            return state.editing;
        },
        get_back_work(state){
            return state.unsaved_rows
        }
    }
}

function send(head,data,state){
    var send_object = {
        "head":head,
        "data":data
    }
    localStorage.removeItem('local_table');
    localStorage.setItem('local_table',JSON.stringify(state));
    web.send(JSON.stringify(send_object));
}