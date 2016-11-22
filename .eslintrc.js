module.exports = {
  "env": {
    "node": true,
  },
  "ext": ".jsx",
  "ignore": /(test|.conf)/,
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": [
    "import",
  ],
  "parserOptions":{
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  "rules":{
    "no-useless-constructor": ["off"],
    "arrow-body-style": ["off"],
    "one-var": ["off"],
    "one-var-declaration-per-line": ["off"],
    "no-param-reassign": ["off"],
    "max-len": ["warn", 150],
    "semi": ["off"],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "global-require": ["off"],
    "new-cap": ['off'],
  },
}
