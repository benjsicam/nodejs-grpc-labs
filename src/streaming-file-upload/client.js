import fs from 'fs'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  enums: String,
  keepCase: true,
  oneofs: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Initialize the gRPC client
const client = new serviceProto.file.FileUploadService('localhost:50051', grpc.credentials.createInsecure())

// Invoke the Service operation/function and get a Writable stream back
const call = client.upload((err, response) => {
  if (err) return console.error(err)

  console.log('Upload Status:', response.status)
})

// Send the file metadata first
call.write({
  metadata: {
    fileName: 'landscape.jpeg'
  }
})

// Read the file to be sent onto a Readable stream
const file = fs.createReadStream('./files/image.jpeg')

// Send the file data per chunk read
file.on('data', (chunk) => {
  call.write({
    file: {
      chunk
    }
  })
})

// Once all chunks have been sent, end the gRPC call
file.on('end', () => {
  call.end()
})
