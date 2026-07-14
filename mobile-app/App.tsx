import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

type TabKey = 'dashboard' | 'schedule' | 'logs';

const colors = {
  background: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceSoft: '#F0F4FA',
  navy: '#12233F',
  teal: '#2BBCB0',
  orange: '#FF5A36',
  textMuted: 'rgba(18,35,63,0.38)',
  textSoft: 'rgba(18,35,63,0.55)',
};

const inventory = [
  { id: 'A', name: 'Vitamin D', count: 8, max: 30 },
  { id: 'B', name: 'Metformin', count: 2, max: 30 },
  { id: 'C', name: 'Atorvastatin', count: 1, max: 30 },
  { id: 'D', name: 'Aspirin', count: 20, max: 30 },
  { id: 'E', name: 'Lisinopril', count: 14, max: 30 },
  { id: 'F', name: 'Folic Acid', count: 27, max: 30 },
];

const fluids = [
  { id: 7, name: 'Syrup', volume: 320, maxVolume: 500, unit: 'mL' },
  { id: 8, name: 'Rinse', volume: 65, maxVolume: 500, unit: 'mL' },
];

const schedule = [
  { time: '08:00 AM', meds: 'Metformin 500mg · Slot B', status: 'dispensed' },
  { time: '12:00 PM', meds: 'Atorvastatin 20mg · Slot C', status: 'next' },
  { time: '06:00 PM', meds: 'Aspirin 81mg · Slot D', status: 'scheduled' },
];

