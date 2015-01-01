"use strict";

var path = require("path"),
    fs = require("fs");

/** @type {Array} 除外フォルダ一覧 */
var excludeFolders = [
];

/** @type {Array} 除外ファイル一覧(現状ではファイル名の単純一致を用いる) */
var excludeFiles = [
  "layout.jade",
];

/**
 * 引数で渡された基点から再帰的に存在するファイル一覧を返す。
 *
 * 但し、{@code excludeFolders}に存在するディレクトリは再帰探索対象外として探索しない。
 * @param  {string} base 探索基点パス
 * @return {Array}   探索基点パス以下のファイル一覧(順序は保証されない)
 */
var walk = function(base) {
  return fs.readdirSync(base).reduce(function(prev, cur) {
    var joined = path.join(base, cur);
    if (fs.statSync(path.resolve(joined)).isDirectory()) {
      if (excludeFolders.indexOf(cur) === -1) {
        prev = prev.concat(walk(joined));
      }
    } else {
      prev.push(joined);
    }
    return prev;
  }, []);
};

/**
 * 拡張子を除外したファイルパスを返す
 *
 * @param  {string} filename ファイルパス
 * @return {string}          引数から拡張子が除外された文字列
 */
var splitext = function(filename) {
  return path.join(path.dirname(filename), path.basename(filename, path.extname(filename)));
};

/**
 * base以下を再帰的に探索し、引数のkeyGeneratorとvalueGeneratorの実装に従ってオブジェクトを構築する
 *
 * keyGeneratorおよびvalueGeneratorが指定されていない場合、拡張子を除外したパスを返す。
 * @param {string} base           探索基点となるパス(相対パスを想定)
 * @param {Function} keyGenerator   再帰探索中に見つかったファイル名に対してkey構築を行うメソッド
 * @param {Function} valueGenerator 再帰探索中に見つかったファイル名に対してvalue構築を行うメソッド
 */
var entryFiles = function(base, keyGenerator, valueGenerator) {
  keyGenerator = keyGenerator || function(filename) { return splitext(filename); };
  valueGenerator = valueGenerator || function(filename) { return splitext(filename); };
  return walk(base)
    .filter(function(f) {
      return excludeFiles.indexOf(path.basename(f)) === -1 && path.basename(f).charAt(0) !== "_";
    })
    .reduce(function(prev, cur) {
      prev[keyGenerator(cur)] = valueGenerator(cur);
      return prev;
    }, {});
};


// export
module.exports.entryFiles = entryFiles;
module.exports.splitext = splitext;
