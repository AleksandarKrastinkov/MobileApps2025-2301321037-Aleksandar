import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

// Custom luxury theme tweaks can be added here later if desired.
// For now we extend Tamagui's default config, which already includes
// light/dark themes, radius tokens, and good typography defaults.

const config = createTamagui({
  ...defaultConfig,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config


