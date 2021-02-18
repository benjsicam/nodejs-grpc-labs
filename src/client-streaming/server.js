import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Service Implementation
const track = (call, callback) => {
  // Write to log for every location received from client
  call.on('data', (location) => {
    const { lat, lng } = location
    console.info(`Location received. Latitude: ${lat}, Longitude: ${lng}`)
  })

  // Once all locations have already been received, send a response
  call.on('end', () => {
    callback(null, {
      status: 'Locations received.'
    })
  })
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(serviceProto.location.LocationTrackingService.service, { track })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