const logEntries = [
  { ts: '08:01', med: 'Metformin 500mg', beam: 1, actual: 1, expected: 1, ok: true },
  { ts: '12:00', med: 'Atorvastatin 20mg', beam: 1, actual: 0, expected: 1, ok: false },
  { ts: '18:00', med: 'Aspirin 81mg', beam: 1, actual: 1, expected: 1, ok: true },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [connected, setConnected] = useState(true);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleScreen />;
      case 'logs':
        return <LogsScreen />;
      default:
        return <DashboardScreen connected={connected} setConnected={setConnected} />;
    }
  }, [activeTab, connected]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>PILLBA</Text>
            <Text style={styles.title}>Smart dispenser console</Text>
          </View>
          <View style={[styles.statusPill, connected ? styles.statusOnline : styles.statusOffline]}>
            <Text style={styles.statusLabel}>{connected ? 'Connected' : 'Offline'}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>

        <View style={styles.tabBar}>
          {[
            { key: 'dashboard' as const, label: 'Dashboard' },
            { key: 'schedule' as const, label: 'Schedule' },
            { key: 'logs' as const, label: 'Logs' },
          ].map((tab) => {
            const active = tab.key === activeTab;
            return (
              <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabItem, active && styles.tabItemActive]}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function DashboardScreen({ connected, setConnected }: { connected: boolean; setConnected: (value: boolean) => void }) {
  const lowCount = [...inventory.filter((item) => item.count / item.max < 0.1), ...fluids.filter((fluid) => fluid.volume / fluid.maxVolume < 0.1)].length;

  return (
    <View style={styles.stack}>
      <View style={[styles.heroCard, styles.heroCardDark]}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabelLight}>Device Status</Text>
            <Text style={styles.heroStatus}>{connected ? 'Connected to Pi' : 'Connection Lost'}</Text>
            <Text style={styles.heroMeta}>192.168.1.42 · PillbaUnit-01 · v2.4.1</Text>
          </View>
          <Pressable onPress={() => setConnected(!connected)} style={styles.smallActionButton}>
            <Text style={styles.smallActionText}>{connected ? 'Simulate' : 'Reconnect'}</Text>
          </Pressable>
        </View>

        <View style={styles.metricRow}>
          <Metric label="Last Sync" value="2m ago" />
          <Metric label="Log Status" value="Up to date" highlight />
          <Metric label="Uptime" value="14d 6h" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>Inventory Monitor</Text>
            <Text style={styles.sectionMeta}>8-compartment · Real-time</Text>
          </View>
          <View style={styles.alertPill}>
            <Text style={styles.alertText}>{lowCount} Low</Text>
          </View>
        </View>

        <View style={styles.slotGrid}>
          {inventory.map((slot) => {
            const pct = slot.count / slot.max;
            const isLow = pct < 0.1;
            return (
              <View key={slot.id} style={[styles.slotCard, isLow && styles.slotCardLow]}>
                <View style={[styles.pillCircle, isLow && styles.pillCircleLow]}>
                  <Text style={styles.pillCircleText}>{slot.id}</Text>
                </View>
                <Text style={styles.slotName}>{slot.name.split(' ')[0]}</Text>
                <Text style={[styles.slotCount, isLow && styles.slotCountLow]}>
                  {slot.count}/{slot.max}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.fluidStack}>
          {fluids.map((fluid) => {
            const isLow = fluid.volume / fluid.maxVolume < 0.1;
            return (
              <View key={fluid.id} style={[styles.fluidCard, isLow && styles.fluidCardLow]}>
                <View style={styles.rowBetween}>
                  <View style={styles.rowGap}>
                    <View style={styles.fluidIcon}>
                      <Text style={styles.fluidIconText}>◌</Text>
                    </View>
                    <View>
                      <Text style={styles.fluidName}>{fluid.name}</Text>
                      <Text style={styles.sectionMeta}>Slot {fluid.id} · Volumetric</Text>
                    </View>
                  </View>
                  <Text style={[styles.fluidValue, isLow && styles.slotCountLow]}>
                    {fluid.volume}
                    {fluid.unit}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${(fluid.volume / fluid.maxVolume) * 100}%` }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function ScheduleScreen() {
  return (
    <View style={styles.stack}>
      <View style={[styles.heroCard, styles.heroCardAccent]}>
        <Text style={styles.sectionLabelLight}>Next Dose</Text>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.nextDoseTime}>12:00 PM</Text>
            <Text style={styles.heroSubtext}>Atorvastatin 20mg · Slot C</Text>
          </View>
          <View style={styles.timerBadge}>
            <Text style={styles.timerLabel}>IN</Text>
            <Text style={styles.timerValue}>3:42</Text>
            <Text style={styles.timerLabel}>hours</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today&apos;s Timeline</Text>
        <View style={styles.timelineStack}>
          {schedule.map((dose) => {
            const active = dose.status === 'next';
            const done = dose.status === 'dispensed';
            return (
              <View key={dose.time} style={styles.timelineRow}>
                <View style={[styles.timelineDot, done && styles.timelineDotDone, active && styles.timelineDotNext]}>
                  <Text style={styles.timelineDotText}>{done ? '✓' : '•'}</Text>
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.timelineTime}>{dose.time}</Text>
                    <View style={[styles.timelineBadge, done && styles.timelineBadgeDone, active && styles.timelineBadgeNext]}>
                      <Text style={styles.timelineBadgeText}>{done ? 'Dispensed' : active ? 'Next Up' : 'Scheduled'}</Text>
                    </View>
                  </View>
                  <Text style={styles.sectionMeta}>{dose.meds}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function LogsScreen() {
  return (
    <View style={styles.stack}>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>Dual-Verification Ledger</Text>
            <Text style={styles.sectionMeta}>IR beam-break · Load-cell</Text>
          </View>
          <View style={styles.alertPill}>
            <Text style={styles.alertText}>1 Mismatch</Text>
          </View>
        </View>

        <View style={styles.logStack}>
          {logEntries.map((event) => (
            <View key={event.ts} style={[styles.logCard, !event.ok && styles.logCardAlert]}>
              <View style={styles.rowBetween}>
                <Text style={styles.logTimestamp}>{event.ts}</Text>
                <View style={[styles.logBadge, event.ok ? styles.logBadgeOk : styles.logBadgeAlert]}>
                  <Text style={[styles.logBadgeText, !event.ok && styles.logBadgeTextAlert]}>{event.ok ? 'Verified' : 'Mismatch'}</Text>
                </View>
              </View>
              <Text style={styles.logMed}>{event.med}</Text>
              <Text style={styles.sectionMeta}>Beam: {event.beam} pills · {event.actual} / {event.expected}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.heroCard, styles.heroCardDark]}>
        <Text style={styles.sectionLabelLight}>Unresponsive Detection</Text>
        <Text style={styles.heroStatus}>Emergency escalation timeline</Text>
        <View style={styles.timelineStack}>
          <TimelineStep step="1" label="Dose dispensed — shield opens" delay="T+0" accent={colors.teal} />
          <TimelineStep step="2" label="No collection detected → SMS blast" delay="T+15min" accent={colors.orange} />
          <TimelineStep step="3" label="Second SMS blast + emergency advisory" delay="T+30min" accent={colors.orange} />
        </View>
      </View>
    </View>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, highlight && styles.metricValueHighlight]}>{value}</Text>
    </View>
  );
}

function TimelineStep({ step, label, delay, accent }: { step: string; label: string; delay: string; accent: string }) {
  return (
    <View style={styles.timelineStep}>
      <View style={[styles.timelineStepBadge, { backgroundColor: `${accent}22` }]}>
        <Text style={[styles.timelineStepNumber, { color: accent }]}>{step}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.timelineStepDelay, { color: accent }]}>{delay}</Text>
        <Text style={styles.heroSubtext}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shell: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kicker: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: colors.navy,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusOnline: {
    backgroundColor: 'rgba(43,188,176,0.14)',
  },
  statusOffline: {
    backgroundColor: 'rgba(255,90,54,0.14)',
  },
  statusLabel: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  stack: {
    gap: 12,
  },
  heroCard: {
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  heroCardDark: {
    backgroundColor: colors.navy,
  },
  heroCardAccent: {
    backgroundColor: colors.teal,
  },
  sectionLabelLight: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  heroStatus: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 6,
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    marginTop: 4,
  },
  heroSubtext: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 18,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallActionButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  smallActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 12,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.34)',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  metricValueHighlight: {
    color: colors.teal,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    gap: 12,
    shadowColor: colors.navy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  alertPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,90,54,0.12)',
  },
  alertText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: '900',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '31.6%',
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  slotCardLow: {
    backgroundColor: 'rgba(255,90,54,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,90,54,0.22)',
  },
  pillCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(18,35,63,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCircleLow: {
    borderColor: colors.orange,
  },
  pillCircleText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '900',
  },
  slotName: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  slotCount: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  slotCountLow: {
    color: colors.orange,
  },
  fluidStack: {
    gap: 10,
  },
  fluidCard: {
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    padding: 12,
    gap: 10,
  },
  fluidCardLow: {
    backgroundColor: 'rgba(255,90,54,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,90,54,0.22)',
  },
  fluidIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fluidIconText: {
    color: colors.teal,
    fontSize: 16,
    fontWeight: '900',
  },
  fluidName: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  fluidValue: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(18,35,63,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.teal,
  },
  nextDoseTime: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    marginTop: 4,
  },
  timerBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  timerValue: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '900',
    marginVertical: 2,
  },
  timelineStack: {
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(18,35,63,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: {
    backgroundColor: colors.teal,
  },
  timelineDotNext: {
    backgroundColor: colors.orange,
  },
  timelineDotText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: -1,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
  },
  timelineTime: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  timelineBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(18,35,63,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timelineBadgeDone: {
    backgroundColor: 'rgba(43,188,176,0.12)',
  },
  timelineBadgeNext: {
    backgroundColor: 'rgba(255,90,54,0.12)',
  },
  timelineBadgeText: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: '800',
  },
  logStack: {
    gap: 10,
  },
  logCard: {
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    padding: 12,
    gap: 6,
  },
  logCardAlert: {
    backgroundColor: 'rgba(255,90,54,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,90,54,0.20)',
  },
  logTimestamp: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  logBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  logBadgeOk: {
    backgroundColor: 'rgba(43,188,176,0.12)',
  },
  logBadgeAlert: {
    backgroundColor: 'rgba(255,90,54,0.14)',
  },
  logBadgeText: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: '900',
  },
  logBadgeTextAlert: {
    color: colors.orange,
  },
  logMed: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  timelineStepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineStepNumber: {
    fontSize: 12,
    fontWeight: '900',
  },
  timelineStepDelay: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 6,
    gap: 6,
    shadowColor: colors.navy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
