import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GradientBackground from '../components/GradientBackground';
import { useThemeMode } from '../context/ThemeContext';
import { getThemeColors } from '../theme/colors';

const CareGuideScreen = () => {
  const { mode } = useThemeMode();
  const theme = getThemeColors(mode);
  const [expandedSection, setExpandedSection] = useState(null);

  const careTopics = [
    {
      id: 'watering',
      title: 'Watering Basics',
      icon: 'water',
      content: `Watering is one of the most important aspects of plant care. Here are key tips:

• Check soil moisture before watering - stick your finger 1-2 inches into the soil
• Most plants prefer deep, infrequent watering over frequent shallow watering
• Water in the morning to allow leaves to dry during the day
• Use room temperature water to avoid shocking roots
• Ensure proper drainage - plants don't like sitting in water
• Adjust frequency based on season - plants need less water in winter`,
    },
    {
      id: 'lighting',
      title: 'Light Requirements',
      icon: 'sunny',
      content: `Understanding light needs is crucial for plant health:

• Direct sunlight: 6+ hours of direct sun (south-facing windows)
• Bright indirect: Near sunny windows but not in direct path
• Medium light: 3-4 feet from bright windows
• Low light: North-facing windows or interior rooms

Signs of too much light: Scorched leaves, faded colors
Signs of too little light: Leggy growth, small leaves, slow growth`,
    },
    {
      id: 'fertilizing',
      title: 'Fertilizing',
      icon: 'leaf',
      content: `Proper fertilization keeps plants healthy:

• Fertilize during growing season (spring/summer)
• Reduce or stop in fall/winter when growth slows
• Use balanced fertilizer (10-10-10 or 20-20-20)
• Dilute to half strength for most houseplants
• Apply to moist soil to prevent root burn
• Organic options: compost, worm castings, fish emulsion`,
    },
    {
      id: 'temperature',
      title: 'Temperature & Humidity',
      icon: 'thermometer',
      content: `Most houseplants thrive in comfortable room temperatures:

• Ideal range: 65-75°F (18-24°C) during day
• Slightly cooler at night is fine
• Avoid drafts from windows, doors, or AC vents
• Humidity: Most plants prefer 40-60% humidity
• Increase humidity with: Humidifiers, pebble trays, grouping plants
• Signs of low humidity: Brown leaf tips, crispy edges`,
    },
    {
      id: 'pests',
      title: 'Common Pests',
      icon: 'bug',
      content: `Watch for these common plant pests:

• Spider mites: Tiny webs, yellowing leaves - treat with neem oil
• Mealybugs: White cottony masses - remove with alcohol swabs
• Aphids: Small green/black bugs - spray with soapy water
• Fungus gnats: Small flies in soil - let soil dry, use sticky traps
• Scale: Brown bumps on stems - scrape off, treat with neem oil

Prevention: Regular inspection, proper watering, good air circulation`,
    },
    {
      id: 'problems',
      title: 'Common Problems',
      icon: 'medical',
      content: `Troubleshooting plant issues:

Yellow leaves:
- Overwatering (most common)
- Underwatering
- Nutrient deficiency
- Natural aging (lower leaves)

Brown tips:
- Low humidity
- Over-fertilizing
- Water quality (chlorine/fluoride)
- Underwatering

Drooping:
- Underwatering
- Overwatering (root rot)
- Temperature stress
- Too much/little light

Wilting:
- Check soil moisture
- Root issues
- Disease or pests`,
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Care Guide</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Essential plant care knowledge
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {careTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              onPress={() => toggleSection(topic.id)}
              style={styles.topicCard}
              activeOpacity={0.9}
            >
              <BlurView intensity={45} tint={theme.blurTint} style={styles.topicBlur}>
                <LinearGradient
                  colors={
                    mode === 'light'
                      ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                      : ['rgba(15,23,42,0.95)', 'rgba(30,64,175,0.8)']
                  }
                  style={[styles.topicGradient, { borderColor: theme.border }]}
                >
                  <View style={styles.topicHeader}>
                    <View style={styles.topicHeaderLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor:
                              mode === 'light'
                                ? 'rgba(124,58,237,0.15)'
                                : 'rgba(129,140,248,0.25)',
                          },
                        ]}
                      >
                        <Ionicons name={topic.icon} size={24} color={theme.iconAccent} />
                      </View>
                      <Text style={[styles.topicTitle, { color: theme.text }]}>
                        {topic.title}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        expandedSection === topic.id ? 'chevron-up' : 'chevron-down'
                      }
                      size={24}
                      color={theme.icon}
                    />
                  </View>
                  {expandedSection === topic.id && (
                    <View
                      style={[
                        styles.topicContent,
                        {
                          borderTopColor:
                            mode === 'light'
                              ? 'rgba(124,58,237,0.2)'
                              : 'rgba(0, 255, 136, 0.3)',
                        },
                      ]}
                    >
                      <Text style={[styles.topicText, { color: theme.textSecondary }]}>
                        {topic.content}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          ))}

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <BlurView intensity={50} tint={theme.blurTint} style={styles.tipsBlur}>
              <LinearGradient
                colors={['#7c3aed', '#a855f7', '#ec4899']}
                style={styles.tipsGradient}
              >
                <Ionicons name="bulb" size={32} color={mode === 'light' ? '#1e293b' : '#0b1120'} />
                <Text style={[styles.tipsTitle, { color: mode === 'light' ? '#1e293b' : '#0b1120' }]}>
                  Pro Tips
                </Text>
                <Text style={[styles.tipsText, { color: mode === 'light' ? '#1e293b' : '#0b1120' }]}>
                • Rotate plants weekly for even growth{'\n'}
                • Clean leaves regularly to maximize light absorption{'\n'}
                • Repot when roots fill the container{'\n'}
                • Research each plant's specific needs{'\n'}
                • Keep a care journal to track what works{'\n'}
                • Don't overthink it - plants are resilient!
                </Text>
              </LinearGradient>
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topicCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  topicBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  topicGradient: {
    padding: 20,
    borderWidth: 1,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  topicContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  topicText: {
    fontSize: 14,
    lineHeight: 22,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tipsBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  tipsGradient: {
    padding: 24,
    alignItems: 'center',
  },
  tipsTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 16,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CareGuideScreen;

