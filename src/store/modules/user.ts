// 用户状态模块
import { defineStore } from 'pinia';
import { UserState } from '@/types/store/user';
import { localStorage } from '@/utils/storage';
import { resolve } from 'path';
import { LoginFormData } from '@/types/api/system/login';
import fetchApi from '@/api';
import { resetRouter } from '@/router';

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.get('token') || '',
    nickname: '',
    avatar: 'https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif',
    roles: [],
    perms: [],
  }),
  actions: {
    async RESET_STATE() {
      this.$reset();
    },
    login(loginData: LoginFormData) {
      const { username, password, uuid } = loginData;
      return new Promise((resolve, reject) => {
        const getUserInfo = () =>
          fetchApi({
            method: 'post',
            url: '/login',
          });
        getUserInfo().then((res) => {
          const { access_token, token_type } = res.data;
          const accessToken = token_type + ' ' + access_token;
          localStorage.set('token', accessToken);
          this.token = accessToken;
          resolve(access_token);
        });
      });
    },
    /**
     *  获取用户信息（昵称、头像、角色集合、权限集合）
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        const getUserInfo = () => fetchApi({
          method: 'post',
          url:'/getUserInfo'
        })
        getUserInfo()
          .then(({ data }) => {
            if (!data) {
              return reject('Verification failed, please Login again.');
            }
            const { nickname, avatar, roles, perms } = data;
            if (!roles || roles.length <= 0) {
              reject('getUserInfo: roles must be a non-null array!');
            }
            this.nickname = nickname;
            this.avatar = avatar;
            this.roles = roles;
            this.perms = perms;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout() {
      return new Promise((resolve, reject) => {
        const logout = () => fetchApi({
          method: 'post',
          url: '/logout'
        })
        logout()
            .then(() => {
                localStorage.remove('token')
                this.RESET_STATE();
                resetRouter();
                resolve(null);
            }).catch((err) => {
                reject(err)
            });
      });
    },
    // 清除token
    resetToken() {
      return new Promise((resolve) => {
        localStorage.remove('token');
        this.RESET_STATE();
        resolve(null);
      });
    },
  },
});

export default useUserStore;
