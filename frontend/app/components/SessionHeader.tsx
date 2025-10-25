import { Card, Text, Group, Badge } from '@mantine/core';
import { Session, sessionDict, trackDict } from '../types/telemetry';

interface SessionHeaderProps {
  session: Session | null;
}

export function SessionHeader({ session }: SessionHeaderProps) {
  if (!session) return null;

  const sessionName = session.sessionType !== null ? sessionDict[session.sessionType] : 'Unknown';
  const trackName = session.track !== null ? trackDict[session.track] : 'Unknown';
  const flagEmoji = session.flag || '';

  return (
    <Card bg="dark.9" p="md" radius="md" mb="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xl">
          <div>
            <Text size="xs" c="dimmed" mb={4}>SESSION</Text>
            <Text size="lg" fw={700} c="white">{sessionName}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" mb={4}>TRACK</Text>
            <Text size="lg" fw={700} c="white">{trackName}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" mb={4}>LAP</Text>
            <Text size="lg" fw={700} c="white">
              {session.currentLap || 0}/{session.nbLaps || 0}
            </Text>
          </div>
        </Group>
        <Group gap="md">
          <div>
            <Text size="xs" c="dimmed" mb={4}>AIR TEMP</Text>
            <Text size="lg" fw={700} c="white">{session.airTemperature || '--'}°C</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" mb={4}>TRACK TEMP</Text>
            <Text size="lg" fw={700} c="white">{session.trackTemperature || '--'}°C</Text>
          </div>
          {flagEmoji && (
            <Badge size="xl" color="green" variant="filled">
              {flagEmoji} {flagEmoji === '🟢' ? 'GREEN FLAG' : 'FLAG'}
            </Badge>
          )}
        </Group>
      </Group>
    </Card>
  );
}
