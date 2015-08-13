#!/usr/bin/env node

var fs = require('fs');
var shell = require('shelljs');

var config = JSON.parse(fs.readFileSync("../keys/config.json"));
var Duplicity = require('../lib/duplicity');
var duplicity = new Duplicity(config);

duplicity.backup();
