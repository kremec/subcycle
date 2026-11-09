import { type FC } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type PartnerInsight } from "@/types/partner-insight";

interface PartnerInsightReaderProps {
  insight: PartnerInsight;
  onClose: () => void;
  onEdit: () => void;
}

export const PartnerInsightReader: FC<PartnerInsightReaderProps> = (props) => {
  const { insight, onClose, onEdit } = props;
  const theme = useTheme();

  return (
    <Dialog visible onClose={onClose}>
      <View style={{ gap: theme.spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: theme.spacing.sm,
          }}
        >
          <Typography variant="title" style={{ flex: 1 }}>
            {insight.name}
          </Typography>
          <IconButton
            plain
            accessibilityLabel={t("common.close")}
            onPress={onClose}
          >
            <Icon name={IconName.X} size={22} color={theme.colors.text} />
          </IconButton>
        </View>
        <Typography variant="titleSmallRegular">
          {insight.description}
        </Typography>
        <Button variant="outline" onPress={onEdit}>
          {t("partner.editNote")}
        </Button>
      </View>
    </Dialog>
  );
};
