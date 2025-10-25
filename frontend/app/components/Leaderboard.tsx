'use client';

import { Card, Table, Text, Badge, Box, Group } from '@mantine/core';
import { Player, tyresDict, tyresColorDict, formatTime } from '../types/telemetry';

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players]
    .filter(p => p.position && p.position > 0)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const rows = sortedPlayers.map((player) => {
    const tyreName = player.tyres !== null ? tyresDict[player.tyres] : '-';
    const tyreColor = tyresColorDict[tyreName] || '#FFFFFF';
    
    return (
      <Table.Tr key={player.networkId || player.name}>
        <Table.Td>
          <Text fw={700} c="white" size="lg">
            {player.position}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text c="white">{player.name || 'Unknown'}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Badge
              size="lg"
              style={{
                backgroundColor: tyreColor,
                color: tyreName === 'H' ? '#000' : '#fff',
              }}
            >
              {tyreName}
            </Badge>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text c="white">{formatTime(player.currentLapTime)}</Text>
        </Table.Td>
        <Table.Td>
          <Text c="green.4">{formatTime(player.lastLapTime)}</Text>
        </Table.Td>
        <Table.Td>
          <Text c="white">{player.speed || 0} KPH</Text>
        </Table.Td>
        <Table.Td>
          {player.pit ? (
            <Badge color="yellow">PIT</Badge>
          ) : null}
        </Table.Td>
        <Table.Td>
          <Text c="white">{player.ERS_percentage || 0}%</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card bg="dark.9" p="xl" radius="md">
      <Text size="xl" fw={700} c="white" mb="lg">Leaderboard</Text>
      <Box style={{ overflowX: 'auto' }}>
        <Table
          striped
          highlightOnHover
          styles={{
            table: {
              backgroundColor: 'transparent',
            },
            thead: {
              backgroundColor: '#1a1a1a',
            },
            th: {
              color: '#888',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: 12,
            },
            tr: {
              '&:hover': {
                backgroundColor: '#1a1a1a',
              }
            }
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pos</Table.Th>
              <Table.Th>Driver</Table.Th>
              <Table.Th>Tyre</Table.Th>
              <Table.Th>Current Lap</Table.Th>
              <Table.Th>Best Lap</Table.Th>
              <Table.Th>Speed</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>ERS</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
}
