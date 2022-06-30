export default {
  queue: {},
  job: {
    delay: 1000,
    attempts: 3,
    timeout: 5000,
    removeOnComplete: true,
    stackTraceLimit: 10,
  },
}
