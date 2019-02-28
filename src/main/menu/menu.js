/**
 * Default menu template for application
 */

export default [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'Navigator',
    submenu: [
      { id: 'navigator-select-all', label: 'Select All Files/Folders', accelerator: 'CmdOrCtrl+Shift+A' },
      { id: 'navigator-view-properties', label: 'Show Properties', accelerator: 'CmdOrCtrl+I' },
      { id: 'navigator-create-folder', label: 'Create New Folder', accelerator: 'CmdOrCtrl+Shift+N' },
      { id: 'navigator-view-transferstate', label: 'View Downloads/Uploads', accelerator: 'CmdOrCtrl+J' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]
