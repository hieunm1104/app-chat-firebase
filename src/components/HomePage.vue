<template>
  <div class="main">
    <button @click="chatClick">Go to chat</button>
    <div class="create">
      <label for="">img</label>
      <input v-model="data.img" type="text" />
      <label for="">content</label>
      <input v-model="data.content" type="text" />
      <button @click="createPost">dang bai</button>
    </div>
    <div class="post" v-for="(post, index) in listPost" :key="index">
      <div class="post-username">{{ post.username }}</div>
      <img class="post-image" :src="post.img" />
      <span class="post-content"> {{ post.content }}</span>
      <img class="post-img" :src="user.avatar" alt="" />
      <div class="post-likelist" v-if="post.likeList">
        <div v-for="(like, i) in post.likeList" :key="i">
          <div>{{ like.username }},</div>
        </div>
      </div>
      <div class="post-comment" v-if="post.comments">
        <div v-for="(comment, i) in post.comments" :key="i">
          <div>
            <img class="post-comment-img" :src="comment.useravatar" alt="" />
            <span>{{ comment.username }}</span>
          </div>
          <div>{{ comment.comment }}</div>
        </div>
      </div>
      <div>
        <input type="text" v-model="inputComment" />
        <button @click="commentClick(post.id)">Comment</button>
        <button @click="likeClick(post.id)">Like</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../services/firebase";
export default {
  data() {
    return {
      listPost: [],
      data: {},
      inputComment: "",
      user: {},
    };
  },
  async mounted() {
    this.getPost();
    this.getUser();
  },
  methods: {
    chatClick() {
      this.$router.push("/chat");
    },
    async getUser() {
      let uid = localStorage.getItem("uid");
      if (uid) {
        const querySnapshot = await firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get();
        if (querySnapshot) {
          this.user = {
            ...querySnapshot.data(),
            id: uid,
          };
          console.log(this.user);
        }
      } else {
        console.log("no");
      }
    },
    async getPost() {
      this.listPost = [];
      const querySnapshot = await firebase.firestore().collection("post").get();
      querySnapshot.forEach((doc) => {
        this.listPost.push({ ...doc.data(), id: doc.id });
      });
    },
    async createPost() {
      if (this.data.img && this.data.content) {
        const querySnapshot = await firebase
          .firestore()
          .collection("post")
          .add({
            img: this.data.img,
            content: this.data.content,
            userid: this.user.id,
            useravatar: this.user.avatar,
          })
          .then((res) => {
            this.getPost();
          });
      }
    },
    async commentClick(id) {
      let selectedPost = this.listPost.find((post) => post.id === id);
      if (selectedPost) {
        await firebase
          .firestore()
          .collection("post")
          .doc(selectedPost.id)
          .update({
            comments: [
              ...(selectedPost.comments != null
                ? [...selectedPost.comments]
                : []),
              {
                username: this.user.name,
                useravatar: this.user.avatar,
                userid: this.user.id,
                comment: this.inputComment,
              },
            ],
          })
          .then((res) => {
            this.getPost();
          });
      }
    },
    async likeClick(id) {
      let selectedPost = this.listPost.find((post) => post.id === id);
      if (selectedPost) {
        let listLike = selectedPost.likeList ? selectedPost.likeList : [];
        if (
          listLike.findIndex((a) => {
            return a.userid === this.user.id;
          }) > -1
        ) {
          listLike = listLike.filter((a) => {
            a.userid != this.user.id;
          });
          console.log("th1", listLike);
        } else {
          listLike.push({
            userid: this.user.id,
            username: this.user.name,
            useravatar: this.user.avatar,
          });
          console.log("th2", listLike);
        }
        await firebase
          .firestore()
          .collection("post")
          .doc(selectedPost.id)
          .update({ likeList: listLike })
          .then((res) => {
            this.getPost();
          });
      }
    },
  },
  created() {
    console.log("created");
    firebase.auth().onAuthStateChanged((user) => {
      if (user == null) {
        this.$router.push("/login");
      }
    });
  },
};
</script>

<style lang="css">
.post {
  margin-bottom: 20px;
  background-color: aqua;
}
.post-image {
  width: 200px;
  display: block;
  margin: auto;
}
.post-likelist {
  display: flex;
  background-color: green;
}
.post-comment {
  background-color: red;
}
.post-comment-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.post-img {
  width: 100px;
}
</style>