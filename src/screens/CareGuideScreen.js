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
import GradientBackground from '../components/GradientBackground';

const CareGuideScreen = () => {
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
          <Text style={styles.title}>Care Guide</Text>
          <Text style={styles.subtitle}>Essential plant care knowledge</Text>
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
              <LinearGradient
                colors={['#1a1f3a', '#0f1425']}
                style={styles.topicGradient}
              >
                <View style={styles.topicHeader}>
                  <View style={styles.topicHeaderLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={topic.icon} size={24} color="#00ff88" />
                    </View>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                  </View>
                  <Ionicons
                    name={
                      expandedSection === topic.id
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={24}
                    color="#00ff88"
                  />
                </View>
                {expandedSection === topic.id && (
                  <View style={styles.topicContent}>
                    <Text style={styles.topicText}>{topic.content}</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <LinearGradient
              colors={['#00ff88', '#00cc6a']}
              style={styles.tipsGradient}
            >
              <Ionicons name="bulb" size={32} color="#000" />
              <Text style={styles.tipsTitle}>Pro Tips</Text>
              <Text style={styles.tipsText}>
                • Rotate plants weekly for even growth{'\n'}
                • Clean leaves regularly to maximize light absorption{'\n'}
                • Repot when roots fill the container{'\n'}
                • Research each plant's specific needs{'\n'}
                • Keep a care journal to track what works{'\n'}
                • Don't overthink it - plants are resilient!
              </Text>
            </LinearGradient>
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
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
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
  topicGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ff88',
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
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  topicContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 136, 0.3)',
  },
  topicText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
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
    color: '#000',
    marginTop: 12,
    marginBottom: 16,
  },
  tipsText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CareGuideScreen;

