
import { getuser } from '@api/account';
const user = {
    state: {
        user: '',
        org: '',
        role: ''

    },

    mutations: {
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_ORG: (state, org) => {
            state.org = org
        },
        SET_ROLE: (state, role) => {
            state.role = role
        },
    },

    actions: {
        getuserlogin({ commit }) {
            return new Promise((resolve, reject) => {
                getuser().then(async res => {

                    if (res.errCode == 1) {
                        reject(res.data);
                    } else {
                        // vuex 存储数据
                        commit('SET_USER', res.data.user)
                        commit('SET_ORG', res.data.org)
                        commit('SET_ROLE', res.data.role)
                        
                        resolve();
                    }


                }).catch(error => {
                    // console.log(error, 'store');
                    reject(error);

                })
            })




        }
    }
}

export default user
