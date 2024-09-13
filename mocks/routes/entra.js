export default [
  {
    id: 'entra-id-get-user',
    url: '/entra-id/v1.0/users/:id',
    method: ['GET'],
    variants: [
      {
        id: 'default',
        type: 'json',
        options: {
          status: 200,
          body: {
            employeeId: 'x123456'
          }
        }
      }
    ]
  },
  {
    id: 'entra-id-get-token',
    url: '/:id/oauth2/v2.0/token',
    method: ['GET'],
    variants: [
      {
        id: 'default',
        type: 'json',
        options: {
          status: 200,
          body: {
            "token_type": "Bearer",
            "scope": "http://localhost:4100/.default",
            "expires_in": 7*24*60*60*1000,
            "ext_expires_in": 7*24*60*60*1000,
            "access_token": "access token",
            "refresh_token": "refresh token",
            "id_token": "test token",
            "client_info": "info"
          }
        }
      }
    ]
  }
]
