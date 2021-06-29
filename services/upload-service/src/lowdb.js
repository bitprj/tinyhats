import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

// Use JSON file for storage
const file = join('./', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data
// db.data = { pictures: [] }

export default async function pushDB (fileName, fileLink, fileCategory) {
    // You can also use this syntax if you prefer
    const { pictures } = db.data

    let information = {
        "category" : fileCategory,
        "link" : fileLink,
        "name" : fileName
    }

    pictures.push(information)
    console.log(`Added ${JSON.stringify(pictures[0])}`)

    // Write db.data content to db.json
    await db.write()
    return information
}