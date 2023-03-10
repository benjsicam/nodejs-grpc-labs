require('google-protobuf/google/protobuf/struct_pb.js')
require('./codegen/sample_pb.js')

const grpc = require('@grpc/grpc-js')
const { faker } = require('@faker-js/faker')

const services = require('./codegen/sample_grpc_pb')

// Service Implementation
const create = ({ request }, callback) => {
  const entity = {
    id: faker.datatype.number(),
    name: request.getName(),
    metadata: request.getMetadata().toJavaScript()
  }

  console.info('Entity Created', entity)

  const response = new proto.entity.Entity()

  response.setId(entity.id)
  response.setName(entity.name)
  response.setMetadata(proto.google.protobuf.Struct.fromJavaScript(entity.metadata))

  callback(null, response)
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(services.EntityServiceService, { create })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
