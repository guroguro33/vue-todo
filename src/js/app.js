import Vue from 'vue';
import draggable from 'vuedraggable';
import VueLocalStorage from 'vue-ls'; 

Vue.use(VueLocalStorage);

Vue.component('search', {
  props: '',
  data: function() {
    return {
      word: ''
    }
  },
  template: `
    <div class="search bg-w">
      <img src="./img/search.svg" class="search-icon">
      <input type="text" class="search-box" placeholder="検索" autocomplete="off" @keyup="sendWord" v-model="word">
    </div>
  `,
  methods: {
    sendWord() {
      this.$parent.searchWord = this.word;
    }
  }
})

new Vue({
  el: '#app',
  components: {
    'draggable': draggable
  },
  data: {
    lists : [
      {
        id: 1,
        text: 'タスク１',
        isDone: false,
        editMode: false
      },
      {
        id: 2,
        text: 'タスク２',
        isDone: false,
        editMode: false
      },
      {
        id: 3,
        text: 'タスク３',
        isDone: false,
        editMode: false
      },
      {
        id: 4,
        text: 'タスク４',
        isDone: true,
        editMode: false
      },
    ],
    isShowAdd: false,
    searchWord: '',

  },
  // 保存データがある場合は、最初に読み込む
  beforeMount: function(){
    if(Vue.ls.get('lsValue')){
      this.lists = JSON.parse(Vue.ls.get('lsValue'));
    }
  },
  methods: {
    // 入力欄表示
    showAdd() {
      this.isShowAdd = !this.isShowAdd;
    },
    // リスト追加
    addList() {
      // 入力したリストの要素を取得
      let text = this.$refs.text;
      // 初めの数値
      let nextId = this.lists.length;
      // 空欄の時は何もしない
      if(!text.value){
        return;
      }

      // データを追加
      this.lists.push({
        id: ++nextId,
        text: text.value,
        isDone: false,
        editMode: false
      })

      // 入力欄をクリア
      text.value = "";
      this.isShowAdd = false;
    },
    // リスト削除
    rmList(list) {
      let index = this.lists.indexOf(list);
      this.lists.splice(index, 1);
    },
    // リスト編集モードの切替
    toggleEditMode(list) {
      list.editMode = !list.editMode;
    },
    // 完了と未完了切替
    toggleDone(list) {
      list.isDone = !list.isDone;
    },
    // searchLists(word) {
    //   console.log(word);
    //   this.searchWord = word;
    //   return this.lists.filter( (elm) =>{
    //     let regexp = new RegExp('^' + this.searchWord, 'i');
    //     return elm.text.match(regexp);
    //   })
    // }
  },
  computed: {
    // 検索してリストを生成
    searchLists() {
      return this.lists.filter( (elm) =>{
        let regexp = new RegExp('^' + this.searchWord, 'i');
        return elm.text.match(regexp);
      })
    }
  },
  watch: {
    lists: {
      // 引数はウォッチしているプロパティの変更後の値
      handler(lists) {
      Vue.ls.set('lsValue', JSON.stringify(lists), 60 * 60 * 1000);
      },
      // deepオプションでネストしているデータも監視できる
      deep: true
    }
  },
})