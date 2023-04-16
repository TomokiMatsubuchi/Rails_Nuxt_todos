<template>
  <div>
    <v-card>
      <v-card-title>
        Todo List
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="todos" :search="search">
        <template v-slot:item.action="{ item }">
          <v-icon small @click="editItem(item)">edit</v-icon>
          <v-icon small @click="deleteItem(item)">delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <h2>TODOタイトル編集</h2>
        </v-card-title>
        <p>タイトル</p>
        <v-text-field v-model="dialogText.title" filled></v-text-field>
        <p>{{ errorMsg }}</p>
        <v-btn
          @click="
            updateItem(dialogText.id, dialogText.title, dialogText.user_id)
          "
          >更新</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  props: ["todos"],
  data() {
    return {
      search: "",
      headers: [
        {
          text: "タイトル",
          align: "left",
          sortable: false,
          value: "title",
        },
        { text: "ユーザー名", value: "username" },
        {
          text: "Actions",
          value: "action",
        },
      ],
      dialog: false,
      dialogTodo: {},
      dialogText: "",
      errorMsg: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.currentUser;
    },
  },
  methods: {
    async editItem(item) {
      this.dialog = true;
      this.dialogTodo = item;
      this.dialogText = {
        id: item.id,
        title: item.title,
        user_id: item.user,
      };
    },
    async updateItem(id, title, user_id) {
      if (!title) {
        return (this.errorMsg = "タイトルが空欄です。");
      }
      const data = await axios.patch(`/v1/todos/${id}`, {
        todo: {
          title: title,
          user_id: user_id,
        },
      });
      const updateTodos = this.user.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title: title,
          };
        }
        return todo;
      });
      const updateUser = {
        ...this.user,
        todos: updateTodos,
      };
      this.$store.commit("auth/setUser", updateUser);
      this.dialog = false;
      this.errorMsg = "";
    },
    async deleteItem(item) {
      const res = confirm("本当に削除しますか?");
      if (res) {
        await axios.delete(`/v1/todos/${item.id}`).then((response) => {
          if (response.status == 200) {
            const todos = this.user.todos.filter((todo) => {
              return todo.id !== item.id;
            });
            const newUser = {
              ...this.user,
              todos,
            };
            this.$store.commit("auth/setUser", newUser);
          } else {
            console.log("can't delete todo");
          }
        });
      }
    },
  },
};
</script>

<style></style>
