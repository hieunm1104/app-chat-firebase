<template>
  <div class="mt-4">
    <h2>Welcome to Vue.js Chat App</h2>
    <form class="detail-box my-5">
      <div class="form-group my-3">
        <h4>Signup to Chat</h4>
        <input
          type="text"
          v-model="name"
          class="form-control mb-4 mt-4"
          placeholder="Enter your name..."
        />
        <input
          type="text"
          v-model="email"
          class="form-control mb-4"
          placeholder="Enter your email..."
        />
        <input
          type="password"
          v-model="password"
          class="form-control mb-4"
          placeholder="Enter your password..."
        />
        <router-link :to="{ path: '/login' }">
          <h6 class="mb-3" style="font-weight: 600">Back to login</h6>
        </router-link>
        <button
          style="font-weight: 600"
          type="button"
          v-on:click="signup"
          class="btn btn-primary"
        >
          Signup
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "../services/firebase";
export default {
  app: "SignUp",
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async signup() {
      try {
        const auth = firebase.auth();
        const name = this.name;
        const email = this.email;
        const password = this.password;
        let res = await auth.createUserWithEmailAndPassword(email, password);
        await firebase.firestore().collection("users").doc(res.user.uid).set({
          name,
          email,
          password,
          id: res.user.uid,
          URL: "",
          description: "",
        });
        localStorage.setItem("uid", res.user.uid);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("FirebaseDocumentId", res.user.uid);
        this.name = "";
        this.email = "";
        this.password = "";
        this.$router.push("/login");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped >
input[type="text"],
input[type="password"] {
  margin: 0 auto;
  width: 80%;
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