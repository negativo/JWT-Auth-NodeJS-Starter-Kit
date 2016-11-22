const shortid = require('shortid')
const sanitizeHtml = require('sanitize-html')
const mongoose = require('../config/database')
const toSlug = require('../lib/slug')

const bodySanitize = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
}

const titleSanitize = {
  allowedTags: [],
  allowedAttributes: [],
}

const postSchema = mongoose.Schema({
  shortId: { type: String, default: shortid.generate },
  oid: { type: Number },
  title: { type: String, required: [true, 'Post title not provided'] },
  slug: { type: String },
  body: { type: String, required: [true, 'Post body not provided'] },
  type: { type: String, default: 'post' },
  media: { type: mongoose.Schema.ObjectId, ref: 'media' },
  created: { type: Date, default: Date.now() },
  metadata: { type: mongoose.Schema.Types.Mixed },
})

postSchema.pre('validate', function preValidatePost(next) {
  const post = this
  if (post.isModified('metadata') && typeof this.metadata !== 'string') {
    try {
      this.metadata = JSON.stringify(this.metadata)
    } catch (e) {
      next(e)
    }
  }
  next()
})

postSchema.pre('save', function preSavePost(next) {
  const post = this
  post.title = sanitizeHtml(post.title, titleSanitize).trim()
  post.slug = toSlug(post.title)
  post.body = sanitizeHtml(post.body, bodySanitize).trim()
  next()
})

/**
 * Return all News Post Type
 * Lean Query for faster homepage render.
 * @return Promise
 */
postSchema.statics.getNewsPost = function getNewsPost(limit) {
  if (limit) {
    return this
      .find({ type: 'news' })
      .sort('-created')
      .limit(limit)
      .populate('media')
      .lean()
  }
  return this.find({ type: 'news' }).sort('-created').populate('media').lean()
}

module.exports = mongoose.model('post', postSchema, 'posts')
