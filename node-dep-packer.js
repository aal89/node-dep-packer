#!/usr/bin/env node
'use strict';

/**
 * @module node-dep-packer
 * A module to easily and deeply merge package.json files into a singular one.
 */

const deepMerge = require('ramda').mergeDeepRight;
const fs = require('fs');
// A flag to not empty out the default attributes, it will keep the values of the most right package.json.
const keepPackageData = false;
// A default empty package.json structure
const defaultPackageData = {
  name: "",
  version: "",
  description: "",
  main: "",
  scripts: {
    test: "echo \"Error: no test specified\" && exit 1"
  },
  keywords: [],
  author: "",
  license: "",
  dependencies: {},
  devDependencies: {}
}

/**
 * Reads a file from a path and returns the data as a string. Abstracts away every error and returns an empty string
 * if the file was not found.
 * @param {String} path An absolute path to the file.
 */
function readFile(path) {
  try {
    return typeof path === 'string' ? fs.readFileSync(path).toString() : '';
  } catch (e) {
    return '';
  }
}

/**
 * Checks wheter or not data is a string and then evaluates if it's length is greater than 0 and returns the answer.
 * Returns true otherwise.
 * @param {String} data Data in the form as a string.
 */
function isNotEmpty(data) {
  return typeof data === 'string' ? data.length > 0 : true;
}

/**
 * Tries to parse the string into a Javascript object. Returns true if this succeeds, false otherwise. Won't throw
 * errors.
 * @param {String} data Data in the form as a string.
 */
function isJson(data) {
  try {
    JSON.parse(data);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Merges multiple package.json files into one. Accepts a list of strings that should point to package.json files,
 * which it then tries to parse into JSON objects prior to deeply merging them from the right. Discards any unknown
 * values without error. Returns a combined version of all the given package.json files with the attribtues name,
 * version, description, main, scripts, keywords, author and license set to empty (behaviour is overridable through the
 * keepPackageData variable).
 * @param  {...any} packages A list of any defined values.
 */
function merge(...packages) {
  // Merge all package.json file either given through the parameters or through the arguments (process).
  let mergedPacks = packages
    .map(readFile)
    .filter(isNotEmpty)
    .filter(isJson)
    .map(JSON.parse)
    .reduce(deepMerge, defaultPackageData);

  // Reset package.json data to empty ones so that an user can decide for itself what to do with it.
  if (!this.keepPackageData) {
    mergedPacks.name = '';
    mergedPacks.version = '';
    mergedPacks.description = '';
    mergedPacks.main = '';
    mergedPacks.scripts = {
      test: "echo \"Error: no test specified\" && exit 1"
    };
    mergedPacks.keywords = [];
    mergedPacks.author = '';
    mergedPacks.license = '';
  }

  return mergedPacks;
}

module.exports = {
  keepPackageData,
  merge
};
