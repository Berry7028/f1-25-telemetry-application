'use client';

import { Box, Stack, Text, UnstyledButton, Group } from '@mantine/core';
import {
  IconDashboard,
  IconMap,
  IconSettings,
  IconInfoCircle,
  IconTable
} from '@tabler/icons-react';
import { useState } from 'react';
import { teamsColorDict, teamsNameDict } from '../types/telemetry';

interface SidebarProps {
  playerName?: string;
  teamId?: number;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ playerName = 'L. Hamilton', teamId = 0, onNavigate }: SidebarProps) {
  const [active, setActive] = useState('dashboard');
  
  const teamName = teamsNameDict[teamId] || 'Mercedes-AMG Petronas';
  const teamColor = teamsColorDict[teamId] || '#00C7CD';
  const initials = playerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'leaderboard', label: 'Leaderboard', icon: IconTable },
    { id: 'trackmap', label: 'Track Map', icon: IconMap },
    { id: 'settings', label: 'Settings', icon: IconSettings },
    { id: 'sessioninfo', label: 'Session Info', icon: IconInfoCircle },
  ];

  const handleClick = (id: string) => {
    setActive(id);
    onNavigate?.(id);
  };

  return (
    <Box
      style={{
        width: 200,
        height: '100vh',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Driver info */}
      <Box p="md" style={{ borderBottom: '1px solid #2a2a2a' }}>
        <Group gap="xs" mb="xs">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: teamColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {initials}
          </Box>
          <div>
            <Text size="sm" fw={600} c="white">{playerName}</Text>
            <Text size="xs" c="dimmed">{teamName}</Text>
          </div>
        </Group>
      </Box>

      {/* Menu items */}
      <Stack gap={0} p="sm" style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <UnstyledButton
              key={item.id}
              onClick={() => handleClick(item.id)}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                backgroundColor: isActive ? '#1a1a1a' : 'transparent',
                borderLeft: `3px solid ${isActive ? teamColor : 'transparent'}`,
                marginBottom: 4,
                transition: 'all 0.2s',
              }}
            >
              <Group gap="sm">
                <Icon size={20} color={isActive ? teamColor : '#888'} />
                <Text size="sm" c={isActive ? 'white' : 'dimmed'}>
                  {item.label}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>

      {/* Help section */}
      <Box p="md" style={{ borderTop: '1px solid #2a2a2a' }}>
        <UnstyledButton style={{ width: '100%' }}>
          <Group gap="sm">
            <IconInfoCircle size={20} color="#888" />
            <Text size="sm" c="dimmed">Help</Text>
          </Group>
        </UnstyledButton>
      </Box>
    </Box>
  );
}
