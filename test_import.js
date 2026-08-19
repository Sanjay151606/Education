const payload = {
  spreadsheetId: '1XBiLRp0Df_LiAf5o3QaEO7wrrlU-xoQDSXCbi6Bx1YI',
  spreadsheetName: 'education - Student Learning Performance',
  sheetName: 'Sheet1',
  rows: [
    {
      'Student ID': 'STU001',
      'Student Name': 'Sanjay',
      'Email': 'student@gmail.com',
      'Course': 'Data Structures',
      'Topic': 'Recursion',
      'Difficulty': 'Beginner',
      'Quiz Score': 42,
      'Mastery Score': 35,
      'Questions Attempted': 20,
      'Correct Answers': 8,
      'Study Time': 45,
      'Last Studied': '2026-08-18',
      'Completion %': 60,
      'Revision Due': '2026-08-21',
      'Learning Status': 'Weak',
      'Assignment Status': 'Pending',
      'Goal': 'Master DSA',
      'Daily Study Goal': 60,
      'AI Recommendation': 'Revise Recursion fundamentals and call stacks'
    }
  ],
  enableAI: true
};

fetch('http://localhost:5001/api/google/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => console.log('IMPORT_API_RESULT:', JSON.stringify(data, null, 2)))
.catch(err => console.error('IMPORT_API_ERROR:', err));
