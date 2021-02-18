import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Initialize the gRPC client
const client = new serviceProto.streaming.LoremIpsumService('localhost:50051', grpc.credentials.createInsecure())

// Invoke the Service operation/function to get the stream
const stream = client.generate({ numOfParagraphs: 8 })

stream.on('data', (result) => {
  console.info(result.paragraph)
})

stream.on('end', () => {
  console.info('All paragraphs have been generated.')
})
