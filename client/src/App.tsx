import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Entries from './components/Entries'; // assuming "Merkinnat" translates to "Entries"
import Login from './components/Login';
import { Padding } from '@mui/icons-material';

interface Data {
  discussions: any[],
  dataFetched: boolean,
  error: string
}

const App: React.FC = (): React.ReactElement => {
  
  // State to manage the user's token
  const [token, setToken] = useState<string>(String(localStorage.getItem("jwt")));

  return (
    <Container>
      <Typography variant='h5' sx={{paddingBottom : 2}}>Diary</Typography>

      {/* Define routes using react-router-dom */}
      <Routes>
        <Route path="/Entries" element={<Entries token={token} setToken={setToken} />} />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </Container>
  );
}

export default App;