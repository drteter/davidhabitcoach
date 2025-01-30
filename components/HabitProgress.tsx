import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ProgressCircle } from './ProgressCircle';
import { Colors } from '../constants/Colors';
import { Sparkle } from './Sparkle';

interface Props {
  totalThisYear: number;
  totalThisMonth: number;
  totalThisWeek: number;
  annualGoal: number;
}

export function HabitProgress({ 
  totalThisYear, 
  totalThisMonth, 
  totalThisWeek,
  annualGoal 
}: Props) {
  // Calculate target rates
  const weeklyTarget = Math.round(annualGoal / 52);
  const monthlyTarget = Math.round(annualGoal / 12);

  // Calculate current day of year and days remaining
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const daysInYear = 365; // Could add leap year logic if needed

  // Calculate projected year-end total based on current pace
  const dailyRate = totalThisYear / dayOfYear;
  const projectedTotal = Math.round(dailyRate * daysInYear);
  const projectedProgress = (projectedTotal / annualGoal) * 100;

  // Calculate progress percentages without capping at 100%
  const yearProgress = (totalThisYear / annualGoal) * 100;
  const weekProgress = (totalThisWeek / weeklyTarget) * 100;
  const monthProgress = (totalThisMonth / monthlyTarget) * 100;

  const SparkleContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={{ position: 'relative' }}>
      {children}
      {/* Top sparkles */}
      <Sparkle style={{ top: -10, left: -10 }} size={12} delay={0} color="#FFD700" />
      <Sparkle style={{ top: -15, right: -5 }} size={10} delay={200} color="#FFA500" />
      <Sparkle style={{ top: 0, right: -12 }} size={8} delay={400} color="#FFD700" />
      
      {/* Side sparkles */}
      <Sparkle style={{ top: '40%', left: -12 }} size={9} delay={600} color="#FFA500" />
      <Sparkle style={{ top: '40%', right: -12 }} size={11} delay={800} color="#FFD700" />
      
      {/* Bottom sparkles */}
      <Sparkle style={{ bottom: -5, right: -10 }} size={8} delay={1000} color="#FFD700" />
      <Sparkle style={{ bottom: -10, left: -5 }} size={9} delay={1200} color="#FFA500" />
      <Sparkle style={{ bottom: 0, left: -12 }} size={10} delay={1400} color="#FFD700" />
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Progress
      </ThemedText>

      <View style={styles.progressGrid}>
        {/* First row - Annual and Projected */}
        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <ThemedText style={styles.label}>Annual Progress</ThemedText>
            <View style={styles.progressBox}>
              {yearProgress >= 100 ? (
                <SparkleContainer>
                  <ProgressCircle progress={yearProgress} size={80} />
                </SparkleContainer>
              ) : (
                <ProgressCircle progress={yearProgress} size={80} />
              )}
              <View style={styles.statsBox}>
                <ThemedText type="defaultSemiBold">
                  {totalThisYear.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.targetText}>
                  of {annualGoal.toLocaleString()}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.progressItem}>
            <ThemedText style={styles.label}>Projected Year-End</ThemedText>
            <View style={styles.progressBox}>
              {projectedProgress >= 100 ? (
                <SparkleContainer>
                  <ProgressCircle progress={projectedProgress} size={80} />
                </SparkleContainer>
              ) : (
                <ProgressCircle progress={projectedProgress} size={80} />
              )}
              <View style={styles.statsBox}>
                <ThemedText type="defaultSemiBold">
                  {projectedTotal.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.targetText}>
                  at current pace
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Second row - Monthly and Weekly */}
        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <ThemedText style={styles.label}>Monthly Pace</ThemedText>
            <View style={styles.progressBox}>
              {monthProgress >= 100 ? (
                <SparkleContainer>
                  <ProgressCircle progress={monthProgress} size={80} />
                </SparkleContainer>
              ) : (
                <ProgressCircle progress={monthProgress} size={80} />
              )}
              <View style={styles.statsBox}>
                <ThemedText type="defaultSemiBold">
                  {totalThisMonth.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.targetText}>
                  target: {monthlyTarget.toLocaleString()}/month
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.progressItem}>
            <ThemedText style={styles.label}>Weekly Pace</ThemedText>
            <View style={styles.progressBox}>
              {weekProgress >= 100 ? (
                <SparkleContainer>
                  <ProgressCircle progress={weekProgress} size={80} />
                </SparkleContainer>
              ) : (
                <ProgressCircle progress={weekProgress} size={80} />
              )}
              <View style={styles.statsBox}>
                <ThemedText type="defaultSemiBold">
                  {totalThisWeek.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.targetText}>
                  target: {weeklyTarget.toLocaleString()}/week
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  progressGrid: {
    gap: 16,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 16,
  },
  progressItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    marginBottom: 12,
    color: '#666',
  },
  progressBox: {
    alignItems: 'center',
    gap: 8,
  },
  statsBox: {
    alignItems: 'center',
  },
  targetText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  paceText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 