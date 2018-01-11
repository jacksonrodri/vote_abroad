module.exports = {
  content: [
    ['en/pages', {
      page: '/page',
      permalink: ':slug',
      isPost: false,
      generate: [
        'get',
        'getAll'
      ]
    }],
    [
      'elections',
      {
        page: 'elections/_state',
        isPost: false,
        generate: ['get', 'getAll']
      }
    ]
    // ['projects', {
    //   page: '/projects/_project',
    //   isPost: false
    // }]
  ],
  api: function(isStatic) {
    return {
      browserBaseURL: isStatic ? process.env.URL : ''
    }
  }
}
