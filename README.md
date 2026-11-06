<p align="center">
    <img src="assets/splash-icon.png" width="200" alt="subcycle icon">
</p>

# subcycle

App for menstrual cycle and symptoms tracking, while predicting your next cycle events for better
planning and health management.

All data is stored locally, and is not sent to any server.
Easily import and export your data.

The app is available for free with all features with no ads or paywalls.

## Usage

#### Home tab

On the top you can see which part of your menstrual cycle you're in.

In the middle is the calendar, in which you see past events and future predictions.
To edit events, tap on the date, and a popup with edit options will show.
Scroll the calendar sideways to move between months.
Tapping on the calendar header will reset the view to current date.

On the bottom is the overview of symptoms for the date, selected in calendar.
You can add or remove symptoms by tapping on the plus icon.
In the opened menu, selected symptoms will be highlighted.

#### Settings tab

Here you can set preferences for:

- Menstrual cycle prediction timespan
- Pill reminder notification time
- Enabling partner mode

You can also export or import all your data here.

#### Stats / Partner insights tab

On stats tab, you can see following statistics about your cycles:

- Average cycle length
- Average period length
- Average heavy period length

On partner insights tab, your partner can setup friendly insights into your cycle.

## Localization

Copy `src/translation/locales/en.json` to a BCP 47 language filename such as `sl.json` and translate its values. Keep `{{count}}`/`{{date}}` placeholders and supply the language’s plural forms (Slovenian: `one`, `two`, `few`, `other`; keep `zero` for “today” where present). Ordinals have their own forms; Slovenian can use `"other": "{{count}}."`.

Catalogs register automatically. Dates and calendar labels use the selected language with the Gregorian calendar; missing translations fall back to English. The same catalog supplies native reminder text and notification channel names through Expo’s locale configuration. Rebuild/install the native app after adding a language so its supported languages and native strings are included. Language selection runs at startup; relaunch after changing the app/device language. No registry edits or platform translation files are needed.
