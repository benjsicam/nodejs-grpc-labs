import fs from 'fs'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Initialize the gRPC client
const client = new serviceProto.file.FileDownloadService('localhost:50051', grpc.credentials.createInsecure())

// Invoke the Service operation/function
const call = client.download({ fileName: 'image.jpeg' })

// Create the file through a writable stream
const file = fs.createWriteStream('./files/landscape.jpeg')

// Write the chunks obtained from the server onto the file
call.on('data', (fileStream) => {
  file.write(fileStream.chunk)
})

// Call has been ended by the server. Signifies that all data from the file has been downloaded
call.on('end', () => {
  file.close()

  console.info('File has been downloaded successfully')
})
