<template>
  <div class="wrapper">
    <!-- Sidebar  -->
    <nav style="color: white" id="sidebar">
      <div class="sidebar-header d-flex justify-content-around">
        <div
          class="d-flex pointer"
          style="margin-right: 25px; width: 160px"
          @click="onProfileClick"
        >
          <img
            :src="photoURL"
            alt="user"
            width="50px"
            height="50px"
            style="border-radius: 50%; background: white"
          />
        </div>
        <button type="button" class="btn btn-primary" v-on:click="logout">
          Logout
        </button>
      </div>
      <div style="height: 1px; border-bottom: 1px solid #00388b"></div>

      <ul class="list-unstyled components">
        <li
          class="active mb-3"
          @click="letsChat(item)"
          v-for="item in searchUsers"
          :key="item.id"
          v-show="item.id != currentUserId"
        >
          <div
            class="d-flex"
            style="cursor: pointer; padding-bottom: 15px; width: 100%"
          >
            <div style="width: 30%">
              <img
                v-if="item.URL"
                :src="item.URL"
                alt="user"
                width="50px"
                height="50px"
                style="border-radius: 50%; background: white"
              />
              <img
                v-else
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="user"
                width="50px"
                height="50px"
                style="border-radius: 50%; background: white"
              />
            </div>
            <div
              style="
                padding: 10px 0px 0px;
                width: 50%;
                display: flex;
                justify-content: space-between;
              "
            >
              <h6 style="line-height: 2; font-weight: 600">{{ item.name }}</h6>
            </div>
          </div>
          <div style="height: 1px; border-bottom: 1px solid #00388b"></div>
        </li>
      </ul>
    </nav>

    <!-- Page Content  -->
    <div id="content" v-if="currentPeerUser === null">
      <button @click="homepageClick">Go to homepage</button>
      <div class="my-4">
        <img :src="photoURL" width="200px" class="br-50" />
      </div>
      <div>
        <h2>Welcome {{ currentUserName }},</h2>
        <h3>Let's spread love</h3>
      </div>
    </div>
    <div v-else class="header-width">
      <ChatboxForm v-bind:currentPeerUser="currentPeerUser" />
    </div>
  </div>
</template>

<script>
import firebase from "../services/firebase";
import ChatboxForm from "./ChatboxForm.vue";
export default {
  app: "ChatForm",
  components: {
    ChatboxForm,
  },
  data() {
    return {
      currentUserName: localStorage.getItem("name"),
      currentPeerUser: null,
      currentUserId: localStorage.getItem("uid"),
      currentUserPhoto: localStorage.getItem("photoURL"),
      searchUsers: [],
      photoURL: localStorage.getItem("photoURL"),
    };
  },
  methods: {
    homepageClick() {
      this.$router.push("/");
    },
    onProfileClick() {
      this.$router.push("/profile");
    },
    logout() {
      firebase.auth().signOut();
      this.$router.push("/login");
      localStorage.clear();
    },
    letsChat(item) {
      this.currentPeerUser = item;
    },
    async getUserList() {
      const result = await firebase.firestore().collection("users").get();
      if (result.docs.length > 0) {
        let listUsers = [];
        listUsers = [...result.docs];
        listUsers.forEach((item, index) => {
          this.searchUsers.push({
            key: index,
            documentKey: item.id,
            id: item.data().id,
            name: item.data().name,
            URL: item.data().URL,
            description: item.data().description,
          });
        });
      }
    },
  },
  created() {
    if (!localStorage.hasOwnProperty("uid")) this.$router.push("/login");
    this.getUserList();
  },
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
.br-50 {
  border-radius: 50%;
}
.header-width {
  width: calc(100% - 350px);
  min-height: 100vh;
  transition: all 0.3s;
  position: absolute;
  top: 0;
  right: 0;
}
</style>