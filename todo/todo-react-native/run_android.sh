#!/bin/bash
if [ $(whoami) != $(stat -c '%U' /dev/kvm) ]
then
  sudo chown $(whoami) -R /dev/kvm
fi
avds=($(emulator -list-avds))
emulator -avd ${avds[0]}
