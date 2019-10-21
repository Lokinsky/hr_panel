//form for open editable rows of user
//disabled
function _edit_pan(opt){

    var _edit_panel = Vue.extend({
        template:`<tr class='edit_panel' id="edit_panel">
                        <div id="${opt.id}">
                            <input id="surname"  value="${opt.surname}">
                            <input id="name" value="${opt.name}">
                            <input id="secondname"  value="${opt.secondname}">
                            <input id="spec" value="${opt.spec}">
                            <input id="salary" value="${opt.salary}">
                            <input id="status" value="${opt.status}">
                            <input id="date" value="${opt.date_employed}">
                            <button id="sumbit_edit" v-on:click='sumbit_edit("${opt.id}")'>Сохранить</button>
                        </div>
                </tr>`,
                store:store,
        methods:{
            ...Vuex.mapActions(['end_edit','begin_editing_user']),
                sumbit_edit(id){
                        
                    var row = document.getElementById(id+'').children;
                        
                    var _edited = {
                    id:id,
                    surname:row[0].value,
                    name:row[1].value,
                    secondname:row[2].value,
                    spec:row[3].value,
                    salary:row[4].value,
                    status:row[5].value,
                    date_employed:row[6].value,
                    isEditing:false
                }
                
                this.begin_editing_user(_edited);
                this.end_edit(_edited);
                document.getElementById('edit_panel').remove();

                //console.log(edited);
            }
        }
    })


    return new _edit_panel().$mount();
}


//form for create user row
function _create_panel(){

    var _create_user_panel = Vue.extend({
        template:`
                    <div class='create_user_panel' id="create_user_panel">
                        <label>Фамилия</label><input id="surname"  value="">
                        <label>Имя</label><input id="name" value="">
                        <label>Отчество</label><input id="secondname"  value="">
                        <label>Должность</label><input id="spec" value="">
                        <label>Оклад</label><input id="salary" value="">
                        <label>Статус</label><input id="status" value="">
                        <label>Дата приема на работу</label><input id="date"  value="">
                        <button id="sumbit_edit" v-on:click='sumbit_create("create_user_panel")'>Сохранить</button>
                    </div>`,
        store,
        methods:{
            ...Vuex.mapActions(['create_user']),
            sumbit_create(id){   
                var row = document.getElementById(id+'').children;
                var _user = {
                    id:Math.random(),
                    surname:row[1].value,
                    name:row[3].value,
                    secondname:row[5].value,
                    spec:row[7].value,
                    salary:row[9].value,
                    status:row[11].value,
                    date_employed:row[13].value,
                    isEditing:false
                }
                //console.log('created',edited);
                console.log(_user)
                this.create_user(_user);
                document.getElementById('creation_button').style.visibility = "visible";
                document.getElementById('create_user_panel').remove();
            }
        }
    })
    return new _create_user_panel().$mount();
}




const Array_Forms = [
    {
        "id":"edit_panel",
        "func":_edit_pan
    },
    {
        "id":"create_user_panel",
        "func":_create_panel
    }
]

function get_form(name,options){
    var result;
    Array_Forms.forEach(element => {
        if(element.id == name){
            result = element.func;
        }
    });
    //var s = result(options);
    return result(options)
}
