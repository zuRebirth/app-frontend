export default [
    // 登录接口
    {
        url: '/api/login',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: 'ok',
                data: {
                  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJkZXB0SWQiOjIsImV4cCI6MTY1NzQ2NDQ1MCwidXNlcklkIjoyLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJqdGkiOiI4MTA3ZWNhMy0xYWNmLTRkZDItYWY5Yi0xMWVkZGViZmQxNzkiLCJjbGllbnRfaWQiOiJtYWxsLWFkbWluLXdlYiIsInVzZXJuYW1lIjoiYWRtaW4ifQ.XbdL6Fbs-TlD1U_CDGyKvofEUyr0KHu3zwrYTrdwSftpYydVndRVWarbIbF3DrZ-PLGDxKui7bBU4SLlaFnPmv-mvoxTVIVpIno9xvQzFMTmlbrGdtWaFl7hlcq7pZTg3z1ldc5dsqKCE9LQAwBhksAL_t24wVtR_W3CIrUNlnFsn18v4RMoxHsR9jactulTQh249vPWo7shPhfn5fbrekvHQK25yIVvfMwWNwD_z1V7cP9eeiB89z6LUUETtbNLWTmWFfi9jfiw1C1YdYikL_9i5jnOEbLu2BD1SV2R2r6rYfyh2Iw2xBGFgXXI5npGWdRGdqTrqgtbNc23tp1jfw",
                  "token_type": "bearer",
                  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiI4MTA3ZWNhMy0xYWNmLTRkZDItYWY5Yi0xMWVkZGViZmQxNzkiLCJkZXB0SWQiOjIsImV4cCI6MTY1NzQ2ODA1MCwidXNlcklkIjoyLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJqdGkiOiJjMjQxMzZiMi1mZWM4LTQ3NTUtYTQ4Ny1kNjcyZjY3MDhmOWEiLCJjbGllbnRfaWQiOiJtYWxsLWFkbWluLXdlYiIsInVzZXJuYW1lIjoiYWRtaW4ifQ.bDUyv_uvx96krefBJKLVKZ7Sl9RPCMAtKxul4W3uCbqK0N7xAjTdC2kKVJVVY4NaGrUu4l80cKcCC2UU8MAEBHDC6xTPDQwlYEyHxQKsQY7qsiDYAwPNxnd574oY3WOit6f1zXVLg6iekgFiAR8tfCz1Th238-xinpKLeWhB5YgjlYRLJg5tRBRzGZJRVtady1RxrvY6PDD-1KOo40GPg1UnqvPKIkObxKGHau-JnzcSdt9YhPYYwnpzF2VJqVNqgESwZ2u8LEVWMRlclNwkjvceL_Kmq6MH7pWluS3JxuGYNhenINtaPf1cfa8XdAAlTJOApUg6bcjmSd1gKOFoHA",
                  "expires_in": 3599,
                  "scope": "all",
                  "deptId": "2",
                  "userId": "2",
                  "username": "admin",
                  "jti": "8107eca3-1acf-4dd2-af9b-11eddebfd179"
                }
            }
        },
    },
    // 获取验证码
    {
      url: '/api/getCaptcha',
      method: 'get',
      response: () => {
          return {
              code: 200,
              message: 'ok',
              data: {
                "uuid": "a973a121e2f94259a3e9d8f4adc57897",
                "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAkCAIAAADNSmkJAAAFCklEQVR42u2Yf0wTZxjHyRIXTXT7x2x/jDlnzLI/NEumuJCx7B//3LJsmfvPxSwGmQSGYsIwxIiEZHEGs2imKLBBS5nyozCYWt1A1MmAttCWUgpIKVCgpbTQ1rVcr333PW/CKFDKXaV1eZ+8ad57+l7u3s89932e5xIItXWxBIqAgqagqVHQFDQFTY2CpqAXmanb1FzafO3UNVmurPp0dWtFq8Voia9dmptI034i205ufkSsbc8faJfdVVdYV1NQY3hgcE44cWjWmtW/qUH8xg83vG5vXFAeqiHSRKI5R6Z1RHmalG+NCWvhoGets9IcaU9Lz9K/GB+DuEaMxwXr6l3E+PPCIVgjrp8X0IFAACqB4A2zprO+E3Ede9DFCYRxLxw6DVyAxyFoJhAs0k6+W9u7uUz9aoXmE8XgvQm38aFR/p0cuMM/jKq8qijqtXLPnjBjxdOqdnLqMW/QEOh1VJTfTCorSX4+ycwkGRmkqIgYjUJBz8yx78kNCcXKkNF0vmngr4FVb0X3uw4asg6gDYcOrXhaz0VOPcAacQ0NQTgjN0bDUlNDR1oa0esFgf5UMQisW8u7K/rtzjnW4w/cHJn98FdjWUbZtGV61VvBGijMM30lB48dA2irTBZuEVgjrqEhPPEoWUEBaWkhdjvx+4nFwkU0WBcWrh30gwk3KL9wRdlu9YTqXmpxJLficXiQMJ8dZdbtViUnK5OSmKmpmOcCp5MDffTo2kEfuWcG6M/vPFr6V0l6Ccuwq157zDC2P6s5IVW57Vut1eWf92P+eo4W/iNSs5i92RsaEM5G7C8ODEGNG8nNXTvo3dV6gJYOLCMRDWcbAHHVa2tua26XNKec7QPTD77vY9ggl13ZIObwwM97BFt/ejpA22prY055fJzk5XGgb91aO+iXfuoCaL3De15r3VGle/GqartMm/nnyJTXjyyn+FERSQmIvjEkfvGLeWKOdnKWEbM3v8OhSkpS7dvnx0srOo8tOyLtjU0kK4tbf+ECWakQCwca6gzQaffNISXHmzLd+KwP4os+MMzp7XXt6Bv5ucr8eFO6Gnw/vjiA343p6s7hxyKDyHb9OsK5H4VVNAoGwaCRHY4f5xZfvsxlRSHl3aZSNbC+UamVm5wOH4tRZ3ImSrU8fduwTXJC0tvau+y5aMrxJNCUz3tkHdNAzI+KNrv4t7Xv8GGAtjc2xlY0wBeUS0tJMCi0YUF7AqYtFtd/nX9YXHC+JtVwMTVsA020f0OqIXTkfPMNrWg81wjR4D0LLbuXfSW7G5R3nNT5A0GR25uzWpV796LkQOERW9C8aMzMiOgMk+u5VsXNLFIdF8PCueGq6t8Ci2Gh18iNqENQ86G+Ri+DvnFp0/jFlUfzEX2iZlTk9iYlEoTzYHZ2tHoNwdLBrwwGRYBG3lspordVate0sUutNvDdktlV3mbf8LUKc3mXUwzo3oMHAdqhUMQJaFHfOtqsHp5p/VONlj/V6KyHI5HvSjP698YnmbCqg6sUi+5MYv7yN10DVp8wTL7RUVBWp6QEvPHxJVb8R6WMJ0EdMnZV69GOR3gBjy/w9qkekE2VDM87P7s0CM87Z/ReJiCkaC0pAeihlXqD9bUoRDRvFf329xv6NpepUUe/9UvPyY4xF8NGfh9flpnAdHf+IqZIjDvzdPB/VT4sYG/6AwcA2nn37v8KNLX1kA5qFDQFTY2CpqApaGoUNAVNbRn7BxcFhJ/JyAQiAAAAAElFTkSuQmCC"
              }
          }
      },
    },
    // 获取登录权限
    {
      url: '/api/getUserInfo',
      method: 'post',
      response: () => {
          return {
              code: 200,
              message: 'ok',
              data: {
                "userId": "2",
                "nickname": "系统管理员",
                "avatar": "https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif",
                "roles": [
                    "ADMIN"
                ],
                "perms": [
                    "sys:user:view",
                    "sys:user:edit"
                ]
            }
          }
      },
    },
    // 注销用户
    {
      url: '/api/logout',
      method: 'post',
      response: () => {
          return {
              code: 200,
              message: 'ok',
              data: "注销成功"
          }
      },
    },
]