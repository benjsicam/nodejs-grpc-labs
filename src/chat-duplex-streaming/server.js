import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true,
  enums: String
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Service Implementation
const users = new Map()

// Broadcast message to all clients
const broadcast = (sender, message) => {
  users.forEach((stream, [user]) => {
    if (sender === user) return

    stream.write({
      user: sender,
      message
    })
  })
}

const join = (call) => {
  const user = call.metadata.get('user')

  users.set(user, call)

  broadcast('Server', `${user} has joined the chat.`)
}

const chat = (call, callback) => {
  const { user, message } = call.request

  broadcast(user, message)

  callback(null, {
    status: 'SUCCESS'
  })
}

const leave = ({ request }, callback) => {
  const { user } = request

  users.delete(user)
  broadcast('Server', `${user} has left the chat.`)

  callback(null, {
    status: 'SUCCESS'
  })
}

// Server Setup
const server = new grpc.Server()

// Add Service Implementation to Server
server.addService(serviceProto.chat.ChatService.service, { join, chat, leave })

// Start the gRPC Server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err)

  console.info(`gRPC Server is now listening on port 50051`)

  server.start()
})
