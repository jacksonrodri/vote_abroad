module.exports = {
  content: [
    ['rls', {
      page: 'states/_state',
      permalink: 'states/:slug',
      isPost:false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['en/pages', {
      page: '/page',
      permalink: ':slug',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    ['elections', {
      page: '/elections/_state',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    [
      'leos',
      {
        page: 'leos/_state',
        isPost: false,
        generate: [
          'get',
          'getAll'
        ]
      }
    ]
  ],
  api: function(isStatic) {
    return {
      browserBaseURL: isStatic ? process.env.DEPLOY_PRIME_URL : ''
    }
  }
}
