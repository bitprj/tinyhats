const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'tinyhats-commerce',
    ssl: true,
    brokers: [
      'http://kafka1:9092',
    ]
  })

    // http://kafka-kafka-external-bootstrap:32085

const producer = kafka.producer()

async function kafkaPlugin(payload) {

  await producer.connect()
  await producer.send({
  topic: 'tinyhats-commerce',
  messages: [
      { value: payload },
  ],
  })

  await producer.disconnect()
    // // return object for analytics to use
    // return {
    //   /* All plugins require a name */
    //   name: 'kafka-plugin',
    //   track: async ({ payload }) => {
    //     console.log(payload.event)
    //     console.log(payload)
    //     await producer.connect()
    //     await producer.send({
    //     topic: 'tinyhats-commerce',
    //     messages: [
    //         { value: payload },
    //     ],
    //     })

    //     await producer.disconnect()
    //   },
    //   loaded: () => {
    //     // return boolean so analytics knows when it can send data to third party
    //     return !!window.myPluginLoaded
    //   }
    // }
  }

module.exports.kafkaPlugin = kafkaPlugin