import React from 'react'
import ReactDOM from 'react-dom'
import APP from './APP'
import memoryUtils from '../src/utils/memoryUtils'
import storageUtils from '../src/utils/storageUtils'

const user = storageUtils.readUserStore()
memoryUtils.user = user

ReactDOM.render(<APP/>,document.getElementById('root'))