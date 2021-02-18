// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var sample_pb = require('./sample_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

function serialize_entity_Entity(arg) {
  if (!(arg instanceof sample_pb.Entity)) {
    throw new Error('Expected argument of type entity.Entity');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_entity_Entity(buffer_arg) {
  return sample_pb.Entity.deserializeBinary(new Uint8Array(buffer_arg));
}


var EntityServiceService = exports.EntityServiceService = {
  create: {
    path: '/entity.EntityService/create',
    requestStream: false,
    responseStream: false,
    requestType: sample_pb.Entity,
    responseType: sample_pb.Entity,
    requestSerialize: serialize_entity_Entity,
    requestDeserialize: deserialize_entity_Entity,
    responseSerialize: serialize_entity_Entity,
    responseDeserialize: deserialize_entity_Entity,
  },
};

exports.EntityServiceClient = grpc.makeGenericClientConstructor(EntityServiceService);
