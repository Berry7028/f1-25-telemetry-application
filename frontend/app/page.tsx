'use client';

import { useEffect, useState } from 'react';
import { Box, Group, Stack, LoadingOverlay } from '@mantine/core';
import { Sidebar } from './components/Sidebar';
import { SessionHeader } from './components/SessionHeader';
import { PlayerDashboard } from './components/PlayerDashboard';
import { LiveTrackMap } from './components/LiveTrackMap';
import { Leaderboard } from './components/Leaderboard';
import { Player, Session } from './types/telemetry';

const API_BASE_URL = 'http://localhost:8000';

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch session data
        const sessionRes = await fetch(`${API_BASE_URL}/api/session`);
        const sessionData = await sessionRes.json();
        setSession(sessionData);

        // Fetch player data
        const playersRes = await fetch(`${API_BASE_URL}/api/players`);
        const playersData = await playersRes.json();
        setPlayers(playersData);
        
        if (playersData && playersData.length > 0) {
          // Find the player with position (user's player)
          const userPlayer = playersData.find((p: Player) => p.position && p.position > 0);
          setPlayer(userPlayer || playersData[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Poll for updates every 100ms
    const interval = setInterval(fetchData, 100);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'leaderboard':
        return (
          <Stack gap="md">
            <Leaderboard players={players} />
          </Stack>
        );
      case 'trackmap':
        return (
          <Stack gap="md">
            <LiveTrackMap players={players} />
          </Stack>
        );
      case 'dashboard':
      default:
        return (
          <Group align="flex-start" gap="md" style={{ flexWrap: 'nowrap' }}>
            {/* Main dashboard */}
            <Box style={{ flex: 1 }}>
              <PlayerDashboard player={player} />
            </Box>
            
            {/* Right sidebar with map and events */}
            <Box style={{ width: 400 }}>
              <LiveTrackMap players={players} />
            </Box>
          </Group>
        );
    }
  };

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000' }}>
      <LoadingOverlay visible={loading} />
      
      {/* Sidebar */}
      <Sidebar 
        onNavigate={setCurrentPage} 
        playerName={player?.name || 'L. Hamilton'}
        teamId={player?.teamId || 0}
      />
      
      {/* Main content */}
      <Box style={{ flex: 1, padding: 24 }}>
        <Stack gap="md">
          <SessionHeader session={session} />
          {renderContent()}
        </Stack>
      </Box>
    </Box>
  );
}
