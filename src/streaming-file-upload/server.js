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

// Service Implementation
const upload = (call, callback) => {
  let file

  call.on('data', (fileStream) => {
    if (!fileStream.file) {
      // Create the file
      file = fs.createWriteStream(`./files/${fileStream.metadata.fileName}`)
    } else {
      file.write(fileStream.file.chunk)
    }
  })

  call.on('end', () => {
    file.close()

    callback(null, {
      status: 'SUCCESS'
    })
  })
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(serviceProto.file.FileUploadService.service, { upload })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
