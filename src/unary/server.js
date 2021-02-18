import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Service Implementation
const subtract = ({ request }, callback) => {
  const { minuend, subtrahend } = request

  callback(null, {
    difference: minuend - subtrahend
  })
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(serviceProto.math.SubtractionService.service, { subtract })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
