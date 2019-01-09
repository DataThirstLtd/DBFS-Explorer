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
  self.pool.push({
    job: null,
    data: obj // Thread data object
  })
  if (self.runner.length < self.limitCount) {
    self.startJob(self.pool.pop())
  }
}

AddBlock.prototype.startJob = function (object) {
  const self = this
  const index = self.runner.push(object) - 1
  console.log('DEBUG:1', `starting ${self.runner[index].data.id}`)
  self.runner[index].job = spawn(self.runner[index].data.type ? uploadHandler : downloadHandler)
  self.runner[index].job.send(self.runner[index].data)
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

function uploadHandler ({ url, token, id, handle, chunks, endpoint }, done, progress) {
  if (!(chunks && chunks.constructor === [].constructor)) {
    done()
  }
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
    // Close handle
    axios.post(
      `${url}/api/2.0/dbfs/close`,
      {
        handle: handle
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(({ status }) => {
      if (status === 200) {
        // Closed handle
      } else {
        console.log('DEBUG: UNABLE TO CLOSE HANDLE')
      }
      done(id)
    })
  })
}

function downloadHandler ({ url, token, id, endpoint, file }, done, progress) {
  console.log('thread entry id', id, file, endpoint, url, token)
  const axios = this.require('axios')
  axios.get(
    `${url}/${endpoint}`,
    {
      path: file.path
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  ).then((res) => {
    console.log(res)
  }).catch((error) => {
    console.log(error)
  })
  done()
}

export default AddBlock
