module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.PROXY
      },
    }
  },
  lintOnSave: false
}
