module.exports = {
  content: [
    ['state-rules', {
      page: '/states/_state',
      permalink: 'states/:slug',
      anchorLevel: 2,
      isPost: false,
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
    }]
    // ['state-rules', {
    //   page: 'elections/_state',
    //   isPost: false,
    //   generate: [
    //     'get'
    //   ]
    // }]
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
