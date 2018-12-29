'use strict'

const EventEmitter = require('events').EventEmitter
const util = require('util')
const Pool = require('threads').Pool

function AddBlock () {
  if (!(this instanceof AddBlock)) {
    return new AddBlock()
  }
  this.pool = new Pool(2)
  this.jobs = []
}

util.inherits(AddBlock, EventEmitter)

AddBlock.prototype.addJob = function ({ url, token, chunks, handle, id }) {
  const self = this
  // Allow only array of base64 chunks
  if (chunks && chunks.constructor === [].constructor) {
    // Add job to jobs list
    const index = this.jobs.push({
      id: id, // Job id is same as file transfer id
      handle: handle, // DBFS file handle
      chunks: chunks, // base64 chunk or string
      job: this.pool.run(tHandler) // Thread job handler
    }) - 1 // Get index of current job
    // start thread work
    this.jobs[index].job.send({ url, token, id, handle, chunks })
      .on('done', function () {
        // Thread work finished. Emit job 'done' event
        self.emit('done', { id })
      }).on('progress', function (progress) {
        // Update progress from thread. Emit job 'progress' event
        self.emit('progress', { id, progress })
        console.log('on progress')
      })
  }
}

function tHandler ({ url, token, id, handle, chunks }, done, progress) {
  console.log(url, token, id, handle, chunks.length)
  done()
}

export default AddBlock
