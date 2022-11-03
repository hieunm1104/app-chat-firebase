<template>
  <div class="main">
    <button @click="chatClick">Go to chat</button>
    <div class="create">
      <label for="">img</label>
      <input v-model="data.img" type="text" />
      <label for="">content</label>
      <input v-model="data.content" type="text" />
      <button @click="createPost">Post</button>
    </div>
    <div class="post" v-for="(post, index) in listPost" :key="index">
      <div class="post-user">
        <img class="post-img" :src="post.useravatar" alt="" />
        <div class="post-username">{{ post.username }}</div>
      </div>
      <span class="post-content"> {{ post.content }}</span>
      <img class="post-image" :src="post.img" />

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
      <div class="likeComment">
        <input type="text" v-model="inputList[post.id]" />
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
      inputList: {},
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
        console.log("query", querySnapshot.data());
        if (querySnapshot) {
          this.user = {
            ...querySnapshot.data(),
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
        this.listPost.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      console.log("list post", this.listPost);
    },
    async createPost() {
      console.log("user", this.user);
      console.log({
        img: this.data.img,
        content: this.data.content,
        userid: this.user.id,
        useravatar: this.user.URL,
      });
      if (this.data.img && this.data.content) {
        const querySnapshot = await firebase
          .firestore()
          .collection("post")
          .add({
            img: this.data.img,
            content: this.data.content,
            userid: this.user.id,
            useravatar: this.user.URL,
            username: this.user.name,
          });

        if (querySnapshot) {
          this.data.img = "";
          this.data.content = "";
          this.getPost();
        }
      }
    },
    async commentClick(id) {
      if (this.inputList[id]) {
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
                  useravatar: this.user.URL,
                  userid: this.user.id,
                  comment: this.inputList[id],
                },
              ],
            })
            .then((res) => {
              this.inputList[id] = "";
              this.getPost();
            });
        }
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
            useravatar: this.user.URL,
          });
          console.log("th2", listLike);
        }
        await firebase
          .firestore()
          .collection("post")
          .doc(selectedPost.id)
          .update({ likeList: listLike })
          .then(() => {
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
.post-user {
  display: flex;
  justify-content: center;
  align-items: center;
}
.post-user img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>