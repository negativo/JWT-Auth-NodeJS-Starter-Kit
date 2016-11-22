const shortid = require('shortid')
const mongoose = require('../config/database')
const path = require('path')
const fs = require('fs')
const secrets = require('./../config/secrets')
const Jimp = require('jimp')

const MediaSchema = mongoose.Schema({
  shortId: { type: String, default: shortid.generate },
  filename: { type: String },
  path: { type: String },
  type: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed },
})

MediaSchema.set('toObject', { virtuals: true });
MediaSchema.set('toJSON', { virtuals: true });

MediaSchema.virtual('thumbnail').get(function mediaThumbPathVirtual() {
  return `/${secrets.UPLOAD_DIRNAME}/thumbnail/${this.filename}`
})

MediaSchema.pre('validate', function preValidateMedia(next) {
  const media = this
  if (media.isModified('metadata') && typeof media.metadata !== 'string') {
    try {
      media.metadata = JSON.stringify(media.metadata)
    } catch (e) {
      next(e)
    }
  }
  next()
})

MediaSchema.pre('save', function preSave(done) {
  const media = this
  if (media.isModified('filename')) {
    media.path = `/${secrets.UPLOAD_DIRNAME}/${media.filename}`
  }
  done()
})

MediaSchema.post('save', (media) => {
  if (process.env.MEDIA_MODEL_TEST_SUITE !== 'true') {
    return media.generateThumbnail()
  }
  return null
})

MediaSchema.post('remove', (media, done) => {
  const projectRoot = path.join(__dirname, '../../')
  const uploadDir = path.join(projectRoot, `/${secrets.UPLOAD_DIRNAME}`)
  const file = `${uploadDir}/${media.filename}`
  const thumb = `${uploadDir}/thumbnail/${media.filename}`
  fs.exists(file, (exist) => {
    if (exist) fs.unlinkSync(file)
    fs.exists(thumb, (exist) => {
      if (exist) fs.unlinkSync(thumb)
      return done()
    })
  })
})


/**
 * METHODS
 */

MediaSchema.methods.generateThumbnail = function generateThumbnail() {
  const media = this
  const thumbPath = path.join(process.cwd(), `${process.env.UPLOAD_DIRNAME}/thumbnail/`)
  const fsPath = path.join(process.cwd(), media.path)
  fs.stat(thumbPath, (err, stat) => {
    if (!stat) fs.mkdir(thumbPath)
  })
  return Jimp.read(fsPath)
    .then((image) => {
      // original extension poi boh ch'o sonno
      return Promise.resolve(
        image
        .resize(Jimp.AUTO, 250)
        .quality(50)
        .write(thumbPath + media.filename)
      )
    })
}

module.exports = mongoose.model('media', MediaSchema, 'medias')
