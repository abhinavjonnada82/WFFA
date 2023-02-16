<template>
     <Menu />
  <a-button class="editable-add-btn" @click="handleAdd" style="margin-bottom: 8px">Add</a-button>
  <a-table bordered :data-source="dataSource" :columns="columns">
    <template #name="{ text, record }">
      <div class="editable-cell">
        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
          <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ text || ' ' }}
          <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
        </div>
      </div>
    </template>
    <template #approve="{ record }">

        <a @click="onApprove(record.key)">Approve</a>

    </template>
    
  </a-table>
</template>
<script>

import { computed, defineComponent, reactive, ref, onMounted } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue';
import firebase from 'firebase';
import Menu from '../components/Menu.vue';

export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
    Menu
  },

  setup() {
      // const error = ref(null);
    let data = []
    const approveStatus = ref(``);
    const dataSource = ref();
    const columns = [
           {
            title: '',
            dataIndex: 'key',
            key: 'key',
          },
          {
            title: 'Team Name',
            dataIndex: 'tname',
            key: 'tname',
          },
          {
            title: 'Captain Name',
            dataIndex: 'captainName',
            key: 'captainName',
          },
          {
            title: '# of Players',
            dataIndex: 'numPlayers',
            key: 'numPlayers',
          },
          {
            title: 'Approve',
            dataIndex: 'approve',
            slots: {
                customRender: 'approve',
             },
          },
        ];

    onMounted(() =>  {
        getToken()
    })

    const getToken = () => {
      firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const res = await getAllTeamInfo(token);
        appendDataTable(res.data)
      } else {
        firebase.auth().signOut().then(() => console.log('Signed out') )
        .catch(err => alert(err.message))
      }
    })  
  }

    const getUserToken = (rosterPayload) => {
      let token = ``
      firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        token = await user.getIdToken();
        return getTeamApproval(token, rosterPayload)
        
      } else {
        firebase.auth().signOut().then(() => console.log('Signed out') )
        .catch(err => alert(err.message))
      }
      
    })  
  }

    const getAllTeamInfo = async (token) => {
      const response = await fetch(` https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getData&type=allTeams`, {
        method:'GET',
        headers:{
            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
            }
      })
    
      if (response.status === 200) {
        return response.json()
        }
      else { 
            message.error({
                          content: `ERROR`,
                          duration: 2,
              }); 
          }
      }

    const getTeamApproval = async (token, rosterPayload) => {
        const response = await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=approveTeam`, {
        method:'POST',
        body: JSON.stringify(rosterPayload),
        headers:{
            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
            }
      })
    
      if (response.status === 200) {
        approveStatus.value = true
        return response.json()
        }
      else { 
            message.error({
                          content: `ERROR`,
                          duration: 2,
              }); 
          }
    }

    const appendDataTable = (records) => {
      records.forEach((record, i) => {
           record.data && data.push({
            key: i,
            tname: record.data.teamName,
            captainName: record.data.capFullName,
            numPlayers: record.data.players.length,
            id: record.uid
    });
      });

      forceRerender()
        
    }

    dataSource.value = (data);

    const componentKey = ref(0);
    
    const forceRerender = () => {
          componentKey.value += 1;
    };

    const count = computed(() => dataSource.value.length + 1);
    const editableData = reactive({});

    const edit = key => {
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    };

    const save = key => {
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };

    const onDelete = key => {
      dataSource.value = dataSource.value.filter(item => item.key !== key);
    };
    const onApprove = key => {
        dataSource.value.filter(async item => {
            if (item.key === key )
                setTeamApproval(item)
                return
            })
        //dataSource.value = dataSource.value.filter(item => item.key !== key);
    };

    const setTeamApproval = async (item) => {
      const respone = await getUserToken({'userId': item.id});
      if (respone.status == 200) onDelete(item.key)
    }

    const handleAdd = () => {
      const newData = {
        key: `${count.value}`,
        name: `Edward King ${count.value}`,
        age: 32,
        address: `London, Park Lane no. ${count.value}`,
      };
      dataSource.value.push(newData);
    };

    return {
      columns,
      onDelete,
     handleAdd,
      dataSource,
      editableData,
      count,
      edit,
      save,
      onApprove
    };
  },
});
</script>
