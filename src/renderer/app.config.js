/**
 * Default application configuration
 */

// Number of threads to invoke for download/upload operations
const DEFAULT_THREAD_COUNT = 2

export default {
  /**
   * Azure DBFS API end points
   */
  ENDPOINTS: {
    addBlock: 'api/2.0/dbfs/add-block',
    close: 'api/2.0/dbfs/close',
    create: 'api/2.0/dbfs/create',
    delete: 'api/2.0/dbfs/delete',
    getStatus: 'api/2.0/dbfs/get-status',
    list: 'api/2.0/dbfs/list',
    mkdirs: 'api/2.0/dbfs/mkdirs',
    move: 'api/2.0/dbfs/move',
    put: 'api/2.0/dbfs/put',
    read: 'api/2.0/dbfs/read'
  },
  /**
   * Default thread count for download/upload operations
   */
  defaultThreadCount: DEFAULT_THREAD_COUNT,
  /**
   * Default application settings
   */
  defaultSettings: [
    { key: 'thread-count', value: DEFAULT_THREAD_COUNT }
  ]
}
