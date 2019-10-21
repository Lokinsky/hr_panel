//import {store} from "./../";

var app = new Vue({
    el:"#app",
    store:store,
    computed:Vuex.mapGetters(['getData','get_actual','is_editing','get_back_work']),
    methods:{
        ...Vuex.mapActions(['append_data','begin_editing_user','end_edit','delete_user','add_unsaved_rows','remove_unsaved_rows']),
        on_Enter_Input(item,id,key,index){
            item[key+''] = document.getElementById(id).value
            document.getElementById(id).blur()
            this.end_edit(item);
            //this.remove_unsaved_rows(index);
            document.getElementById(index).style.backgroundColor = 'white';
            
        },
        on_edit(item,id){
            if(this.is_editing!=true){
                if(item.isEditing!=true){
                    document.getElementById(id).style.backgroundColor = 'red';
                    this.begin_editing_user(item);
                    //console.log(id)
                    //this.add_unsaved_rows(id);
                }
            }
        },
        create_new_user(id,id_button){
            var form = get_form('create_user_panel');
            document.getElementById(id_button).style.visibility = 'hidden';
            document.getElementById(id).insertAdjacentElement("beforeend", form.$el);
        },
        _delete(user){
            console.log('del butt',user)
            this.delete_user(user)
        }
        
    },
    mounted(){
        
        this.append_data();
        console.log('mount');
        
        
    },
    created:()=>{
        //console.log("created");
    },
    updated:()=>{
        
        console.log('updated');

    }
}) 



