#!/bin/zsh
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
if [ -d "/Applications/Chinese HSK Journey.app" ]; then
  open -a "/Applications/Chinese HSK Journey.app"
else
  open "/Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/dist-mac/Chinese HSK Journey.app"
fi
