#!/bin/bash
set -e

# Sync android project to Windows
rsync -a /home/dev/TFG/android/ /mnt/c/Users/hugoe/AndroidProjects/Parky/

# capacitor.settings.gradle uses relative path ../node_modules/@capacitor/*/android
# from C:\Users\hugoe\AndroidProjects\Parky → resolves to C:\Users\hugoe\AndroidProjects\node_modules\...
# so we sync only the android subdirs of each plugin (total ~1.2 MB)
CAPS=(
  "android/capacitor"
  "device/android"
  "geolocation/android"
  "haptics/android"
  "keyboard/android"
  "preferences/android"
  "splash-screen/android"
  "status-bar/android"
)

for pkg in "${CAPS[@]}"; do
  dst="/mnt/c/Users/hugoe/AndroidProjects/node_modules/@capacitor/$pkg/"
  mkdir -p "$dst"
  rsync -a "/home/dev/TFG/node_modules/@capacitor/$pkg/" "$dst"
done

echo "cap:sync → Windows OK"
