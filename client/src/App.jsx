import Note from './components/Note'
import {useState , useEffect} from 'react'
import noteService from './services/notes'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])

  const [newNote, setNewNote] = useState(
    'note...'
  ) 
  const [showAll, setShowAll] = useState(true)

  const [errorMessage, setErrorMessage] = useState('some error happened...')

  //-----------------Fetching data from the server-----------------

  const hook = () => {
    console.log('effect')
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }
  //useEffect is the one in charge of fecthing the inital state of the notes from the server
  useEffect(hook, [])

  console.log('render', notes.length, 'notes')
  
  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })

  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id,changedNote).then(returnedNotes => {
      //at this points the server is udapte but we need to triger a rerender to ensure the ui is updated with the latest data
      
      //setNotes is updating the state of the notes array in your UI with the latest data from the server
      setNotes(notes.map(n => n.id === id ? returnedNotes : n))
    }).catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      
      //This filters the notes array and creates a new array that only includes notes 
      //where the id is not equal to the provided id. It removes the note whose id matches 
      //the given id.
      setNotes(notes.filter(n => n.id !== id))
    })
  }
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange = {handleNoteChange} />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
export default App