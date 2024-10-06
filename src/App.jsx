import { useState, useEffect } from 'react'
import './App.css'
import Note from './components/Note.jsx'
import axios from 'axios';
import noteServices from './services/Notes.jsx'
function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const noteToShow = showAll?notes:notes.filter(note=>note.important===true) 
  useEffect(()=>{
    console.log('effect')
    noteServices.getAll().then(res=>{setNotes(res.data)})
  },[])

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
    const note=notes.find(n=>n.id==id)
    const changedNote={...note, important: !note.important}
    noteServices.update(id, changedNote).then(res => {
      setNotes(notes.map(note => note.id !== id ? node: res.data))
    }).catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  function addNote(event){
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteServices.create(noteObject).then(res=>{
      setNotes(notes.concat(res.data))
      setNewNote('')
    })
    console.log('clicked', event)
  }

  return (
    <>
      <h1>Notes</h1>
      <button onClick={()=>setShowAll(!showAll)}>show{showAll?" important":" all"}</button>
      <ul>
        {noteToShow.map((note,i) => <Note key={i} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>)}
      </ul>
      <form onSubmit={addNote}>
        <input value = {newNote} type="text" onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
    </>
  )
}

export default App
