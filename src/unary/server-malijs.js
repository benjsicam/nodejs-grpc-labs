import Mali from 'mali'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

// Service Implementation
const SubtractionService = {
  subtract: async ({ req, response }) => {
    response.res = {
      difference: req.minuend - req.subtrahend
    }

    return response.res
  }
}

// Server Setup
const server = new Mali()

// Add the Service Proto to the Server
server.addService(SERVICE_PROTO, null, {
  keepCase: true
})

// Add Service Implementation to Server
server.use({
  SubtractionService
})

// Start the gRPC Server
server.start('0.0.0.0:50051')

console.info(`MaliJS gRPC Server is now listening on port 50051`)
