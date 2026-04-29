import { strict as assert } from "node:assert";
import { defaultNotificationPreferences, getEnabledNotificationCategories, getSettingsSummary } from "./settings";

const disabledRecordPreferences = {
  ...defaultNotificationPreferences,
  missingRecord: false,
};

assert.deepEqual(getEnabledNotificationCategories(disabledRecordPreferences), ["주의", "일정"]);

const summary = getSettingsSummary({
  notificationPreferences: disabledRecordPreferences,
  aiInsightEnabled: false,
});

assert.equal(summary.enabledNotificationCount, 2);
assert.equal(summary.aiInsightLabel, "AI 요약 꺼짐");
