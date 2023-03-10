require('google-protobuf/google/protobuf/struct_pb.js')
require('./codegen/sample_pb.js')

const grpc = require('@grpc/grpc-js')
const { faker } = require('@faker-js/faker')

const services = require('./codegen/sample_grpc_pb')

// Initialize the gRPC client
const client = new services.EntityServiceClient('localhost:50051', grpc.credentials.createInsecure())

const entity = new proto.entity.Entity()
entity.setName(faker.name.firstName())
entity.setMetadata(
  proto.google.protobuf.Struct.fromJavaScript({
    email: faker.internet.email(),
    isMember: faker.datatype.boolean(),
    license: faker.datatype.number(),
    location: {
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    },
    restrictions: [1, '12', true]
  })
)

// Invoke the Service operation/function
client.create(entity, (err, response) => {
  if (err) return console.error(err)

  const entity = {
    id: response.getId(),
    name: response.getName(),
    metadata: response.getMetadata().toJavaScript()
  }

  console.log('Entity Created', entity)
})
