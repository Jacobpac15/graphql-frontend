import React, { useState } from 'react'
import { gql } from '@apollo/client'
import client from './clientInstance' // we'll create this small file below

// Fixed selectable fields:
const STUDENT_FIELDS = ['id', 'firstName', 'lastName', 'age', 'email']
const CAT_FIELDS = ['id', 'name', 'origin', 'description']

// Helper: build GraphQL query string for students
function buildStudentsQuery(selectedFields) {
  const body = selectedFields.length ? selectedFields.join('\n') : 'id'
  return gql`query { students { ${body} } }`
}

// Helper: build GraphQL query for catBreed by id
function buildCatQuery(selectedFields, id) {
  const body = selectedFields.length ? selectedFields.join('\n') : 'id name'
  // use variable to avoid string interpolation issues
  return {
    query: gql`query GetCat($id: Int!) { catBreed(id: $id) { ${body} } }`,
    variables: { id: Number(id) }
  }
}

export default function App() {
  const [mode, setMode] = useState('students') // 'students' | 'cat'
  const [selectedStudentFields, setSelectedStudentFields] = useState(['id', 'firstName', 'email'])
  const [selectedCatFields, setSelectedCatFields] = useState(['id', 'name', 'origin'])
  const [catId, setCatId] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleField = (field, isStudent) => {
    if (isStudent) {
      setSelectedStudentFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field])
    } else {
      setSelectedCatFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field])
    }
  }

  const runQuery = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      if (mode === 'students') {
        const q = buildStudentsQuery(selectedStudentFields)
        const response = await client.query({ query: q, fetchPolicy: 'no-cache' })
        setResult(response.data.students)
      } else {
        const { query, variables } = buildCatQuery(selectedCatFields, catId)
        const response = await client.query({ query, variables, fetchPolicy: 'no-cache' })
        setResult(response.data.catBreed ? [response.data.catBreed] : [])
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>GraphQL — Cats & Students</h1>

      <div>
        <label>
          <input type="radio" checked={mode==='students'} onChange={()=>setMode('students')} /> Students
        </label>{' '}
        <label>
          <input type="radio" checked={mode==='cat'} onChange={()=>setMode('cat')} /> Cat Breed
        </label>
      </div>

      {mode==='cat' && (
        <div style={{ marginTop: 10 }}>
          <label>Cat Breed ID:
            <input type="number" value={catId} onChange={e=>setCatId(e.target.value)} min="1" style={{ marginLeft: 6 }} />
          </label>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <strong>Select fields:</strong>
        <div style={{ marginTop: 8 }}>
          {(mode==='students' ? STUDENT_FIELDS : CAT_FIELDS).map(f => (
            <label key={f} style={{ marginRight: 12 }}>
              <input
                type="checkbox"
                checked={mode==='students' ? selectedStudentFields.includes(f) : selectedCatFields.includes(f)}
                onChange={()=>toggleField(f, mode==='students')}
              /> {f}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={runQuery} style={{ padding: '8px 14px' }}>Run Query</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
        {result && (
          <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {(mode==='students' ? selectedStudentFields : selectedCatFields).map(h => (
                  <th key={h} style={{ border: '1px solid #ddd', padding: 8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, i) => (
                <tr key={i}>
                  {(mode==='students' ? selectedStudentFields : selectedCatFields).map(f => (
                    <td key={f} style={{ border: '1px solid #f0f0f0', padding: 8 }}>{String(row[f] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && !result && <div style={{ marginTop: 8 }}>No results yet.</div>}
      </div>
    </div>
  )
}
