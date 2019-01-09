'use strict'

const EventEmitter = require('events').EventEmitter
const util = require('util')
const spawn = require('threads').spawn

function AddBlock () {
  if (!(this instanceof AddBlock)) {
    return new AddBlock({ threadCount: 2 })
  }
  this.setMaxListeners(100)
  this.pool = []
  this.runner = []
  this.limitCount = 2
}

util.inherits(AddBlock, EventEmitter)

AddBlock.prototype.addJob = function (obj) {
  const self = this
  // Allow only array of base64 chunks
  if (obj && obj.chunks && obj.chunks.constructor === [].constructor) {
    // Add job to the pool
    self.pool.push({
      job: null,
      data: obj // Thread data object
    })
    // start thread work
    if (self.runner.length < self.limitCount) {
      self.startJob(self.pool.pop())
    }
  }
}

AddBlock.prototype.startJob = function (object) {
  const self = this
  const index = self.runner.push(object) - 1
  console.log('DEBUG:1', `starting ${self.runner[index].data.id}`)
  self.runner[index].job = spawn(tHandler)
  self.runner[index] && self.runner[index].data && self.runner[index].job.send(self.runner[index].data)
    .on('message', function (id) {
      const currentIndex = self.runner.findIndex(x => x.data.id === id)
      currentIndex > -1 && self.runner[currentIndex].job.kill()
      currentIndex > -1 && self.runner.splice(currentIndex, 1)
      self.emit('done', { id })
      if (self.runner.length < self.limitCount) {
        let poolItem = self.pool.pop()
        if (poolItem && poolItem.data) {
          self.startJob(self.pool.pop())
        }
      }
    })
    .on('error', function (error) {
      console.log('error at thread', error)
    })
    .on('progress', function (progress) {
      // Update progress from thread. Emit job 'progress' event
      self.emit('progress', progress)
      console.log('on progress', progress)
    })
    .on('exit', function () {
      console.log(`Worker has been terminated`)
    })
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
        console.log(fullProgress)
        progress({
          progress: parseFloat(fullProgress).toFixed(1),
          id: id
        })
      }
      asyncDone()
    })
  }, function () {
    console.log('all done')
    done(id)
  })
}

export default AddBlock
