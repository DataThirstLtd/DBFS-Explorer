'use strict'

const EventEmitter = require('events').EventEmitter
const util = require('util')
const Pool = require('threads').Pool

function AddBlock () {
  if (!(this instanceof AddBlock)) {
    return new AddBlock()
  }
  this.jobs = []
  this.pool = new Pool(2)
  this.pool
    .on('done', function (job, message) {
      console.log('Job done:', job)
    })
    .on('error', function (job, error) {
      console.error('Job errored:', job)
    })
    .on('finished', function () {
      console.log('Everything done, shutting down the thread pool.')
      this.pool.killAll()
    })
}

util.inherits(AddBlock, EventEmitter)

AddBlock.prototype.addJob = function ({ url, token, chunks, handle, id, endpoint }) {
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
    this.jobs[index].job.send({ url, token, id, handle, chunks, endpoint })
      .on('done', function () {
        // Thread work finished. Emit job 'done' event
        self.emit('done', { id })
      }).on('progress', function (progress) {
        // Update progress from thread. Emit job 'progress' event
        self.emit('progress', progress)
        console.log('on progress')
      })
  }
}

function tHandler ({ url, token, id, handle, chunks, endpoint }, done, progress) {
  console.log(id, handle)
  const axios = this.require('axios')
  const forEach = this.require('async-foreach').forEach
  const chunksLength = chunks.length - 1
  forEach(chunks, function (chunk, index) {
    const asyncDone = this.async()
    axios.post(
      `${url}/${endpoint}`,
      {
        data: chunk,
        handle: handle
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(({ status }) => {
      console.log(status)
      if (status === 200) {
        const fullProgress = (index / chunksLength) * 100
        progress({
          progress: parseFloat(fullProgress).toFixed(1),
          id: id
        })
      }
      asyncDone()
    })
  }, function () {
    console.log('all done')
    done()
  })
}

export default AddBlock
