const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'tinyhats-commerce',
    brokers: ['kafka-kafka-brokers:9092']
  })

const producer = kafka.producer()

export default function providerPluginExample(userConfig) {
    // return object for analytics to use
    return {
      /* All plugins require a name */
      name: 'kafka-plugin',
      track: ({ payload }) => {
        console.log(payload.event)
        console.log(payload)
        await producer.connect()
        await producer.send({
        topic: 'tinyhats-commerce',
        messages: [
            { value: payload },
        ],
        })

        await producer.disconnect()
      },
      loaded: () => {
        // return boolean so analytics knows when it can send data to third party
        return !!window.myPluginLoaded
      }
    }
  }