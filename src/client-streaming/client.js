import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import _ from 'lodash'
import { faker } from '@faker-js/faker'

// Resolve the Protobuf Definition
const SERVICE_PROTO = './sample.proto'

const packageDefinition = protoLoader.loadSync(SERVICE_PROTO, {
  keepCase: true
})

const serviceProto = grpc.loadPackageDefinition(packageDefinition)

// Initialize the gRPC client
const client = new serviceProto.location.LocationTrackingService('localhost:50051', grpc.credentials.createInsecure())

// Invoke the Service operation/function
const call = client.track((err, response) => {
  if (err) return console.error(err)

  console.log('Response:', response.status)
})

_.times(faker.datatype.number({ min: 5, max: 20 }), () => {
  call.write({
    lat: faker.address.latitude(),
    lng: faker.address.longitude()
  })
})

call.end()
