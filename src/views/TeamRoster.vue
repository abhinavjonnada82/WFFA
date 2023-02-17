
<template>
<div id="app">
   <Menu />
            <img alt="logo" src="../assets/logo.png">
            <h1><b>Team Roster</b></h1>
            <a-spin v-if="loading" size="large"></a-spin>
            <a-table :dataSource="dataSource" :columns="columns" :key="componentKey" style="margin: auto; justify-content: center;" >
             
            </a-table>
  </div>
</template>

<script>

import { message } from 'ant-design-vue';
import firebase from 'firebase';
import Menu from '../components/Menu.vue';
import { onMounted, ref } from 'vue';

export default {
  setup() {
      const error = ref(null);
      const loading = ref(true);
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

    onMounted(() =>  {
        getToken() 
    })
    const getToken = () => {
      firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let token = await user.getIdToken();
        const res = await getTeamInfo(token);
        if (res.data !== false) appendDataTable(res.data[0])
      } 
    })  
  }
  const data = [];
  const appendDataTable = (records) => {
    let index = 0
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
    const componentKey = ref(0);
    const forceRerender = () => {
          componentKey.value += 1;
    };
    return {
      dataSource,
      columns,
      error,
      loading,
      componentKey,
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