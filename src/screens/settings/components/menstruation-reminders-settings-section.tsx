import { Fragment, type FC, useState } from "react";
import { View } from "react-native";

import { ListRow } from "@/components/list-row";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { getAverageCycleLength } from "@/domain/cycle";
import { compareTimesAsc, getCurrentTime } from "@/domain/time";
import { ensureReminderPermissions } from "@/notifications/ensure-reminder-permissions";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { TimePickerDialog } from "@/screens/settings/components/time-picker-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type MenstruationNotification } from "@/types/settings";
import { formatHourMinute } from "@/types/time";

type RuleTarget = { rule?: MenstruationNotification } | null;

export const MenstruationRemindersSettingsSection: FC = () => {
  const theme = useTheme();
  const { data: events } = useEventsQuery();
  const { settings, updateSettings } = useSettingsStore();
  const averageCycleLength = getAverageCycleLength(events);
  const maxRuleDay = averageCycleLength
    ? Math.max(1, Math.min(60, Math.round(averageCycleLength)))
    : 0;

  const sortedRules = settings.menstruationNotifications.toSorted(
    (left, right) =>
      left.dayToMenstruation - right.dayToMenstruation ||
      compareTimesAsc(left.notificationTime, right.notificationTime),
  );
  const showSwitch =
    settings.menstruationNotificationsEnabled ||
    settings.menstruationNotifications.length > 0;
  const showAddButton =
    settings.menstruationNotificationsEnabled ||
    settings.menstruationNotifications.length === 0;

  const [ruleTarget, setRuleTarget] = useState<RuleTarget>(null);
  const [ruleDay, setRuleDay] = useState(0);
  const [ruleMessage, setRuleMessage] = useState("");
  const [pickingTime, setPickingTime] = useState(false);

  return (
    <Fragment>
      <SettingsSectionCard
        icon="alarm"
        title={t("settings.menstruationReminders")}
        description={t("settings.notificationsBeforePredictedMenstruation")}
        right={
          showSwitch && (
            <Switch
              value={settings.menstruationNotificationsEnabled}
              onValueChange={(menstruationNotificationsEnabled) => {
                updateSettings({ menstruationNotificationsEnabled });
                if (menstruationNotificationsEnabled) {
                  ensureReminderPermissions();
                }
              }}
            />
          )
        }
      >
        {settings.menstruationNotificationsEnabled && (
          <View style={{ gap: theme.spacing.md }}>
            {sortedRules.map((rule, index) => {
              return (
                <ListRow
                  key={`${rule.dayToMenstruation}-${index}`}
                  title={t("settings.reminderRuleAtTime", {
                    rule: t("settings.reminderRule", {
                      count: rule.dayToMenstruation,
                    }),
                    time: formatHourMinute(rule.notificationTime),
                  })}
                  description={
                    rule.customMessage ??
                    t("settings.useDefaultReminderMessage")
                  }
                  onPress={() => {
                    setRuleTarget({ rule });
                    setRuleDay(rule.dayToMenstruation);
                    setRuleMessage(rule.customMessage ?? "");
                  }}
                  right={
                    <IconButton
                      onPress={() =>
                        updateSettings({
                          menstruationNotifications:
                            settings.menstruationNotifications.filter(
                              (item) => item !== rule,
                            ),
                          menstruationNotificationsEnabled:
                            settings.menstruationNotifications.length > 1,
                        })
                      }
                    >
                      <Icon name="trash" color={theme.colors.text} size={18} />
                    </IconButton>
                  }
                />
              );
            })}
          </View>
        )}

        {showAddButton && (
          <View
            style={{
              alignItems: sortedRules.length === 0 ? "flex-start" : "flex-end",
              marginTop: theme.spacing.md,
            }}
          >
            <Button
              variant="outline"
              disabled={maxRuleDay === 0}
              leftAccessory={
                <Icon name="plus" color={theme.colors.text} size={16} />
              }
              onPress={() => {
                setRuleTarget({});
                setRuleDay(0);
                setRuleMessage("");
              }}
            >
              {t("settings.addReminder")}
            </Button>
          </View>
        )}

        {showAddButton && maxRuleDay === 0 && (
          <Typography
            variant="bodySmall"
            color={theme.colors.textSecondary}
            style={{ marginTop: theme.spacing.md }}
          >
            {t("settings.tooLittlePredictionInfo")}
          </Typography>
        )}
      </SettingsSectionCard>

      <TimePickerDialog
        visible={pickingTime}
        value={ruleTarget?.rule?.notificationTime ?? getCurrentTime()}
        onClose={() => {
          setPickingTime(false);
          setRuleTarget(null);
        }}
        onSave={(time) => {
          const nextRule = {
            dayToMenstruation: ruleDay,
            customMessage: ruleMessage.trim() || null,
            notificationTime: time,
          };
          const editedRule = ruleTarget?.rule;
          updateSettings({
            menstruationNotificationsEnabled: true,
            menstruationNotifications: editedRule
              ? settings.menstruationNotifications.map((item) =>
                  item === editedRule ? nextRule : item,
                )
              : [...settings.menstruationNotifications, nextRule],
          });
          ensureReminderPermissions();

          setPickingTime(false);
          setRuleTarget(null);
        }}
      />

      <Dialog
        visible={ruleTarget !== null && !pickingTime}
        onClose={() => setRuleTarget(null)}
      >
        <View style={{ gap: theme.spacing.md }}>
          <Typography variant="titleSmall">
            {ruleTarget?.rule === undefined
              ? t("settings.addReminder")
              : t("settings.editReminder")}
          </Typography>
          <View style={{ gap: theme.spacing.sm }}>
            <Slider
              min={0}
              max={Math.max(maxRuleDay, ruleDay)}
              step={1}
              value={ruleDay}
              onValueChange={(value) => setRuleDay(Math.round(value))}
            />
            <Typography
              variant="bodySmall"
              style={{ textAlign: "center" }}
              color={theme.colors.textSecondary}
            >
              {t("settings.reminderRule", { count: ruleDay })}
            </Typography>
          </View>
          <Field
            multiline
            textAlignVertical="top"
            style={{ minHeight: 120 }}
            label={t("settings.notificationMessage")}
            value={ruleMessage}
            onChangeText={setRuleMessage}
            placeholder={t("settings.notificationMessagePlaceholder")}
          />
          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" onPress={() => setRuleTarget(null)}>
                {t("common.cancel")}
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button onPress={() => setPickingTime(true)}>
                {t("common.save")}
              </Button>
            </View>
          </View>
        </View>
      </Dialog>
    </Fragment>
  );
};
