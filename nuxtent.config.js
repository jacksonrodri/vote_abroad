module.exports = {
  content: [
    ['en/pages', {
      page: '/page',
      permalink: ':slug',
      isPost: false,
      generate: [
        'get'
      ]
    }]
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
