## [0.0.9.4]

IN DEVELOPMENT

### Bot:

- Fixed issue with autovoter not downloading
- Updater system revamped

## [0.0.9.3.2]

### Bot:

- Added dynamic interval for checklist

## [0.0.9.3.1]

### Bot:

- Fixed a bug that make webui cannot auto reconnect
- Fixed a bug that make reboot function cause crash
- Fixed a bug that make rechecklist not work
- Fixed a bug when deleting old log file

**Note**: If somethings not working properly, use previous version (v0.0.9.2.2)

## [0.0.9.3]

### WebUI:

- Added "Quest" tab.
- Made minor changes to the layout.
- Value now updates correctly (should).
- Layout adjusted for mobile devices.
- **Bug**: If connected to WebUI before bot setup, it will not automatically connect to the bot (backend) and requires a manual reload.
- **Bug**: Reboot feature not working.

### Bot:

- Fixed notification error, now working properly.
- Made Empress and WebSocket use the same port to enable exposing localhost (documentation will come later).
- Rechecked the list.
- Random phrases now work even if hunt/battle (or both) are not enabled.
- Removed useless information used for debugging (does nothing).

**Note**: If this version causes any errors, use the previous version in the release.
