import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

//cwd meaning = current directory
//path: path.join(process.cwd(), ".env") meaning , join the current path and '.env' path. This way one can make full path for '.env file' .
// in node.js direct path outside of src(root directory) can not be called directly. so this join method is used !

export const { PORT, DB_URL, DEFAULT_PASS, NODE_ENV } = process.env
