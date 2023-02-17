
<template>
<div id="app">
   <Menu />
            <img alt="logo" src="../assets/logo.png">
            <h1><b>Team Roster</b></h1> 
            <div v-if="admin === true">
              <a-button type="dashed" @click="renderUsersList" style="margin-left: 900px; margin-bottom: 30px;" size="large">
                View Teams
              </a-button>
            </div>
            <a-spin v-if="loading" size="large"></a-spin>
            <a-table :dataSource="dataSource" :columns="columns" :key="componentKey" style="margin: auto; justify-content: center;" >
             
            </a-table>
             <a-modal
                v-model:visible="visible"
                title="Select a name to view Team Roster"
                width="75%"
                wrap-class-name="full-modal"
              >

                <div v-html="modalText"></div>
                <a-spin v-if="loading" size="large"></a-spin>
                      <a-table :data-source="dataSource1" :columns="columns1" :key="componentKey" style="margin: auto; justify-content: center;" >
                          <template #select="{ record }">
                              <a-radio @change="onSelect(record.key)"></a-radio>

                          </template>
                      </a-table>
              </a-modal>
  </div>
</template>

<script>

import { message } from 'ant-design-vue';
import firebase from "firebase/app"
import 'firebase/auth';
import Menu from '../components/Menu.vue';
import { onMounted, ref } from 'vue';

export default {
  setup() {
      const error = ref(null);
      const loading = ref(true);
      const admin = ref(false);
      const visible = ref(false);
      const modalText = ref(``)
      const auth = firebase.auth();
      const columns = [
           {
            title: '',
            dataIndex: '',
            key: '',
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Jersey #',
            dataIndex: 'jerseyNum',
            key: 'jerseyNum',
          },
          {
            title: 'Phone #',
            dataIndex: 'phoneNum',
            key: 'phoneNum',
          },
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
          },
        ];

      const columns1 = [
           {
            title: '',
            dataIndex: '',
            key: '',
          },
          {
            title: 'Team Name',
            dataIndex: 'tname',
            key: 'tname',
          },
          {
            title: 'Select',
            dataIndex: 'select',
            slots: {
                customRender: 'select',
             },
          },
        ];

    onMounted(() =>  {
        getToken() 
    })

    const getToken = () => {
      auth.onAuthStateChanged(async (user) => {
      if (user) {
        let token = await user.getIdToken();
        const res = await getTeamInfo(token);
        if (res.data !== false) appendDataTable(res.data[0])
        else loading.value = false;
        admin.value = localStorage.getItem('admin') === 'true' ? true : false
      } 
    })  
  }
  const data = [];
  const appendDataTable = (records) => {
    let index = 0
    data.length = 0
    records && data.push({
            key: index,
            name: records.data.capFullName,
            jerseyNum: records.data.jersey,
            phoneNum: records.data.phone,
            role: `Captain`,
    });
    records.data.players.forEach( (i) =>  {
          data.push({
            key: index + 1,
            name: i.fullName,
            jerseyNum: i.jerseyNum,
            phoneNum: i.phoneNum,
            role: `Player`,
          });
      })
      loading.value = false
      forceRerender()
    }
  
  const componentKey = ref(0);
  const forceRerender = () => {
        componentKey.value += 1;
  };
  const dataSource = ref(data);
  const getTeamInfo = async (token) => {
      const response = await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getData&type=team`, {
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

    const renderUsersList = async () => {
      loading.value = true;
      const results = await getUsersList()
      if (results.data !== false && localStorage.getItem('records') === null) {
        localStorage.setItem('records', JSON.stringify(results))
        appendModalTable(results)
      }
      else {
        appendModalTable(JSON.parse(localStorage.getItem('records')))
      }
      loading.value = false;
      visible.value = true;
    }

    const getUsersList = async () => {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const response = await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getData&type=allUsers`, {
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

    const onSelect = key => {
        dataSource1.value.filter(async item => {
            if (item.key === key) {
              const response = await getSelectedTeam(item)
              if (response.data !== false) appendDataTable(response.data[0])
              return
            }
      })
      setTimeout(() => {visible.value = false}, 1800);
    };

  const data1 = []
  const appendModalTable = (records) => {
    data1.length = 0
    records.data.forEach((record, i) => {
      record && data1.push({
      key: i,
      tname: record.name,
      id: record.uid
      }); });
      forceRerender() 
    }
  const dataSource1 = ref();
  dataSource1.value = (data1);

  const getSelectedTeam = async (team) => {
     const user = auth.currentUser;
     const token = await user.getIdToken();
     const response = await fetch(`https://us-central1-wffa25444.cloudfunctions.net/teamData?api=getData&type=adminVerifyTeam&param=${team.id}`, {
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

    return {
      dataSource,
      dataSource1,
      columns,
      columns1,
      error,
      loading,
      componentKey,
      visible,
      admin,
      renderUsersList,
      modalText,
      onSelect,
      labelCol: {
        span: 4,
    },
      wrapperCol: {
      span: 14,
    },
    };
  },

  components: {
    Menu
  },
};
</script>


<style scoped>
img {
    width: 220px;
    height: 180px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

</style>