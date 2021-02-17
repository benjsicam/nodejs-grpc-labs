import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Initialize the gRPC client
const client = new serviceProto.math.SubtractionService('localhost:50051', grpc.credentials.createInsecure())

// Invoke the Service operation/function
client.subtract({ minuend: 2890.5, subtrahend: 882.3 }, (err, response) => {
  if (err) return console.error(err)

  console.log('The difference is:', response.difference)
})
