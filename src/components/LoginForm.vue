<template>
  <div class="mt-4">
    <h2>Welcome to Vue.js Chat App</h2>
    <form class="detail-box my-5">
      <div class="form-group my-3">
        <h4>Login to Chat</h4>
        <input
          type="text"
          v-model="email"
          class="form-control mb-4 mt-4"
          placeholder="Enter your email..."
        />
        <input
          type="password"
          v-model="password"
          class="form-control mb-4"
          placeholder="Enter your password..."
          v-on:keyup.enter="login"
        />
        <router-link :to="{ path: 'signup' }">
          <h6 class="mb-3" style="font-weight: 600">Create an account</h6>
        </router-link>

        <button
          type="button"
          v-on:click="login"
          class="btn btn-primary"
          style="font-weight: 600"
          v-on:keyup.enter="login"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "../services/firebase";
export default {
  app: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const auth = firebase.auth();
        const res = await auth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
        console.log("a", res);
        if (res.user) {
          let querySnapshot = await firebase
            .firestore()
            .collection("users")
            .where("id", "==", res.user.uid)
            .get();
          console.log("query", querySnapshot);
          querySnapshot.forEach((doc) => {
            console.log("doc", doc);
            let userData = doc.data();
            localStorage.setItem("uid", res.user.uid);
            localStorage.setItem("name", userData.name);
            localStorage.setItem("email", userData.email);
            localStorage.setItem("password", userData.password);
            localStorage.setItem("photoURL", userData.URL);
            localStorage.setItem("description", userData.description);
            localStorage.setItem("FirebaseDocumentId", userData.id);
            this.$router.push("/chat");
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    if (localStorage.getItem("uid")) this.$router.push("/chat");
  },
};
</script>

<style scoped>
input[type="text"],
input[type="password"] {
  margin: 0 auto;
  width: 80%;
  border: 1px solid lightgrey;
}
.detail-box {
  padding: 5px;
  border: 1px solid lightgrey;
  width: 400px;
  min-height: 250px;
  margin: 0 auto;
}
h2,
h4 {
  color: dodgerblue;
  font-weight: 600;
}
</style>