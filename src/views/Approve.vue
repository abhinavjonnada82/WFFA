<template>
     <Menu />
   <img alt="logo" src="../assets/logo.png">
            <h1><b>Admin Dashboard</b></h1>
            <a-spin v-if="loading" size="large"></a-spin>
            <a-table bordered :data-source="dataSource" :columns="columns" :key="componentKey">
              <template #approve="{ record }">
                  <a @click="onApprove(record.key)">Approve</a>
              </template>
            </a-table>
</template>
<script>

import { defineComponent, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import firebase from "firebase/app"
import 'firebase/auth';
import Menu from '../components/Menu.vue';

export default defineComponent({
  components: {
    Menu
  },

  setup() {
    let data = []
    const auth = firebase.auth();
    const approveStatus = ref(``);
    const dataSource = ref();
    const loading = ref(true);
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
      auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const res = await getAllTeamInfo(token);
        appendDataTable(res.data)
      } else {
        auth.signOut().then(() => console.log('Signed out') )
        .catch(err => alert(err.message))
      }
    })  
  }

    const onDelete = key => {
      dataSource.value = dataSource.value.filter(item => item.key !== key);
    };
    const onApprove = key => {
        dataSource.value.filter(async item => {
            if (item.key === key )
                setTeamApproval(item)
                return
            })
    };

    const setTeamApproval = async (item) => {
      let token = ``
      let response = ``
      auth.onAuthStateChanged(async (user) => {
      if (user) {
        token = await user.getIdToken();
        const rosterPayload = {'userId': item.id}
        response = await getTeamApproval(token, rosterPayload);
        if (response.code == 200) onDelete(item.key)
      } else {
        auth.signOut().then(() => console.log('Signed out') )
        .catch(err => alert(err.message))
      }}) 
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
      loading.value = false
      forceRerender()
        
    }

    dataSource.value = (data);

    const componentKey = ref(0);
    const forceRerender = () => {
          componentKey.value += 1;
    };

    return {
      columns,
      onDelete,
      componentKey,
      dataSource,
      loading,
      onApprove
    };
  },
});
</script>
