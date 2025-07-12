module.exports = (req, res) => {
  try {
    const data = req.body.data
    const obj = {
      status: 'Success',
      message: '',
      data: {
        isHideServer: false,
        isUpload: false,
        auth: !!process.env.AUTH_SECRET_KEY,
        model: 'ChatGPTAPI',
        amodel: process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo',
        isApiGallery: !!process.env.MJ_API_GALLERY,
        cmodels: process.env.CUSTOM_MODELS ?? '',
        baiduId: process.env.TJ_BAIDU_ID ?? '',
        googleId: process.env.TJ_GOOGLE_ID ?? '',
        notify: process.env.SYS_NOTIFY ?? '',
      },
    }
    res.writeHead(200).end(
      JSON.stringify(obj),
    )
  }
  catch (e) {
    console.error('session.js', e, req.body)
  }
}
