<template>
    <Menu />
    <div>
        <img alt="logo" src="../assets/logo.png">
            <h1><b>Leaderboard</b></h1>
            <a-table :dataSource="dataSource" :columns="columns" />
                
    </div>
</template>
  
<script>
  import Menu from '../components/Menu.vue';
  export default {
    setup() {
  
      return {
        dataSource: [
          {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
          },
          {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
          },
        ],
        columns: [
          {
            title: 'Team v. Team',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Date',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: 'Score',
            dataIndex: 'address',
            key: 'address',
          },
        ],
      }
  
    },
  components: {
     Menu
    }, 
  }
</script>

<style>
    img {
        width: 125px;
        height: 100px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>