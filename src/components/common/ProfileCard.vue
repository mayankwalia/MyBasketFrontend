<template>
  <div class="profile-card">
    <div class="profile-picture">
      <img :src="user && user.image_file ? generateGravatarUrl(): generateGravatarUrl()" alt="Profile Picture">
    </div>
    <div class="user-details">
      <h2>{{ user.username }}</h2>
      <p v-if="$store.state.role=='admin'">{{ user.email }}</p>
    </div>
  </div>
</template>
<script>
import md5 from 'md5';
export default {
  name: "ProfileCard",
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {
        return {
          username: '',
          email: '',
        }
      }
    },
  },
  methods: {
    generateGravatarUrl() {
      const emailHash = md5(this.user.email.toLowerCase().trim());
      const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=200&d=identicon&r=g`;

      return gravatarUrl;
    }
  }
};
</script>

<style scoped>
.profile-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  /* Added margin for spacing */
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  text-align: center;
}

.user-details h2 {
  margin: 0;
  font-size: 12px;
  color: #333;
}

.user-details p {
  margin: 4px 0 0;
  font-size: 8px;
  color: #777;
}
</style>