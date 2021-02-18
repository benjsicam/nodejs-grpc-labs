import fs from 'fs'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Service Implementation
const download = (call) => {
  const { fileName } = call.request

  // Read the file to be sent onto a Readable stream
  const file = fs.createReadStream(`./files/${fileName}`)

  // Send contents from the file on a per chunk basis
  file.on('data', (chunk) => {
    call.write({
      chunk
    })
  })

  // Once everything from the file has been read and sent to the client, end the call
  file.on('end', () => {
    file.close()
    call.end()
  })
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(serviceProto.file.FileDownloadService.service, { download })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
