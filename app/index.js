var Generator = require('yeoman-generator');
const https = require('https')
const fetch = require('node-fetch')
const graphql = require('graphql');
const fs = require('fs-extra');

var context = {};
var version = {};
var entities = [];
var managers = [];
var objectTypes = [];
var inputs = [];
var enums = [];

var getArgument = function (argument, relativePath) {
  var result = "";
  relativePath = relativePath || '../objects/';
  if (
    argument.kind == "INPUT_OBJECT" 
    || 
    (argument.type && argument.type.ofType && argument.type.ofType.kind == "INPUT_OBJECT")    
    ) {
    relativePath = '../inputs/';
  }

  if (argument.kind == "ENUM" || (argument.ofType && argument.ofType.kind == "ENUM")) {
    relativePath = '../enums/';
  }
  

  if (argument && argument.name) {
      result += argument.name + ":";
      if (argument.type && argument.type.name) {
          result += ' [' + argument.type.name + '](' + relativePath + argument.type.name + '.md)';
      } else if (argument.type.ofType) {
          result += ' [' + argument.type.ofType.name + (argument.type.kind == "NON_NULL" ? "!": "") + '](' + relativePath + argument.type.ofType.name + '.md)';
      }
      if (argument.defaultValue) {
        result += ' = ' + argument.defaultValue;
      }

      if (argument.description) {
          result += ' *```' + argument.description + '```*';
      }
  }
  return result;
};

var getType = function(type, relativePath) {
  var result = "";
  relativePath = relativePath || '../objects/';

  if (type.kind == "INPUT_OBJECT" || (type.ofType && type.ofType.kind == "INPUT_OBJECT")) {
    relativePath = '../inputs/';
  }

  if (type.kind == "ENUM" || (type.ofType && type.ofType.kind == "ENUM")) {
    relativePath = '../enums/';
  }

  if (type && type.name) {
      result += '[' + type.name + (type.kind == "NON_NULL" ? "!": "") + '](' + relativePath + type.name + '.md)';
  } else if (type.ofType && type.ofType.name){
      result += '[' + type.ofType.name + (type.kind == "NON_NULL" ? "!": "") + '](' + relativePath + type.ofType.name + '.md)';
  } else if (type.ofType && type.ofType.ofType && type.ofType.ofType.name){
    result += '[' + type.ofType.ofType.name + (type.kind == "NON_NULL" ? "!": "") + '](' + relativePath + type.ofType.ofType.name + '.md)';
  } else if (type.ofType && type.ofType.ofType && type.ofType.ofType.ofType && type.ofType.ofType.ofType.name){
    result += '[' + type.ofType.ofType.ofType.name + (type.kind == "NON_NULL" ? "!": "") + '](' + relativePath + type.ofType.ofType.ofType.name + '.md)';
  }

  if (type && type.kind == "LIST" && result.length > 0) {
      result = "[" + result  + "]";
  }
  return result;
}

var getVersion = function(type) {
  var result = "";
  if (version && version.database && type === 'database') {
    result = "*V." + version.database.major  + "." + version.database.minor + "." + version.database.patch + "." + version.database.build + "*";
  }

  if (version && version.ormGenerator && type === 'ormGenerator') {
    result = "*V." + version.ormGenerator.major  + "." + version.ormGenerator.minor + "." + version.ormGenerator.patch + "." + version.ormGenerator.build + "*";
  }

  if (version && version.webAPI && type === 'webAPI') {
    result = "*V." + version.webAPI.major  + "." + version.webAPI.minor + "." + version.webAPI.patch + "." + version.webAPI.build + "*";
  }

  if (version && version.managers && type === 'managers') {
    result = "*V." + version.managers.major  + "." + version.managers.minor + "." + version.managers.patch + "." + version.managers.build + "*";
  }
  return result;
}

var getName = function() {
  var result = "";
  if (context && context.queryType){
    result = context.queryType.name.replace('Query', '');
  }
  return result;
}

module.exports = class extends Generator {
  
};


class MyBase extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);

      this.argument("graphqlUrl", { type: String, required: false });
      this.argument("token", { type: String, required: false });
    }
  async fetchSchemaJSON(url) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.options.token,
      },
      agent: new https.Agent({
        rejectUnauthorized: false
      }),
      body: JSON.stringify({ query: graphql.getIntrospectionQuery() })
    })
      .then(res => res.json())
      .then(result => result.data)
  }

  async fetchVersionJSON(url) {
    console.log(url);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      agent: new https.Agent({
        rejectUnauthorized: false
      }),
    })
      .then(res => res.json())
      .catch(error => {
        return JSON.stringify('{"database":{"major":0,"minor":0,"patch":0,"build":0},"ormGenerator":{"major":0,"minor":0,"patch":0,"build":0},"webAPI":{"major":0,"minor":0,"patch":0,"build":0},"managers":{"major":0,"minor":0,"patch":0,"build":0}}');
      })
  }
  
}

