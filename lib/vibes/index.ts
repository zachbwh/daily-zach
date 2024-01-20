import * as Haptics from "expo-haptics";

export const quickVibration = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
