let serial_number = 1
const debug = (message) => {
  console.log(`\x1b[33m debug #${serial_number}: ${message}`)
  serial_number++
}

module.exports = debug
