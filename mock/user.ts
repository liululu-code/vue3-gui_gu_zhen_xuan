// test.ts

import { MockMethod, MockConfig } from 'vite-plugin-mock'


function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        '/public/logo.png',
      username: 'admin',
      password: '123456',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '123456',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}


export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const {username, password} = body
      const checkUser = createUserList().find(
        (item) => {
          return item.username === username && item.password === password
        }
      )
      if (!checkUser) {
        return {
          code: 201,
          data: {
            message: 'username or passwrod error!'
          }
        }
      }
      const {token} = checkUser
      return {
        code: 200,
        data: {
          token
        }
      }
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      const token = request.headers.token
      const user = createUserList().find((item) => {
        return item.token === token
      })

      if (!user) {
        return {
          code: 201,
          data: {
            message: 'unable get userinfo'
            // message: token
          },
        }
      }
      return {
        code: 200,
        data: {
          user: user
        }
      }
    }
  }
]