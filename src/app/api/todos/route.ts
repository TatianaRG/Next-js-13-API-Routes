import { NextResponse } from 'next/server'
import { limiter } from '../config/limiter'

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos"

const API_KEY: string = process.env.DATA_API_KEY as string

//GET operation /todos
export async function GET(request: Request) {
  const res = await fetch(DATA_SOURCE_URL)

  const todos: Todo[] = await res.json()

  const origin = request.headers.get('origin')

  // MAKE USE OF nmp limiter package
  const remaining = await limiter.removeTokens(1)
  console.log('remaining: ', remaining)
  if (remaining < 0) {
    return new NextResponse(null, {
      status: 429,
      statusText: "Too Many Requests",
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain',
      }
    })
  }

  // if it maded through middleware 
  return new NextResponse(JSON.stringify(todos), {
    headers: {
      'Access-Control-Allow-Origin': origin || "*",   //resources allowed for origin and tools like postman or thunder client
      'Content-Type': 'application/json',
    }
  })
}
//DELETE operation 
export async function DELETE(request: Request) {
  const { id }: Partial<Todo> = await request.json()

  if (!id) return NextResponse.json({ "message": "Todo id required" })

  await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    }
  })

  return NextResponse.json({ "message": `Todo ${id} deleted` })
}
//POST operation 
export async function POST(request: Request) {
  const { userId, title }: Partial<Todo> = await request.json()

  if (!userId || !title) return NextResponse.json({ "message": "Missing required data" })

  const res = await fetch(DATA_SOURCE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify({
      userId, title, completed: false
    })
  })

  const newTodo: Todo = await res.json()

  return NextResponse.json(newTodo)
}
//PUT operation 
export async function PUT(request: Request) {
  const { userId, id, title, completed }: Todo = await request.json()

  if (!userId || !id || !title || typeof (completed) !== 'boolean') return NextResponse.json({ "message": "Missing required data" })

  const res = await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify({
      userId, title, completed
    })
  })

  const updatedTodo: Todo = await res.json()

  return NextResponse.json(updatedTodo)
}