module.exports = class extends MyBase {
  async configuring() {
    var data = await this.fetchSchemaJSON(this.options.graphqlUrl);
    version = await this.fetchVersionJSON(this.options.graphqlUrl.replace(/graphql/ig, 'version'));
    context = data.__schema;
    var rootDir =  this.destinationPath('docs');
    //Remove and re-add if exists, clears previous output
    if (fs.existsSync(rootDir)) {
      var retry = 0;
      while (true) {
          try {
              fs.removeSync(rootDir);
              break;
          }
          catch (error) {
              console.error("Error deleting root folder, retrying");
              retry++;
              if (retry > 10) throw error;
              await new Promise(resolve => setTimeout(resolve, 2500));
          }
      }
    }
  }

  _findEntity(entity, prefix){
    return context.types.find(s => s.name == context.queryType.name).fields.find(s => s.name == (prefix + entity));
  }

  _findManagerQueries(name){
    return context.types.find(s => s.name == context.queryType.name).fields.filter(s => s.name.includes(name));
}

  _findManagerMutations(name){
    return context.types.find(s => s.name == context.mutationType.name).fields.filter(s => s.name.includes(name));
  }

  _findManagerSubscriptions(name){
    return context.types.find(s => s.name == context.subscriptionType.name).fields.filter(s => s.name.includes(name));
  }
  
  _getEntities() {
    var queryfields = context.types.find(s => s.name == context.queryType.name).fields;
    queryfields.forEach(query => { 
     if (query.name.startsWith('get'))
      {
          let name = query.name.substring(3);
          entities.push(
              { 
                  name,
                  get: this._findEntity(name, 'get'),
                  sum: this._findEntity(name, 'sum'),
                  average: this._findEntity(name, 'average'),
                  search: this._findEntity(name, 'search')
              })
      }
    })
  }

  _getManagers() {
    var types =  context.types.filter(s => 
      s.name == context.mutationType.name
      ||
      s.name == context.queryType.name
      ||
      s.name == context.subscriptionType.name
      );
      types.forEach(type => {
      if (type && type.fields) {
        type.fields.forEach(query => { 
          if (query.name.includes('Manager_'))
          {
              let name = query.name.substring(0, query.name.indexOf("Manager_") + 'Manager'.length );
              if (!managers.find(o => o.name == name)) {
                  managers.push({
                      name,
                      queries: this._findManagerQueries(name),
                      mutations: this._findManagerMutations(name),
                      subscriptions: this._findManagerSubscriptions(name)
                  });
              } 
          }
        })
      }
    })
  }

  _getObjectTypes() {
    context.types.filter(s => s.kind == "OBJECT" || s.kind == "SCALAR").forEach(objectType => {
      if (!objectTypes.find(o => o.name == objectType.name)) {
          objectTypes.push(objectType);
          } 
      }
    );
  }

  _getInputs() {
    context.types.filter(s => s.kind == "INPUT_OBJECT").forEach(input => {
      if (!inputs.find(o => o.name == input.name)) {
            inputs.push(input);
          } 
      }
    );
  }

  _getEnums() {
    context.types.filter(s => s.kind == "ENUM").forEach(input => {
      if (!enums.find(o => o.name == input.name)) {
            enums.push(input);
          } 
      }
    );
  }

  async writing() {
    this._getEntities();
    entities.forEach(entity => {
      this.fs.copyTpl(
        this.templatePath('entities/{name}.md'),
        this.destinationPath('docs/entities/{name}.md'.replace('{name}',entity.name)),
        { entity : entity, getArgument, getType }
      );
    })

    this._getManagers();
    managers.forEach(manager => {
      this.fs.copyTpl(
        this.templatePath('managers/{name}.md'),
        this.destinationPath('docs/managers/{name}.md'.replace('{name}',manager.name)),
        { manager : manager, getArgument, getType }
      );
    })

    this._getObjectTypes();
    objectTypes.forEach(objectType => {
      this.fs.copyTpl(
        this.templatePath('objects/{name}.md'),
        this.destinationPath('docs/objects/{name}.md'.replace('{name}',objectType.name)),
        { objectType, getArgument, getType }
      );
    })

    this._getInputs();
    inputs.forEach(input => {
      this.fs.copyTpl(
        this.templatePath('inputs/{name}.md'),
        this.destinationPath('docs/inputs/{name}.md'.replace('{name}',input.name)),
        { input, getArgument, getType }
      );
    })


    this._getEnums();
    enums.forEach(input => {
      this.fs.copyTpl(
        this.templatePath('enums/{name}.md'),
        this.destinationPath('docs/enums/{name}.md'.replace('{name}',input.name)),
        { input, getArgument, getType }
      );
    })

    this.fs.copyTpl(
      this.templatePath('readme.md'),
      this.destinationPath('docs/readme.md'),
      { 
        entities,
        managers,
        objectTypes,
        inputs,
        enums, 
        getVersion,
        getName
      }
    );

    this.fs.copyTpl(
      this.templatePath('schema.json'),
      this.destinationPath('docs/schema.json'),
      { 
        context
      }
    );
    
  }
};