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
  api: {
    baseURL: process.env.NODE_ENV === 'production'
      ? 'https://http://focused-lamport-4651cf.netlify.com/'
      : 'http://localhost:3000'
  }
}
