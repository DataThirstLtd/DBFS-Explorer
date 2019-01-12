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
  self.emit('startJob', object.data)
  const index = self.runner.push(object) - 1
  self.runner[index].job = spawn(self.runner[index].data.type ? uploadHandler : downloadHandler)
  self.runner[index].job.send(self.runner[index].data)
    .on('message', function (transferId) {
      const currentIndex = self.runner.findIndex(x => x.data.transferId === transferId)
      currentIndex > -1 && self.runner[currentIndex].job.kill()
      currentIndex > -1 && self.runner.splice(currentIndex, 1)
      self.emit('done', { transferId })
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
    })
    .on('exit', function () {
      console.log(`Worker has been terminated`)
    })
}

AddBlock.prototype.cancelJob = function ({ transferId }) {
  const self = this
  console.log('on cancel job', transferId)
  if (transferId) {
    const jobIndex = self.runner.findIndex(x => x.data.transferId === transferId)
    console.log('job Index', jobIndex)
    if (jobIndex > -1) {
      if (self.runner[jobIndex].job) {
        // Kill the job
        self.runner[jobIndex].job.kill()
        // Remove from runner
        self.runner.splice(jobIndex, 1)
      }
    }
    const poolIndex = self.pool.findIndex(x => x.data.transferId === transferId)
    console.log('pool Index', poolIndex)
    if (poolIndex > -1) {
      // Remove from pool
      self.pool.splice(poolIndex, 1)
    }
    if (self.runner.length < self.limitCount) {
      let poolItem = self.pool.pop()
      if (poolItem && poolItem.data) {
        self.startJob(self.pool.pop())
      }
    }
  }
  self.emit('abort', { transferId })
}

function uploadHandler ({ url, token, transferId, handle, chunks, endpoint }, done, progress) {
  console.log('on entry uploadHandler')
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
          id: transferId
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
      done(transferId)
    })
  })
}

function downloadHandler ({ url, token, transferId, endpoint, file, targetPath }, done, progress) {
  console.log('on entry downloadHandler')
  console.log('thread entry id', transferId, file, endpoint, url, token, targetPath)
  const fs = this.require('fs')
  const EventEmitter = this.require('events')
  const axios = this.require('axios')
  const events = new EventEmitter()
  events.setMaxListeners(100)
  let fileHandle = null

  const totalSizeBytes = file.size // Total Size of the file in bytes
  let finishedSizeBytes = 0 // Size of downloaded the file in bytes
  let offset = 0 // Offset byte value to start downloading data

  const download = function ({ offset }) {
    axios({
      method: 'get',
      url: `${url}/${endpoint}`,
      data: {
        path: file.path,
        offset: offset
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status === 200) {
        events.emit('response', res)
      } else {
        events.emit('error', `Server response status: ${res.status}`)
      }
    })
  }

  events.on('error', function (error) {
    console.error(error)
  })

  events.on('response', function ({ data }) {
    finishedSizeBytes = finishedSizeBytes + data.bytes_read
    offset = finishedSizeBytes + 1
    console.log('finishedSizeBytes', finishedSizeBytes, 'offset', offset, 'bytes_read', data.bytes_read)
    const fullProgress = (finishedSizeBytes / totalSizeBytes) * 100
    progress({
      progress: parseFloat(fullProgress).toFixed(1),
      transferId: transferId
    })
    fileHandle.write(data.data)
    if (data.bytes_read !== 0) {
      download({ offset: offset + 1 })
    } else {
      console.log('totalSizeBytes', totalSizeBytes)
      console.log('finishedSizeBytes', finishedSizeBytes)
      fileHandle.end()
      // Convert base64 file into original file
      done(transferId)
    }
  })

  // Create file at target path
  fileHandle = fs.createWriteStream(
    targetPath,
    {
      flags: 'w',
      encoding: 'utf8'
    }
  )
  if (fileHandle) {
    download({ offset: 0 })
  } else {
    console.log('TransferActivity -> Unable to open file stream.')
  }
}

export default AddBlock
