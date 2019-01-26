const Joi = require('joi');
const logger = require('./logger');
const {PersistentList,User,Publisher} = require('../lib/clients');

const TYPES = {
  USER : 'users',
  PUBLISHER : 'publishers'
};

const needId = async function (req, res, next) {
  const{id} = req.params;
  const {error, args} = Joi.validate(id, Joi.string().regex(/^[A-Za-z0-9]*(?:-[A-Za-z0-9]+)*$/).min(2).max(50).required());
  if (error !== null) {
    res.send(400,error);
  }
  return next();
};

const needType = function (req, res, next) {
  const{type,id} = req.params;
  if( type === TYPES.USER || type === TYPES.PUBLISHER) {
    req.params.id = keyBuilder(id,type);
    return next();
  }
  res.send(400,'Invalid Type ' + type);
};

const needMember = async function (req, res, next) {
  const{member,type} = req.params;
  const {error, args} = Joi.validate(member, Joi.string().regex(/^[A-Za-z0-9]*(?:-[A-Za-z0-9]+)*$/).min(2).max(50).required());
  
  if (error !== null) {
    res.send(400,error);
  }
  
  let existsProvider;
  if(type === TYPES.USER) {
    existsProvider = User.exists(member);
  
  } else if(type === TYPES.PUBLISHER) {
    existsProvider = Publisher.exists(member);
  }
  
  if (!await existsProvider) {
    res.send(404,type + ":" + member, {member,exists});
  }
  
  return next();
};

const needMeta = async function (req, res, next) {
  const{meta} = req.body;
  const {error, args} = Joi.validate(meta, Joi.object().required());
  if (error !== null) {
    res.send(400,error);
  }
  return next();
};

const keyBuilder = (id,type) => type + '-' +id;

const endpoints = (server) => {
  
  server.post('/follow/:id',needId,needMeta,async function (req, res, next) {
    const {type,meta={},id} = req.params;
    try {
      const keyUser = keyBuilder(id,TYPES.USER);
      const keyPublisher = keyBuilder(id,TYPES.PUBLISHER);
      
      const promises = [
        PersistentList.create(keyUser,[],{type:TYPES.USER,meta}),
        PersistentList.create(keyPublisher,[],{type:TYPES.PUBLISHER,meta})
      ];
      const result = await Promise.all(promises);
      res.send(200,{
        users:keyUser,
        publishers:keyPublisher
      });
      logger.log('info','get',{type,id,meta,result})
    } catch (err) {
      res.send(500,err);
      logger.log('error','get',{type,id,meta,err})
    }
    return next();
  });
  
  server.get('/follow/:id/:type',needId,needType, async function (req, res, next) {
    const {type,id} = req.params;
    try {
      const list = await PersistentList.get(id);
      res.send(200,list);
      logger.log('info','get',{type,id})
    } catch (err) {
      res.send(500,err);
      logger.log('error','get',{type,id,err})
    }
    return next();
  });
  
  server.head('/follow/:id/:type/:member',needId,needType,needMember, async function (req, res, next) {
    const {type,member,id} = req.params;
    try {
      const list = await PersistentList.contains(id,member);
      res.send(200,list);
      logger.log('info','contains',{type,id})
    } catch(err) {
      res.send(500,err);
      logger.log('error','contains',{type,id,err})
    }
    return next();
  });
  
  server.put('/follow/:id/:type/:member',needId,needType,needMember,async function (req, res, next) {
    const {type,member,id} = req.params;
    try {
      const list = await PersistentList.push(id,member);
      res.send(200,list);
      logger.log('info','push',{type,id})
    } catch(err) {
      res.send(500,err);
      logger.log('error','push',{type,id,err})
    }
    return next();
  });
  
  server.del('/follow/:id/:type/:member',needId,needType,needMember, async function (req, res, next) {
    const {type,member,id} = req.params;
    try {
      const list = await PersistentList.pop(id,member);
      res.send(200,list);
      logger.log('info','push',{type,id});
    } catch(err){
      res.send(500,err);
      logger.log('error','push',{type,id,err})
    }
    return next();
  });
  
};

module.exports = endpoints;