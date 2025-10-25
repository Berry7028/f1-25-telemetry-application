import { Card, Text, Group, Stack, Progress, Box } from '@mantine/core';
import { Player, tyresDict, formatTime, ERSDict, fuelMixDict, getTempColor, teamsColorDict } from '../types/telemetry';

interface PlayerDashboardProps {
  player: Player | null;
  currentGear?: number;
  currentRPM?: number;
  maxRPM?: number;
}

export function PlayerDashboard({ player, currentGear = 7, currentRPM = 11500, maxRPM = 15000 }: PlayerDashboardProps) {
  if (!player) {
    return (
      <Card bg="dark.9" p="xl" radius="md">
        <Text c="dimmed" size="lg" ta="center">No player data available</Text>
      </Card>
    );
  }

  const tyreName = player.tyres !== null ? tyresDict[player.tyres] : '-';
  const ersPercentage = player.ERS_percentage || 0;
  const ersMode = ERSDict[player.ERS_mode] || 'NONE';
  const fuelMix = fuelMixDict[player.fuelMix] || 'Standard';
  const teamColor = teamsColorDict[player.teamId] || '#FFFFFF';
  const drsAvailable = player.DRS_allowed || player.drs;
  const drsDistance = player.DRS_activation_distance;

  // Calculate tire and brake temperatures with colors
  const [tempFL, tempFR, tempRL, tempRR] = player.tyres_temp_surface;
  const brakeTemps = [200, 240, 360, 380]; // Mock brake temps - should come from API

  return (
    <Stack gap="md">
      {/* Main Stats */}
      <Card bg="dark.9" p="xl" radius="md">
        <Group justify="space-between" mb="xl">
          <div>
            <Text size="sm" c="dimmed" mb={4}>DRIVER</Text>
            <Group gap="xs">
              <Box
                style={{
                  width: 4,
                  height: 40,
                  backgroundColor: teamColor,
                  borderRadius: 2
                }}
              />
              <div>
                <Text size="xl" fw={700} c="white">{player.name || 'Unknown'}</Text>
                <Text size="lg" c="gray.5">
                  {player.position ? `P${player.position}` : '--'}
                </Text>
              </div>
            </Group>
          </div>
          <Group gap="xl">
            <div>
              <Text size="sm" c="dimmed" mb={4}>CURRENT LAP</Text>
              <Text size="xl" fw={700} c="white">
                {formatTime(player.currentLapTime)}
              </Text>
            </div>
            <div>
              <Text size="sm" c="dimmed" mb={4}>BEST LAP</Text>
              <Text size="xl" fw={700} c="green.4">
                {formatTime(player.bestLapTime)}
              </Text>
            </div>
            <div>
              <Text size="sm" c="dimmed" mb={4}>FUEL</Text>
              <Text size="xl" fw={700} c="white">
                {player.fuelRemainingLaps > 0 ? `${player.fuelRemainingLaps.toFixed(2)} Laps` : '--'}
              </Text>
              <Text size="xs" c="dimmed">{fuelMix}</Text>
            </div>
          </Group>
        </Group>

        {/* Speed, Gear, RPM */}
        <Group justify="space-between" align="flex-end" mb="xl">
          <div>
            <Text size="xs" c="dimmed" mb={4}>SPEED</Text>
            <Group gap={4} align="baseline">
              <Text style={{ fontSize: 56 }} fw={700} c="white" lh={1}>
                {player.speed || 0}
              </Text>
              <Text size="xl" c="dimmed">KPH</Text>
            </Group>
          </div>
          <div>
            <Text size="xs" c="dimmed" mb={4} ta="center">GEAR</Text>
            <Text style={{ fontSize: 64 }} fw={700} c="red.5" ta="center" lh={1}>
              {currentGear}
            </Text>
          </div>
          <div style={{ width: 300 }}>
            <Text size="xs" c="dimmed" mb={4}>RPM</Text>
            <Group gap={4} align="center">
              <Text size="xl" fw={700} c="white">{currentRPM}</Text>
              <Progress
                value={(currentRPM / maxRPM) * 100}
                size="xl"
                radius="xs"
                style={{ flex: 1 }}
                styles={{
                  root: { backgroundColor: '#2a2a2a' },
                  section: {
                    background: 'linear-gradient(90deg, #00ff00 0%, #ffff00 50%, #ff0000 100%)'
                  }
                }}
              />
            </Group>
          </div>
        </Group>

        {/* DRS and ERS */}
        <Group justify="space-between" mb="md">
          <div style={{ flex: 1 }}>
            <Group justify="space-between" mb={8}>
              <Text size="xs" c="dimmed">DRS Availability</Text>
              {drsDistance > 0 && (
                <Text size="xs" c="cyan.5">{drsDistance}m to DRS</Text>
              )}
              {drsAvailable && (
                <Text size="xs" c="cyan.5" fw={700}>DRS AVAILABLE</Text>
              )}
            </Group>
            <Progress
              value={drsAvailable ? 100 : (drsDistance > 0 ? 50 : 0)}
              size="lg"
              radius="xs"
              color="cyan.5"
              styles={{
                root: { backgroundColor: '#2a2a2a' }
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Group justify="space-between" mb={8}>
              <Text size="xs" c="dimmed">ERS Charge</Text>
              <Text size="xs" c="green.5">{ersMode}</Text>
            </Group>
            <Progress
              value={ersPercentage}
              size="lg"
              radius="xs"
              color="green.5"
              styles={{
                root: { backgroundColor: '#2a2a2a' }
              }}
            />
          </div>
        </Group>

        {/* Tire & Brake Temperatures */}
        <div>
          <Text size="sm" c="dimmed" mb="md">Tire & Brake Temperatures</Text>
          <Group justify="space-between">
            {/* Front Left */}
            <Stack gap={8} align="center">
              <Text size="xs" c="dimmed">Front Left</Text>
              <Group gap={8}>
                <Box
                  style={{
                    backgroundColor: getTempColor(tempFL),
                    color: tempFL < 90 ? '#fff' : '#000',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {tempFL}°C
                </Box>
                <Box
                  style={{
                    backgroundColor: getTempColor(brakeTemps[0], true),
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {brakeTemps[0]}°C
                </Box>
              </Group>
            </Stack>

            {/* Rear Left */}
            <Stack gap={8} align="center">
              <Text size="xs" c="dimmed">Rear Left</Text>
              <Group gap={8}>
                <Box
                  style={{
                    backgroundColor: getTempColor(tempRL),
                    color: tempRL < 90 ? '#fff' : '#000',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {tempRL}°C
                </Box>
                <Box
                  style={{
                    backgroundColor: getTempColor(brakeTemps[2], true),
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {brakeTemps[2]}°C
                </Box>
              </Group>
            </Stack>

            {/* Legend */}
            <div style={{ padding: '0 20px' }}>
              <Text size="xs" c="dimmed" mb={4}>Legend:</Text>
              <Group gap={8}>
                <Box
                  style={{
                    width: 60,
                    height: 20,
                    backgroundColor: '#00ff00',
                    borderRadius: 4
                  }}
                />
                <Text size="xs" c="dimmed">Tire Temp</Text>
              </Group>
              <Group gap={8} mt={4}>
                <Box
                  style={{
                    width: 60,
                    height: 20,
                    backgroundColor: '#ff6b00',
                    borderRadius: 4
                  }}
                />
                <Text size="xs" c="dimmed">Brake Temp</Text>
              </Group>
            </div>

            {/* Front Right */}
            <Stack gap={8} align="center">
              <Text size="xs" c="dimmed">Front Right</Text>
              <Group gap={8}>
                <Box
                  style={{
                    backgroundColor: getTempColor(brakeTemps[1], true),
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {brakeTemps[1]}°C
                </Box>
                <Box
                  style={{
                    backgroundColor: getTempColor(tempFR),
                    color: tempFR < 90 ? '#fff' : '#000',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {tempFR}°C
                </Box>
              </Group>
            </Stack>

            {/* Rear Right */}
            <Stack gap={8} align="center">
              <Text size="xs" c="dimmed">Rear Right</Text>
              <Group gap={8}>
                <Box
                  style={{
                    backgroundColor: getTempColor(brakeTemps[3], true),
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {brakeTemps[3]}°C
                </Box>
                <Box
                  style={{
                    backgroundColor: getTempColor(tempRR),
                    color: tempRR < 90 ? '#fff' : '#000',
                    padding: '8px 16px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}
                >
                  {tempRR}°C
                </Box>
              </Group>
            </Stack>
          </Group>
        </div>
      </Card>
    </Stack>
  );
}
