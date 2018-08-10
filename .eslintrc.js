module.exports = {
    "extends": "standard",
    // "ignore-pattern": "./.eslintrc.js",
    "rules": {
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": true
        }],
        "no-underscore-dangle": 0,
        "no-var": 2,
        "camelcase": ["warn"],
        "indent": ["error", 4],
        "comma-dangle": 1,
        "max-len": 1,
        "no-multi-str": 1,
        "global-require": 1,
        "no-mixed-operators": 1,
        "no-control-regex":0
    },
    "env": {
        "node": true,
        "mocha": true
    }
}
