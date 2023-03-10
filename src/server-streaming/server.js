import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import _ from 'lodash'
import { faker } from '@faker-js/faker'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Service Implementation
const generate = (call) => {
  const { numOfParagraphs } = call.request

  _.times(numOfParagraphs, () => {
    call.write({
      paragraph: faker.lorem.paragraph()
    })
  })

  call.end()
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(serviceProto.streaming.LoremIpsumService.service, { generate })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
