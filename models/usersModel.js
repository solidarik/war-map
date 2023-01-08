import mongoose from 'mongoose'
import crypto from 'crypto'
import config from 'config'

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: 'Имя пользователя отсутствует.'
    },
    login: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      validate: [
        {
          validator: function checkEmail(value) {
            return this.deleted
              ? true
              : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value)
          },
          msg: 'Укажите, пожалуйста, корректный email.'
        }
      ]
    },
    deleted: Boolean,
    passwordHash: {
      type: String,
      required: true
    },
    salt: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true
  }
)

userSchema
  .virtual('password')
  .set(function (password) {
    if (password !== undefined) {
      if (password.length < 3) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.')
      }
    }

    this._plainPassword = password

    if (password) {
      this.salt = crypto
        .randomBytes(config.crypto.hash.length)
        .toString('base64')
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha1'
      )
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined
      this.passwordHash = undefined
    }
  })
  .get(function () {
    return this._plainPassword
  })

userSchema.methods.checkPassword = function (password) {
  console.log('password', password)
  if (!password) return false // empty password means no login by password
  if (!this.passwordHash) return false // this user does not have password (the line below would hang!)

  const cryptoHash = crypto.pbkdf2Sync(
    password,
    this.salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha1'
  )

  return cryptoHash == this.passwordHash
}

export default mongoose.model('users', userSchema, 'users')
