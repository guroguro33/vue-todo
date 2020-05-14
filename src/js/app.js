import Vue from 'vue';

// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'vue-todo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

new Vue({
  el: '#app',
  data: {
    lists : [
      {
        id: 1,
        text: 'テキストテキスト１',
        isDone: false,
        editMode: false
      },
      {
        id: 2,
        text: 'テキストテキスト２',
        isDone: true,
        editMode: false
      },
      {
        id: 3,
        text: 'テキストテキスト３',
        isDone: false,
        editMode: false
      }
    ],
    isShowAdd: false,
    searchWord: '',

  },
  methods: {
    // 入力欄表示
    showAdd() {
      this.isShowAdd = !this.isShowAdd;
    },
    // リスト追加
    addList(e) {
      // 入力したリストの要素を取得
      let text = this.$refs.text
      // 空欄の時は何もしない
      if(!text.value){
        return;
      }

      // データを追加
      this.lists.push({
        id: todoStorage.uid++,
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
    // 完了と未完了切替
    toggleDone(list) {
      list.isDone = !list.isDone;
    }
  },
  computed: {
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
        todoStorage.save(lists)
      },
      // deepオプションでネストしているデータも監視できる
      deep: true
    },
  },
  created() {
    // インスタンス生成時に自動的にfetchする
    this.lists = todoStorage.fetch();
  },
})