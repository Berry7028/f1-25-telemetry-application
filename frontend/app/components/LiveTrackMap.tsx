'use client';

import { Card, Stack, Text, Box, Badge } from '@mantine/core';
import { IconFlag, IconAlertTriangle, IconShieldCheck } from '@tabler/icons-react';
import { Player, teamsColorDict } from '../types/telemetry';

interface LiveTrackMapProps {
  players?: Player[];
  events?: Array<{
    type: 'fastest_lap' | 'penalty' | 'safety_car';
    message: string;
  }>;
}

export function LiveTrackMap({ players = [], events = [] }: LiveTrackMapProps) {
  // Scale positions to canvas (adjust these values based on track data)
  const scalePosition = (x: number, z: number) => {
    const canvasWidth = 400;
    const canvasHeight = 400;
    
    // Simple scaling - may need adjustment based on actual track bounds
    const scaledX = (x / 1000) + (canvasWidth / 2);
    const scaledZ = (z / 1000) + (canvasHeight / 2);
    
    return {
      x: Math.max(0, Math.min(canvasWidth, scaledX)),
      z: Math.max(0, Math.min(canvasHeight, scaledZ))
    };
  };

  return (
    <Card bg="dark.9" p="md" radius="md" h="100%">
      <Text size="sm" fw={600} c="white" mb="md">Live Track Map</Text>
      
      {/* Track visualization */}
      <Box
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          padding: 16,
          height: 400,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Render player positions */}
        {players
          .filter(p => p.position && p.position > 0)
          .map((player) => {
            const pos = scalePosition(player.worldPositionX, player.worldPositionZ);
            const teamColor = teamsColorDict[player.teamId] || '#FFFFFF';
            
            return (
              <Box
                key={player.networkId || player.name}
                style={{
                  position: 'absolute',
                  top: pos.z,
                  left: pos.x,
                  width: 14,
                  height: 14,
                  backgroundColor: teamColor,
                  borderRadius: '50%',
                  border: '2px solid white',
                  transform: 'translate(-50%, -50%)',
                  zIndex: player.position === 1 ? 10 : 1
                }}
                title={`${player.position}. ${player.name}`}
              >
                {player.position === 1 && (
                  <Text
                    size="xs"
                    fw={700}
                    c="white"
                    style={{
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      textShadow: '0 0 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    P{player.position}
                  </Text>
                )}
              </Box>
            );
          })}
        
        {players.length === 0 && (
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Text c="dimmed" size="sm" ta="center">
              Waiting for telemetry data...
            </Text>
          </Box>
        )}
      </Box>

      {/* Event notifications */}
      <Stack gap="xs" mt="md">
        {events.length > 0 ? (
          events.slice(0, 3).map((event, index) => (
            <Badge
              key={index}
              size="lg"
              color={
                event.type === 'fastest_lap' ? 'purple' :
                event.type === 'penalty' ? 'orange' :
                'yellow.7'
              }
              variant="filled"
              leftSection={
                event.type === 'fastest_lap' ? <IconFlag size={16} /> :
                event.type === 'penalty' ? <IconAlertTriangle size={16} /> :
                <IconShieldCheck size={16} />
              }
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              {event.message}
            </Badge>
          ))
        ) : (
          <>
            <Badge
              size="lg"
              color="purple"
              variant="filled"
              leftSection={<IconFlag size={16} />}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              New Fastest Lap - VER - 1:29.706
            </Badge>
            
            <Badge
              size="lg"
              color="orange"
              variant="filled"
              leftSection={<IconAlertTriangle size={16} />}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              5 Second Penalty - GAS - Causing a collision
            </Badge>
            
            <Badge
              size="lg"
              color="yellow.7"
              variant="filled"
              leftSection={<IconShieldCheck size={16} />}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              Safety Car Deployed - Incident in Sector 3
            </Badge>
          </>
        )}
      </Stack>
    </Card>
  );
}
