import { type ComponentType, type FC } from "react";

import {
  IconAlarm,
  IconArrowBadgeDown,
  IconArrowBadgeUp,
  IconArrowDown,
  IconBalloon,
  IconBarbell,
  IconBedOff,
  IconBike,
  IconBolt,
  IconCactus,
  IconChartBar,
  IconChartBubble,
  IconChartRadar,
  IconCheck,
  IconCompass,
  IconDroplet,
  IconDropletHalfFilled,
  IconDropletOff,
  IconEdit,
  IconEgg,
  IconFileExport,
  IconFileImport,
  IconFolder,
  IconIceCream2,
  IconMoodAngry,
  IconMoodAnnoyed,
  IconMoodCry,
  IconMoodHappy,
  IconMoodNeutral,
  IconMoodSad,
  IconMoodSadSquint,
  IconMoodSick,
  IconPillFilled,
  IconPlus,
  IconPoo,
  IconReload,
  IconRepeat,
  IconRipple,
  IconRun,
  IconSettings2,
  IconSnowflake,
  IconToolsKitchen2,
  IconTrash,
  IconTrekking,
  IconUserHeart,
  IconX,
} from "@tabler/icons-react-native";
import type { IconProps } from "@tabler/icons-react-native";

const icons = {
  alarm: IconAlarm,
  "arrow-badge-down": IconArrowBadgeDown,
  "arrow-badge-up": IconArrowBadgeUp,
  "arrow-down": IconArrowDown,
  balloon: IconBalloon,
  barbell: IconBarbell,
  "bed-off": IconBedOff,
  bike: IconBike,
  bolt: IconBolt,
  cactus: IconCactus,
  "chart-bar": IconChartBar,
  "chart-bubble": IconChartBubble,
  "chart-radar": IconChartRadar,
  check: IconCheck,
  compass: IconCompass,
  droplet: IconDroplet,
  "droplet-half": IconDropletHalfFilled,
  "droplet-off": IconDropletOff,
  edit: IconEdit,
  egg: IconEgg,
  "file-export": IconFileExport,
  "file-import": IconFileImport,
  folder: IconFolder,
  "ice-cream-2": IconIceCream2,
  "mood-angry": IconMoodAngry,
  "mood-annoyed": IconMoodAnnoyed,
  "mood-cry": IconMoodCry,
  "mood-happy": IconMoodHappy,
  "mood-neutral": IconMoodNeutral,
  "mood-sad": IconMoodSad,
  "mood-sad-squint": IconMoodSadSquint,
  "mood-sick": IconMoodSick,
  pill: IconPillFilled,
  plus: IconPlus,
  poo: IconPoo,
  reload: IconReload,
  repeat: IconRepeat,
  ripple: IconRipple,
  run: IconRun,
  "settings-2": IconSettings2,
  snowflake: IconSnowflake,
  "tools-kitchen-2": IconToolsKitchen2,
  trash: IconTrash,
  trekking: IconTrekking,
  "user-heart": IconUserHeart,
  x: IconX,
} satisfies Record<string, ComponentType<IconProps>>;

export type IconName = keyof typeof icons;

interface AppIconProps extends IconProps {
  name: IconName;
  filled?: boolean;
}

export const Icon: FC<AppIconProps> = (props) => {
  const { name, filled = false, strokeWidth, ...iconProps } = props;
  const Component = icons[name];

  return (
    <Component
      {...iconProps}
      fill={filled ? iconProps.color : "transparent"}
      strokeWidth={filled ? 0 : (strokeWidth ?? 1.8)}
    />
  );
};
