/**
 * Transfer Activity is responsible for upload and download operations.
 */

'use strict'

const EventEmitter = require('events').EventEmitter
const util = require('util')
const spawn = require('threads').spawn

/**
 * TransferActivity class
 */
function TransferActivity ({ threadCount }) {
  if (!(this instanceof TransferActivity)) {
    return new TransferActivity({ threadCount: 2 })
  }
  this.setMaxListeners(100)
  this.pool = []
  this.runner = []
  this.limitCount = threadCount
}

util.inherits(TransferActivity, EventEmitter)

/**
 * Add job into the job queue.
 */
TransferActivity.prototype.addJob = function (obj) {
  const self = this
  self.pool.push({
    job: null,
    data: obj // Thread data object
  })
  self.emit('waitListJob', obj)
  console.log('pool length', self.pool.length, 'runner length', self.runner.length)
  const waitTimer = setInterval(() => {
    if (self.runner.length < self.limitCount) {
      self.startJob(self.pool.pop())
    }
    clearInterval(waitTimer)
  }, 1000)
}

/**
 * Start job from job queue.
 */
TransferActivity.prototype.startJob = function (object) {
  if (object && object.data) {
    const self = this
    self.emit('startJob', object.data)
    console.log('pool length', self.pool.length, 'runner length', self.runner.length)
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
            self.startJob(poolItem)
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
}

/**
 * Cancel queued or current running job
 */
TransferActivity.prototype.cancelJob = function ({ transferId }) {
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

/**
 * Upload thread handler
 */
function uploadHandler ({ url, token, transferId, handle, chunks, endpoint }, done, progress) {
  console.log('on entry uploadHandler', transferId)
  const axios = this.require('axios')
  const forEach = this.require('async-foreach').forEach
  const chunksLength = chunks.length - 1
  const uploadStream = []
  forEach(chunks, function (chunk, index) {
    const asyncDone = this.async()
    uploadStream.push(chunk.toString())
    axios.post(
      `${url}/${endpoint}`,
      {
        data: chunk.toString(),
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
          transferId: transferId
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

/**
 * Download thread handler
 */
function downloadHandler ({ url, token, transferId, endpoint, file, targetPath }, done, progress) {
  console.log('on entry downloadHandler')
  console.log('thread entry id', transferId, file, endpoint, url, token, targetPath)
  const fs = this.require('fs')
  const base64 = this.require('base64-js')
  const EventEmitter = this.require('events')
  const axios = this.require('axios')
  const events = new EventEmitter()
  events.setMaxListeners(100)

  const totalSizeBytes = file.size // Total Size of the file in bytes
  console.log(totalSizeBytes)
  let finishedSizeBytes = 0 // Size of downloaded the file in bytes
  let remainingSizeBytes = 0 // remaining size in bytes = totalSizeBytes - finishedSizeBytes
  const base64String = []

  const download = function ({ offset }) {
    axios({
      method: 'get',
      url: `${url}/${endpoint}`,
      data: {
        path: file.path,
        offset: offset,
        length: 900000
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
    remainingSizeBytes = totalSizeBytes - finishedSizeBytes
    const fullProgress = (finishedSizeBytes / totalSizeBytes) * 100
    console.log(
      'finishedSizeBytes', finishedSizeBytes,
      'bytes_read', data.bytes_read,
      'remainingSizeBytes', remainingSizeBytes,
      'progress', fullProgress
    )
    progress({
      progress: parseFloat(fullProgress).toFixed(1),
      transferId: transferId
    })
    base64String.push(data.data)
    if (remainingSizeBytes > 0) {
      download({ offset: finishedSizeBytes })
    } else {
      console.log(
        'download finish:::',
        'finishedSizeBytes', finishedSizeBytes,
        'totalSizeBytes', totalSizeBytes
      )
      fs.writeFile(
        targetPath,
        base64.toByteArray(base64String.join('')),
        function (err) {
          if (!err) {
            done(transferId)
          } else {
            // Notify error
          }
        }
      )
    }
  })

  download({ offset: 0 })
}

export default TransferActivity
