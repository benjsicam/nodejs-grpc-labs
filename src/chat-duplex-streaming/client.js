import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import readline from 'readline'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true,
  enums: String
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Initialize the gRPC client
const client = new serviceProto.chat.ChatService('localhost:50051', grpc.credentials.createInsecure())

let userName

const clientUi = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const chat = () => {
  const metadata = new grpc.Metadata()

  metadata.set('user', userName)

  const call = client.join(metadata)

  call.on('data', (message) => {
    console.info(`${message.user}: ${message.message}`)
  })

  clientUi.on('line', (text) => {
    if (text === 'exit') return client.leave({ user: userName }, () => process.exit(0))

    client.chat({ user: userName, message: text }, (res) => {})
  })
}

clientUi.question("What's your name? ", (answer) => {
  userName = answer

  chat()
})
